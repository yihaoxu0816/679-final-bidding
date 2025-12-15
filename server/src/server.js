import http from 'http';
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import { userRouter } from './routes/userRoutes.js';
import { roomRouter } from './routes/roomRoutes.js';
import { bidRouter } from './routes/bidRoutes.js';
// import { authRouter } from './routes/authRoutes.js';

const port = 6790;
const app = express();

app.use(cors());

app.use(express.json());
app.use(errorHandler);
app.use('/users', userRouter);
app.use('/rooms', roomRouter);
app.use('/bids', bidRouter);
// app.use('/auth', authRouter);

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
    console.log(`HTTP Server running on http://localhost:${port}`);
});

