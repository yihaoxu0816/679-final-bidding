import { bidService } from '../services/bidService.js';

const getBidsByRoomId = async (req, res, next) => {
    try {
        const {roomId, id} = req.params;
        const actualRoomId = roomId || id;
        const bids = await bidService.getBidsByRoomId(actualRoomId);
        res.json(bids);
    } catch (error) {
        next(error);
    }
}

const getBidsByUserId = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const bids = await bidService.getBidsByUserId(userId);
        res.json(bids);
    } catch (error) {
        next(error);
    }
}

const placeBid = async (req, res, next) => {
    try {
        const {roomId} = req.params;
        const userId = req.userId;
        
        const bidData = {
            ...req.body,
            roomId: roomId,
            userId: userId
        };
        const bid = await bidService.placeBid(bidData);
        res.json(bid);
    } catch (error) {
        next(error);
    }
}

export const bidControllers = {
    getBidsByRoomId,
    getBidsByUserId,
    placeBid,
}

