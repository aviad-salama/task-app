import { API_BASE_URL } from '../config/api';
import { TaskType, BackendTaskItem } from '../types/task';

/**
 * Fetches all tasks for the authenticated user from the backend.
 */
export async function fetchTasks(token: string): Promise<TaskType[]> {
  const res = await fetch(`${API_BASE_URL}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }

  const responseData = await res.json();

  let tasksArray: BackendTaskItem[] = [];
  if (Array.isArray(responseData)) {
    tasksArray = responseData;
  } else if (responseData.data && Array.isArray(responseData.data)) {
    tasksArray = responseData.data;
  } else if (responseData.tasks && Array.isArray(responseData.tasks)) {
    tasksArray = responseData.tasks;
  }

  return tasksArray.map((item: BackendTaskItem) => ({
    id: item.id,
    name: item.title || item.name || '',
    description: item.description || item.details || item.body || item.content || item.desc || '',
    completed: Boolean(item.completed)
  }));
}

/**
 * Sends a POST request to create a new task.
 */
export async function addTaskApi(newTask: TaskType, token: string): Promise<TaskType> {
  const res = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: newTask.name,
      description: newTask.description
    })
  });

  if (!res.ok) {
    throw new Error('Failed to add task');
  }

  return res.json();
}

/**
 * Sends a DELETE request to delete a task by ID.
 */
export async function deleteTaskApi(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('Failed to delete task');
  }
}

/**
 * Sends a PATCH request to toggle task completion status.
 */
export async function toggleTaskApi(task: TaskType, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/tasks/${task.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ completed: !task.completed })
  });

  if (!res.ok) {
    throw new Error('Failed to update task');
  }
}