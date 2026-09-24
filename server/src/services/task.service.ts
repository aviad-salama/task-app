import { db } from '../prisma/db.js';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  description: string | null;
  user_id: string;
}

/**
 * This function receives a title, an optional description, and a user ID.
 * It creates a new task record in the database linked to the specific user.
 * It returns the newly created Task object.
 */
export async function addTask(title: string, description: string = '', userId: string): Promise<Task> {
  const newTask = await db.orm.public.Task.create({
    title: title,
    description: description,
    user_id: userId as any,
    completed: false
  } as any);

  return newTask as unknown as Task;
}

/**
 * This function receives a user ID and a status filter string.
 * It fetches the matching tasks for the user from the database.
 * It returns an array of Task objects sorted by title.
 */
export async function listTasks(userId: string, filter: string = 'all'): Promise<Task[]> {
  let query = db.orm.public.Task.where({ user_id: userId as any });

  if (filter === 'pending') {
    query = query.where({ completed: false });
  } else if (filter === 'done') {
    query = query.where({ completed: true });
  }

  const tasks = await query.orderBy((model) => model.title.asc()).all();
  return tasks as unknown as Task[];
}

/**
 * This function receives a task ID and a user ID.
 * It deletes the matching task from the database.
 * It returns a boolean indicating if the deletion was successful.
 */
export async function deleteTask(id: string, userId: string): Promise<boolean> {
  const deletedTask = await db.orm.public.Task.where({ 
    id: id as any, 
    user_id: userId as any 
  }).delete();
  
  return deletedTask !== null && deletedTask !== undefined;
}

/**
 * This function receives a task ID and a user ID.
 * It finds the task and toggles its boolean completion status.
 * It returns the updated Task object, or null if not found.
 */
export async function completeTask(id: string, userId: string): Promise<Task | null> {
  const task = await db.orm.public.Task.where({ 
    id: id as any, 
    user_id: userId as any 
  }).first();
  
  if (!task) {
    return null;
  }

  // Await the update but do not assign it to a variable trying to access index 0
  await db.orm.public.Task.where({ 
    id: id as any, 
    user_id: userId as any 
  }).update({
    completed: !task.completed
  });

  // Re-fetch the updated task to return the accurate object
  const updatedTask = await db.orm.public.Task.where({ 
    id: id as any, 
    user_id: userId as any 
  }).first();

  if (!updatedTask) {
    return null;
  }

  return updatedTask as unknown as Task;
}