import { Router } from 'express';
import authRoutes from './auth/index.js';
import taskRoutes from './tasks/index.js';

const router = Router();

// Mount nested sub-routers
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export default router;