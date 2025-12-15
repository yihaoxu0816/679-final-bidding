import { roomService } from '../services/roomService.js';

const getAllRooms = async (req, res) => {
    const allRooms = await roomService.getAllRooms();
    res.json(allRooms);
}

const getRoomById = async (req, res) => {
    const {id} = req.params;
    const room = await roomService.getRoomById(id);
    res.json(room);
}

const getRoomsByHostId = async (req, res) => {
    const {hostId} = req.params;
    const rooms = await roomService.getRoomsByHostId(hostId);
    res.json(rooms);
}

const createRoom = async (req, res) => {
    const roomData = req.body;
    const room = await roomService.createRoom(roomData);
    res.json(room);
}

const updateRoom = async (req, res) => {
    const {id} = req.params;
    const updatedRoom = await roomService.updateRoom(id, req.body);
    res.json(updatedRoom);
}

const closeRoom = async (req, res) => {
    const {id} = req.params;
    const {hostId} = req.body;
    const closedRoom = await roomService.closeRoom(id, hostId);
    res.json(closedRoom);
}

const deleteRoom = async (req, res) => {
    const {id} = req.params;
    const result = await roomService.deleteRoom(id);
    res.json(result);
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

