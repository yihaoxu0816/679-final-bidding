import express from 'express';
import { bidControllers } from '../controllers/bidControllers.js';

const bidRouter = express.Router();

// Get bids by room id
bidRouter.get('/room/:roomId', bidControllers.getBidsByRoomId);

// Get bids by user id
bidRouter.get('/user/:userId', bidControllers.getBidsByUserId);

// Place a bid (userId in URL for future authentication)
bidRouter.post('/user/:userId', bidControllers.placeBid);

export { bidRouter };

