import { type Response } from 'express';
import type { AuthenticatedRequest} from '../types/express.d.js';
import { addTask, listTasks, deleteTask, completeTask, type Task } from '../services/task.service.js';
import { getCache, setCache, invalidateUserTaskCache } from '../services/cache.service.js';


/**
 * HTTP Handler to list tasks belonging to the authenticated user.
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

    // CHANGED: Passed userId to listTasks
    const tasks = await listTasks(userId, filter);
    await setCache(cacheKey, tasks, 60);

    return res.json({ source: 'database', data: tasks });
  } catch (error) {
    console.error('Failed to retrieve tasks:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * HTTP Handler to create a task assigned to the authenticated user.
 */
export async function createTaskHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { title, description } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const taskDescription = typeof description === 'string' ? description : '';
    // CHANGED: Passed userId to addTask
    const newTask = await addTask(title, taskDescription, userId);
    await invalidateUserTaskCache(userId);

    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Failed to create task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * HTTP Handler to toggle status of a task owned by the authenticated user.
 */
export async function updateTaskHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    // CHANGED: Passed userId to completeTask
    const updatedTask = await completeTask(id, userId);
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
 * HTTP Handler to delete a task owned by the authenticated user.
 */
export async function deleteTaskHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    // CHANGED: Passed userId to deleteTask
    const success = await deleteTask(id, userId);
    if (!success) {
      return res.status(404).json({ error: `Task ${id} not found.` });
    }

    await invalidateUserTaskCache(userId);
    return res.status(204).send();
  } catch (error) {
    console.error('Failed to delete task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}