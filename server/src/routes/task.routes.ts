import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getTasksHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from '../controllers/task.controller.js';

const router = Router();

// Protect all task endpoints with JWT authentication middleware
router.use(authenticateToken);

// Defines CRUD endpoints for task management, ORDER of routes matters.
router.get('/', getTasksHandler);
router.post('/', createTaskHandler);
router.patch('/:id', updateTaskHandler);
router.delete('/:id', deleteTaskHandler);

export default router;