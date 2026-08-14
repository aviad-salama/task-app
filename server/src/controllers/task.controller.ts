import { type Response } from 'express';
import { type AuthenticatedRequest } from '../types/express.d.js';
import { addTask, listTasks, deleteTask, completeTask, type Task } from '../services/task.service.js';
import { getCache, setCache, invalidateUserTaskCache } from '../services/cache.service.js';

/**
 * HTTP Handler to list tasks for the authenticated user.
 * Implements Redis caching (Cache-Aside pattern). Returns data from RAM if present,
 * otherwise queries PostgreSQL and caches the result for future requests.
 */
export async function getTasksHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const filter = typeof req.query.status === 'string' ? req.query.status : 'all';
    const cacheKey = `tasks:${userId}:${filter}`;

    const cachedTasks = await getCache<Task[]>(cacheKey);
    if (cachedTasks) {
      return res.json({ source: 'cache', data: cachedTasks });
    }

    const tasks = await listTasks(filter);
    await setCache(cacheKey, tasks, 60);

    return res.json({ source: 'database', data: tasks });
  } catch (error) {
    console.error('Failed to retrieve tasks:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * HTTP Handler to create a new task. Invalidates user cache to ensure data consistency.
 */
export async function createTaskHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const newTask = await addTask(title);
    await invalidateUserTaskCache(userId);

    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Failed to create task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * HTTP Handler to toggle a task's status. Invalidates user cache.
 */
export async function updateTaskHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const updatedTask = await completeTask(id);
    if (!updatedTask) {
      return res.status(404).json({ error: `Task ${id} not found.` });
    }

    await invalidateUserTaskCache(userId);
    return res.json(updatedTask);
  } catch (error) {
    console.error('Failed to update task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * HTTP Handler to delete a task. Invalidates user cache.
 */
export async function deleteTaskHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const success = await deleteTask(id);
    if (!success) {
      return res.status(404).json({ error: `Task ${id} not found.` });
    }

    await invalidateUserTaskCache(userId);
    return res.json({ message: 'Task deleted successfully.', id });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}