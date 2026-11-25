import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/+$/, '');
const isProduction = process.env.NODE_ENV === 'production';
const isMain = !process.argv[1] || process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server');

// CORS configuration (Supporting HTTP-only credentials)
app.use(
  cors({
    origin: (origin, callback) => {
      const cleanOrigin = origin ? origin.replace(/\/+$/, '') : '';
      // Allow requests with no origin (like mobile apps, curl, Postman) or matching CLIENT_URL
      if (!origin || cleanOrigin === CLIENT_URL || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body and cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Productivity Manager API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Listen on configured port when run directly
let server;

const startServer = async () => {
  try {
    await connectDB();
    if (isMain && process.env.NODE_ENV !== 'test') {
      server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`Smart Productivity Manager Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    if (isProduction) {
      console.error('FATAL: Server startup aborted due to database connection failure.');
      process.exit(1);
    }
  }
};

startServer();

export { server };
export default app;
