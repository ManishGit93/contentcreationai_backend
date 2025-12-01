import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import proposalRoutes from './routes/proposal.routes';
import templateRoutes from './routes/template.routes';
import aiRoutes from './routes/ai.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ProposalPilot API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

