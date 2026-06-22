import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';
import taskRoutes from './routes/taskRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

import './queues/taskQueue.js';
import './queues/taskWorker.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use('/api/tasks', taskRoutes);
app.use('/api/content', contentRoutes);

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
