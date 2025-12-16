import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';

import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import { userRouter } from './routes/userRoutes.js';
import { roomRouter } from './routes/roomRoutes.js';
import { bidRouter } from './routes/bidRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { roomService } from './services/roomService.js';
import { bidService } from './services/bidService.js';
import { socket } from './socket/clientUpdate.js';


dotenv.config();

const port = 6790;
const app = express();
const server = http.createServer(app);
socket.initSocket(server);

app.use(cors());

app.use(express.json());
app.use('/users', userRouter);
app.use('/rooms', roomRouter);
app.use('/bids', bidRouter);
app.use('/auth', authRouter);

// Error handler must be AFTER all routes
app.use(errorHandler);

roomService.watchRooms();
bidService.watchBids();

server.listen(port);

