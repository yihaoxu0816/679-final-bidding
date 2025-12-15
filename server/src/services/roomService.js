import { db } from '../db/db.js';
import { Room } from '../models/room.js';
import { User } from '../models/user.js';

const getAllRooms = async () => {
    const roomDocs = await db.getAllInCollection(db.ROOMS);
    return roomDocs.map(rDoc => Room.fromRoomDocument(rDoc));
}

const getRoomById = async (id) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    const roomDoc = await db.getFromCollectionById(db.ROOMS, id);
    if (!roomDoc) throw new Error('Room not found.');
    return Room.fromRoomDocument(roomDoc);
}

const getRoomsByHostId = async (hostId) => {
    if (!hostId) throw new Error('Null or undefined host ID not allowed.');
    const roomDocs = await db.getManyFromCollectionByFieldValue(db.ROOMS, 'hostId', hostId);
    return roomDocs.map(rDoc => Room.fromRoomDocument(rDoc));
}

const createRoom = async (roomInfo) => {
    if (!roomInfo) throw new Error('Null or undefined room info not allowed.');
    if (!roomInfo.hostId) throw new Error('Host ID is required.');
    if (!roomInfo.itemName) throw new Error('Item name is required.');
    if (roomInfo.startingPrice === undefined || roomInfo.startingPrice < 0) {
        throw new Error('Valid starting price is required.');
    }

    // Verify host exists
    const hostDoc = await db.getFromCollectionById(db.USERS, roomInfo.hostId);
    if (!hostDoc) throw new Error('Host user not found.');

    const roomData = {
        ...roomInfo,
        currentHighestBid: roomInfo.startingPrice,
        currentHighestBidder: null,
        status: 'open',
        createdAt: new Date().toISOString(),
        closedAt: null,
    };

    const {insertedId} = await db.addToCollection(db.ROOMS, roomData);
    
    return {
        id: insertedId.toString(),
        ...roomData,
    }
}

const updateRoom = async (id, updateInfo) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    if (!updateInfo) throw new Error('Null or undefined room info not allowed.');
    
    // Remove 'id' field if present
    const { id: _, ...updateData } = updateInfo;
    
    await db.updateFromCollectionById(db.ROOMS, id, updateData);
    const updatedDoc = await db.getFromCollectionById(db.ROOMS, id);
    return Room.fromRoomDocument(updatedDoc);
}

const closeRoom = async (roomId, hostId) => {
    if (!roomId) throw new Error('Null or undefined room ID not allowed.');
    if (!hostId) throw new Error('Null or undefined host ID not allowed.');

    // Get the room
    const room = await getRoomById(roomId);
    
    // Verify the user is the host
    if (room.hostId !== hostId) {
        throw new Error('Only the host can close the room.');
    }

    // Verify room is open
    if (room.status === 'closed') {
        throw new Error('Room is already closed.');
    }

    // Close the room
    const updateData = {
        status: 'closed',
        closedAt: new Date().toISOString(),
    };
    await db.updateFromCollectionById(db.ROOMS, roomId, updateData);

    // If there's a winning bidder, transfer item and deduct balance
    if (room.currentHighestBidder) {
        const winnerDoc = await db.getFromCollectionById(db.USERS, room.currentHighestBidder);
        if (!winnerDoc) throw new Error('Winner user not found.');
        
        const winner = User.fromUserDocument(winnerDoc);

        // Deduct balance and add item to winner's itemsWon
        const newBalance = winner.balance - room.currentHighestBid;
        const itemWon = {
            itemName: room.itemName,
            itemDescription: room.itemDescription,
            amount: room.currentHighestBid,
            roomId: roomId,
            wonAt: new Date().toISOString(),
        };
        
        const updatedItemsWon = [...(winner.itemsWon || []), itemWon];
        
        await db.updateFromCollectionById(db.USERS, room.currentHighestBidder, {
            balance: newBalance,
            itemsWon: updatedItemsWon,
        });
    }

    // Return updated room
    const closedRoomDoc = await db.getFromCollectionById(db.ROOMS, roomId);
    return Room.fromRoomDocument(closedRoomDoc);
}

const deleteRoom = async (id) => {
    if (!id) throw new Error('Null or undefined ID not allowed.');
    const {deletedCount} = await db.deleteFromCollectionById(db.ROOMS, id);
    return {deletedCount};
}

export const roomService = {
    getAllRooms,
    getRoomById,
    getRoomsByHostId,
    createRoom,
    updateRoom,
    closeRoom,
    deleteRoom,
}

