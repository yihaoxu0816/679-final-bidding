import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

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
const serverPath = process.env.SERVER_DIR || import.meta.dirname;

const port = 6790;
const app = express();
const server = http.createServer(app);
socket.initSocket(server);

app.use(cors());

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bids', bidRouter);
app.use('/api/auth', authRouter);

app.use(
  express.static(
    path.join(serverPath, '../client/build')
  )
);

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(
    path.join(serverPath, '../client/build/index.html')
  );
});

app.use(errorHandler);

roomService.watchRooms();
bidService.watchBids();

server.listen(port);

