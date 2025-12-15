import { db } from '../db/db.js';
import { Bid } from '../models/bid.js';
import { User } from '../models/user.js';
import { Room } from '../models/room.js';

const getBidsByRoomId = async (roomId) => {
    if (!roomId) throw new Error('Null or undefined room ID not allowed.');
    
    // Get bids sorted by timestamp (most recent first)
    const bidDocs = await db.getManyFromCollectionWithSort(
        db.BIDS, 
        { roomId }, 
        'timestamp', 
        -1
    );
    
    return bidDocs.map(bDoc => Bid.fromBidDocument(bDoc));
}

const getBidsByUserId = async (userId) => {
    if (!userId) throw new Error('Null or undefined user ID not allowed.');
    
    const bidDocs = await db.getManyFromCollectionWithSort(
        db.BIDS,
        { userId },
        'timestamp',
        -1
    );
    
    return bidDocs.map(bDoc => Bid.fromBidDocument(bDoc));
}

const placeBid = async (bidInfo) => {
    if (!bidInfo) throw new Error('Null or undefined bid info not allowed.');
    if (!bidInfo.roomId) throw new Error('Room ID is required.');
    if (!bidInfo.userId) throw new Error('User ID is required.');
    if (!bidInfo.amount || bidInfo.amount <= 0) throw new Error('Valid bid amount is required.');

    // Get the room
    const roomDoc = await db.getFromCollectionById(db.ROOMS, bidInfo.roomId);
    if (!roomDoc) throw new Error('Room not found.');
    const room = Room.fromRoomDocument(roomDoc);

    // Verify room is open
    if (room.status === 'closed') {
        throw new Error('Cannot bid on a closed room.');
    }

    // Verify user is not the host
    if (room.hostId === bidInfo.userId) {
        throw new Error('Host cannot bid on their own room.');
    }

    // Verify bid is higher than current highest bid
    if (bidInfo.amount <= room.currentHighestBid) {
        throw new Error(`Bid must be higher than current highest bid of ${room.currentHighestBid}.`);
    }

    // Verify user exists and has sufficient balance
    const userDoc = await db.getFromCollectionById(db.USERS, bidInfo.userId);
    if (!userDoc) throw new Error('User not found.');
    const user = User.fromUserDocument(userDoc);

    if (user.balance < bidInfo.amount) {
        throw new Error('Insufficient balance to place this bid.');
    }

    // Create the bid
    const bidData = {
        roomId: bidInfo.roomId,
        userId: bidInfo.userId,
        amount: bidInfo.amount,
        timestamp: new Date().toISOString(),
    };

    const {insertedId} = await db.addToCollection(db.BIDS, bidData);

    // Update room with new highest bid
    await db.updateFromCollectionById(db.ROOMS, bidInfo.roomId, {
        currentHighestBid: bidInfo.amount,
        currentHighestBidder: bidInfo.userId,
    });

    return {
        id: insertedId.toString(),
        ...bidData,
    }
}

export const bidService = {
    getBidsByRoomId,
    getBidsByUserId,
    placeBid,
}

