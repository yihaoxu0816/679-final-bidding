import { roomService } from '../services/roomService.js';

const getAllRooms = async (req, res, next) => {
    try {
        const allRooms = await roomService.getAllRooms();
        res.json(allRooms);
    } catch (error) {
        next(error);
    }
}

const getRoomById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const room = await roomService.getRoomById(id);
        res.json(room);
    } catch (error) {
        next(error);
    }
}

const getRoomsByHostId = async (req, res, next) => {
    try {
        const {hostId} = req.params;
        const rooms = await roomService.getRoomsByHostId(hostId);
        res.json(rooms);
    } catch (error) {
        next(error);
    }
}

const createRoom = async (req, res, next) => {
    try {
        const hostId = req.userId;
        
        const roomData = {
            ...req.body,
            hostId 
        };
        
        const room = await roomService.createRoom(roomData);
        res.json(room);
    } catch (error) {
        next(error);
    }
}

const updateRoom = async (req, res, next) => {
    try {
        const {id} = req.params;
        const updatedRoom = await roomService.updateRoom(id, req.body);
        res.json(updatedRoom);
    } catch (error) {
        next(error);
    }
}

const closeRoom = async (req, res, next) => {
    try {
        const {id} = req.params;
        const hostId = req.userId;
        const closedRoom = await roomService.closeRoom(id, hostId);
        res.json(closedRoom);
    } catch (error) {
        next(error);
    }
}

const deleteRoom = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await roomService.deleteRoom(id);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const roomControllers = {
    getAllRooms,
    getRoomById,
    getRoomsByHostId,
    createRoom,
    updateRoom,
    closeRoom,
    deleteRoom,
}

