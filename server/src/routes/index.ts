import { Router } from 'express';
import authRoutes from './auth/index.js';
import taskRoutes from './tasks/index.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Mount nested sub-routers
router.use('/auth', authRoutes);
router.use('/tasks', authenticateToken, taskRoutes);

export default router;