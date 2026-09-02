import { API_BASE_URL } from '../config/api';
import { TaskType, BackendTaskItem } from '../types/task';

/**
 * This function receives an authentication token string.
 * It fetches the current user tasks from the API.
 * It returns an array of mapped TaskType objects.
 */
export async function fetchTasks(token: string): Promise<TaskType[]> {
  const res = await fetch(`${API_BASE_URL}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }

  const responseData = await res.json();
  
  const tasksArray: BackendTaskItem[] = responseData.data || [];
  

  return tasksArray.map((item: BackendTaskItem) => ({
    id: item.id,
    name: item.title || '',
    description: item.description || '',
    completed: Boolean(item.completed)
  }));
}

/**
 * This function receives a new task object and a token.
 * It sends a request to the server to create the task.
 * It returns the confirmed task object from the backend.
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
 * This function receives a task ID and a token.
 * It executes a delete request against the API.
 * It returns nothing (void) upon success.
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
 * This function receives a task object and a token.
 * It sends a patch request to flip the task completion status.
 * It returns nothing (void) upon success.
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