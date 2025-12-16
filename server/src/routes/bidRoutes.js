import express from 'express';
import { bidControllers } from '../controllers/bidControllers.js';
import { validateJWT } from '../middleware/validateJWT.js';

const bidRouter = express.Router();

// Get bids by room id
bidRouter.get('/room/:roomId', bidControllers.getBidsByRoomId);

// Get bids by user id
bidRouter.get('/user/:userId', bidControllers.getBidsByUserId);

// Place a bid (requires authentication)
bidRouter.post('/room/:roomId', validateJWT, bidControllers.placeBid);

export { bidRouter };

