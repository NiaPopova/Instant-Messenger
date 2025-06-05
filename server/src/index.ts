import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';

import messageRoutes from './routes/messages';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import channelRoutes from './routes/channels';
import { socketSetUp } from './socketio';

dotenv.config();

// —————————————————————————————————————————————————————————
// 1. ENVIRONMENT SETUP & VALIDATION
// —————————————————————————————————————————————————————————
const PORT = parseInt(process.env.SERVER_PORT || '3000', 10);

if (!process.env.DB_URL || !process.env.DB_NAME) {
  console.error('❌  Missing DB_URL or DB_NAME in .env');
  process.exit(1);
}
const MONGO_URI = `${process.env.DB_URL}/${process.env.DB_NAME}`;

// If you want to limit CORS to certain origins, set CORS_ORIGIN="https://app.example.com,http://localhost:3000"
const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['*'];

// —————————————————————————————————————————————————————————
// 2. EXPRESS + HTTP + SOCKET.IO SETUP
// —————————————————————————————————————————————————————————
const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// —————————————————————————————————————————————————————————
// 3. GLOBAL MIDDLEWARE
// —————————————————————————————————————————————————————————
// Enable CORS
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Parse JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// —————————————————————————————————————————————————————————
// 4. ROUTES (all prefixed under /api)
// —————————————————————————————————————————————————————————
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/channel', channelRoutes);

// Simple health-check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', ts: new Date().toISOString() });
});

// Initialize your Socket.IO event handlers
socketSetUp(io);

// —————————————————————————————————————————————————————————
// 5. STATIC FILES + “SPA Fallback” MIDDLEWARE
// —————————————————————————————————————————————————————————
// Point this at wherever your client build lives:
const clientBuildPath = path.join(__dirname, '../../client/build');
app.use(express.static(clientBuildPath));

// If a request is a GET and doesn’t start with /api, serve index.html.
// This avoids using app.get('*', …) (which can trip path-to-regexp in some versions).
app.use((req: Request, res: Response, next: NextFunction) => {
  if (
    req.method === 'GET' &&
    !req.path.startsWith('/api') &&
    req.accepts('html')
  ) {
    return res.sendFile(path.join(clientBuildPath, 'index.html'));
  }
  next();
});

// —————————————————————————————————————————————————————————
// 6. ERROR-HANDLING MIDDLEWARE
// (any thrown error in routes ends up here)
// —————————————————————————————————————————————————————————
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled Error:', err);
    res
      .status(err.status || 500)
      .json({ error: err.message || 'Internal Server Error' });
  }
);

// —————————————————————————————————————————————————————————
// 7. CONNECT TO MONGO & START SERVER
// —————————————————————————————————————————————————————————
(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB');

    server.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  }
})();
