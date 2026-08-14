import { pool } from '../config/database.js';

/**
 * Interface representing the Task entity in the database.
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

/**
 * Initializes the 'tasks' table in the database if it doesn't exist.
 */
export async function initDb(): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE
    );
  `;
  await pool.query(query);
}

/**
 * Persists a new task in the database.
 * @returns The newly created task object.
 */
export async function addTask(title: string): Promise<Task> {
  const query = 'INSERT INTO tasks (id, title) VALUES (gen_random_uuid(), $1) RETURNING *;';
  const result = await pool.query(query, [title]);
  return result.rows[0] as Task;
}

/**
 * Fetches tasks from the database, with optional filtering by status.
 * @returns An array of Task objects ordered by title ASC.
 */
export async function listTasks(filter: string = 'all'): Promise<Task[]> {
  let query = 'SELECT * FROM tasks';
  if (filter === 'pending') {
    query += ' WHERE completed = FALSE';
  } else if (filter === 'done') {
    query += ' WHERE completed = TRUE';
  }
  query += ' ORDER BY title ASC;';

  const result = await pool.query(query);
  return result.rows as Task[];
}

/**
 * Deletes a task from the database by ID.
 * @returns Boolean indicating whether a row was actually deleted.
 */
export async function deleteTask(id: string): Promise<boolean> {
  const query = 'DELETE FROM tasks WHERE id = $1;';
  const result = await pool.query(query, [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Toggles the completion status of a task by ID.
 * @returns The updated Task object or null if the task was not found.
 */
export async function completeTask(id: string): Promise<Task | null> {
  const query = 'UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *;';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}