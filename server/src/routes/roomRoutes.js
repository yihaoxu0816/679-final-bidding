import express from 'express';
import { roomControllers } from '../controllers/roomControllers.js';
import { bidControllers } from '../controllers/bidControllers.js';

const roomRouter = express.Router();

// Get all rooms
roomRouter.get('/', roomControllers.getAllRooms);

// Get a room by id
roomRouter.get('/:id', roomControllers.getRoomById);

// Get rooms by host id
roomRouter.get('/host/:hostId', roomControllers.getRoomsByHostId);

// Create a room
roomRouter.post('/', roomControllers.createRoom);

// Update a room
roomRouter.patch('/:id', roomControllers.updateRoom);

// Close a room (special endpoint)
roomRouter.post('/:id/close', roomControllers.closeRoom);

// Delete a room
roomRouter.delete('/:id', roomControllers.deleteRoom);

// Get bids for a room
roomRouter.get('/:roomId/bids', bidControllers.getBidsByRoomId);

// Place a bid in a room (nested resource)
roomRouter.post('/:roomId/bids/user/:userId', bidControllers.placeBid);

export { roomRouter };

