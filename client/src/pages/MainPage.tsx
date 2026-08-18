import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import Task from '../components/Task';
import AddNewTask from '../components/AddNewTask';
import { TaskType, BackendTaskItem } from '../types/task';
import { API_BASE_URL } from '../config/api';

interface MainPageProps {
  token: string;
  onLogout: () => void;
}

/**
 * Decodes base64 payload from JWT token.
 */
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function MainPage({ token, onLogout }: MainPageProps) {
  const queryClient = useQueryClient();

  // Extract user's mandatory name directly from JWT payload
  const tokenPayload = parseJwt(token);
  const userName = tokenPayload?.name ? tokenPayload.name.trim() : '';
  const pageTitle = `${userName}'s Tasks`;

  // ==========================================
  // TANSTACK QUERY: FETCH TASKS (GET)
  // ==========================================
  const { data: tasks = [], isLoading, isError } = useQuery<TaskType[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
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

      const mappedTasks: TaskType[] = tasksArray.map((item: BackendTaskItem) => ({
        id: item.id,
        name: item.title || item.name || '',
        description: item.description || item.details || item.body || item.content || item.desc || '',
        completed: Boolean(item.completed)
      }));

      return mappedTasks;
    }
  });

  // ==========================================
  // TANSTACK QUERY: ADD TASK (POST)
  // ==========================================
  const addTaskMutation = useMutation({
    mutationFn: async (newTask: TaskType) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // ==========================================
  // TANSTACK QUERY: DELETE TASK (DELETE)
  // ==========================================
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // ==========================================
  // TANSTACK QUERY: TOGGLE TASK STATUS (PATCH)
  // ==========================================
  const toggleTaskMutation = useMutation({
    mutationFn: async (task: TaskType) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const handleAddTask = useCallback((newTask: TaskType) => {
    addTaskMutation.mutate(newTask);
  }, [addTaskMutation]);

  const handleDeleteTask = useCallback((id: string) => {
    deleteTaskMutation.mutate(id);
  }, [deleteTaskMutation]);

  const handleCompleted = useCallback((id: string) => {
    const targetTask = tasks.find(t => t.id === id);
    if (targetTask) {
      toggleTaskMutation.mutate(targetTask);
    }
  }, [tasks, toggleTaskMutation]);

  if (isLoading) {
    return <div className="text-white text-center mt-20 text-xl">Loading tasks...</div>;
  }

  if (isError) {
    return <div className="text-red-500 text-center mt-20 text-xl">Error loading tasks from server</div>;
  }

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const activeTasks = safeTasks.filter(task => !task.completed);
  const completedTasks = safeTasks.filter(task => task.completed);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        {/* Directly renders user name heading */}
        <h1 className="text-3xl font-bold text-white capitalize">{pageTitle}</h1>
        <button 
          onClick={onLogout}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-1.5 rounded transition-colors border border-slate-700"
        >
          Logout
        </button>
      </header>

      <main className="w-full max-w-md flex flex-col gap-6">
        <div className="flex gap-4 flex-col">
          {activeTasks.map((task) => (
            <Task 
              key={task.id}
              id={task.id} 
              name={task.name} 
              description={task.description} 
              completed={task.completed} 
              onDelete={handleDeleteTask} 
              onComplete={handleCompleted} 
            />
          ))}
        </div>

        <AddNewTask onAddTask={handleAddTask} />

        {completedTasks.length > 0 && (
          <>
            <div className="text-2xl font-bold text-slate-500 mt-4 border-b border-slate-800 pb-2">
              Completed Tasks
            </div>
            <div className="flex flex-col gap-4 opacity-70">
              {completedTasks.map((task) => (
                <Task 
                  key={task.id}
                  id={task.id} 
                  name={task.name} 
                  description={task.description} 
                  completed={task.completed} 
                  onDelete={handleDeleteTask} 
                  onComplete={handleCompleted} 
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default MainPage;