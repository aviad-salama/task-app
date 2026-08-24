import { Router } from 'express';
import {getTasksHandler, createTaskHandler, updateTaskHandler, deleteTaskHandler} from '../../controllers/task.controller.js';

const router = Router();

// Defines CRUD endpoints for task management
router.get('/', getTasksHandler);
router.post('/', createTaskHandler);
router.patch('/:id', updateTaskHandler);
router.delete('/:id', deleteTaskHandler);

export default router;