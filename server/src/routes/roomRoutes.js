import express from 'express';
import { roomControllers } from '../controllers/roomControllers.js';
import { bidControllers } from '../controllers/bidControllers.js';
import { validateJWT } from '../middleware/validateJWT.js';

const roomRouter = express.Router();

// Get all rooms
roomRouter.get('/', roomControllers.getAllRooms);

// Get a room by id
roomRouter.get('/:id', roomControllers.getRoomById);

// Get rooms by host id
roomRouter.get('/host/:hostId', roomControllers.getRoomsByHostId);

// Create a room (requires authentication)
roomRouter.post('/', validateJWT, roomControllers.createRoom);

// Update a room (requires authentication)
roomRouter.patch('/:id', validateJWT, roomControllers.updateRoom);

// Close a room (special endpoint - requires authentication)
roomRouter.post('/:id/close', validateJWT, roomControllers.closeRoom);

// Delete a room (requires authentication)
roomRouter.delete('/:id', validateJWT, roomControllers.deleteRoom);

// Get bids for a room
roomRouter.get('/:roomId/bids', bidControllers.getBidsByRoomId);

// Place a bid in a room (nested resource - requires authentication)
roomRouter.post('/:roomId/bids', validateJWT, bidControllers.placeBid);

export { roomRouter };

