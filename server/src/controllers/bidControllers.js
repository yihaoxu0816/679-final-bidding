import { bidService } from '../services/bidService.js';

const getBidsByRoomId = async (req, res) => {
    const {roomId, id} = req.params;
    // Handle both /bids/room/:roomId and /rooms/:id/bids patterns
    const actualRoomId = roomId || id;
    const bids = await bidService.getBidsByRoomId(actualRoomId);
    res.json(bids);
}

const getBidsByUserId = async (req, res) => {
    const {userId} = req.params;
    const bids = await bidService.getBidsByUserId(userId);
    res.json(bids);
}

const placeBid = async (req, res) => {
    const {roomId, userId} = req.params;
    const bidData = {
        ...req.body,
        roomId: roomId,
        userId: userId
    };
    const bid = await bidService.placeBid(bidData);
    res.json(bid);
}

export const bidControllers = {
    getBidsByRoomId,
    getBidsByUserId,
    placeBid,
}

