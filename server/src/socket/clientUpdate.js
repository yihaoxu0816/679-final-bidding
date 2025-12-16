import { Server } from 'socket.io';

let io = null;
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // for development only!
      methods: ["GET", "POST"]
    }
  });
  io.on('connection', (socket) => {
    console.log('A client  connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
  });
}

const updateRoom = (roomId, updatedFields) => {
  io.emit('updateRoom', roomId, updatedFields);
}

const addRoom = (room) => {
  io.emit('addRoom', room);
}

const deleteRoom = (roomId) => {
  io.emit('deleteRoom', roomId);
}

const updateBid = (bidId, updatedFields) => {
  io.emit('updateBid', bidId, updatedFields);
}

const addBid = (bid) => {
  io.emit('addBid', bid);
}

const deleteBid = (bidId) => {
  io.emit('deleteBid', bidId);
}

export const socket = {
  initSocket,
  updateRoom,
  addRoom,
  deleteRoom,
  updateBid,
  addBid,
  deleteBid
}