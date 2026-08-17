import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import Task from '../components/Task';
import AddNewTask from '../components/AddNewTask';
import { TaskType } from '../types/task';

// Define props for MainPage
interface MainPageProps {
  token: string;
  onLogout: () => void;
}

function MainPage({ token, onLogout }: MainPageProps) {
  const queryClient = useQueryClient();

  // ==========================================
  // TANSTACK QUERY: FETCH TASKS (GET)
  // ==========================================
  // CHANGED: Replaced useState and localStorage with useQuery
  const { data: tasks = [], isLoading, isError } = useQuery<TaskType[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    }
  });

  // ==========================================
  // TANSTACK QUERY: ADD TASK (POST)
  // ==========================================
  // NEW: useMutation handles data modification on the server
  const addTaskMutation = useMutation({
    mutationFn: async (newTask: TaskType) => {
      const res = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        // We only send name and description to the server
        body: JSON.stringify({ name: newTask.name, description: newTask.description })
      });
      if (!res.ok) throw new Error('Failed to add task');
      return res.json();
    },
    // NEW: onSuccess tells TanStack Query to refresh the 'tasks' list automatically
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // ==========================================
  // TANSTACK QUERY: DELETE TASK (DELETE)
  // ==========================================
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete task');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // ==========================================
  // TANSTACK QUERY: TOGGLE TASK (PATCH)
  // ==========================================
  const toggleTaskMutation = useMutation({
    mutationFn: async (task: TaskType) => {
      const res = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!res.ok) throw new Error('Failed to update task');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // ==========================================
  // HANDLERS (Calling the mutations)
  // ==========================================
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

  // Derived state for UI
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Render loading state
  if (isLoading) return <div className="text-white text-center mt-20">Loading tasks...</div>;
  if (isError) return <div className="text-red-500 text-center mt-20">Error loading tasks</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Tasks</h1>
        <button 
          onClick={onLogout}
          className="bg-slate-800 hover:bg-slate-700 text-sm px-3 py-1 rounded transition-colors"
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