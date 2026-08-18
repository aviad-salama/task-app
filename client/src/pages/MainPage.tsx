import { useCallback } from 'react';
import Task from '../components/Task';
import AddNewTask from '../components/AddNewTask';
import { TaskType } from '../types/task';
import { useTasks } from '../hooks/useTasks';

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
  // Extract user tasks and operations from custom hook
  const { tasks, isLoading, isError, addTask, deleteTask, toggleTask } = useTasks(token);

  // Extract user's name directly from JWT payload
  const tokenPayload = parseJwt(token);
  const userName = tokenPayload?.name ? tokenPayload.name.trim() : '';
  const pageTitle = `${userName}'s Tasks`;

  // Handlers memoized using useCallback
  const handleAddTask = useCallback(
    (newTask: TaskType) => {
      addTask(newTask);
    },
    [addTask]
  );

  const handleDeleteTask = useCallback(
    (id: string) => {
      deleteTask(id);
    },
    [deleteTask]
  );

  const handleCompleted = useCallback(
    (id: string) => {
      const targetTask = tasks.find((t) => t.id === id);
      if (targetTask) {
        toggleTask(targetTask);
      }
    },
    [tasks, toggleTask]
  );

  // Guard clauses for Loading and Error states
  if (isLoading) {
    return <div className="text-white text-center mt-20 text-xl">Loading tasks...</div>;
  }

  if (isError) {
    return <div className="text-red-500 text-center mt-20 text-xl">Error loading tasks from server</div>;
  }

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const activeTasks = safeTasks.filter((task) => !task.completed);
  const completedTasks = safeTasks.filter((task) => task.completed);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center mb-8">
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