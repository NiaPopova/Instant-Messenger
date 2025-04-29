import * as express from 'express';
import * as http from 'http';
import mongoose from 'mongoose';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import { Server } from 'socket.io';
import messageRoutes from './routes/messages';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import { socketSetUp } from './socketio';
import * as path from 'path';

dotenv.config();

const options = {
    cors: { 
        origin: '*', 
        methods: ['GET', 'POST'] 
    }
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, options);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../client/src')));

app.use('/messages', messageRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

socketSetUp(io);

const url = `${process.env.DB_URL}/${process.env.DB_NAME}`;

mongoose.connect(url)
  .then(() => {
    server.listen(process.env.SERVER_PORT, () => console.log(`Server on port ${process.env.SERVER_PORT}`));
  })
  .catch(err => console.error('Mongo error:', err));