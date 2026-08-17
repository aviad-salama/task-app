import { useState, useCallback } from 'react';
import Task from './components/Task';
import AddNewTask from './components/AddNewTask'; 
import { TaskType } from './types/task';

function App() {
  //const [loggedIn, setLoggedIn] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>(() => {
    const saved = localStorage.getItem('saved-tasks');
    return saved ? JSON.parse(saved) : []; 
  });

  // Stable handler for adding tasks using useCallback
  const handleAddTask = useCallback((newTask: TaskType): void => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      localStorage.setItem('saved-tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);

  // Stable handler for toggling completed status using useCallback
  const handleCompleted = useCallback((taskId: string): void => {
    setTasks((prevTasks) => {
      const index = prevTasks.findIndex((t) => t.id === taskId);
      if (index === -1) return prevTasks;

      const updatedTask = { ...prevTasks[index], completed: !prevTasks[index].completed };
      const updatedTasks = prevTasks.toSpliced(index, 1, updatedTask);
      localStorage.setItem('saved-tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);

  // Stable handler for deleting tasks using useCallback
  const handleDeleteTask = useCallback((taskId: string): void => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== taskId);
      localStorage.setItem('saved-tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);

  // Filtered lists for JSX rendering
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-8 gap-8">
      <header className="text-6xl font-bold text-indigo-500">Tasks To Do</header>

      <main className="w-full max-w-md flex flex-col gap-6">
        
        {/* Active tasks list */}
        <div className="flex gap-4 flex-col">
          {activeTasks.map((task) => (
            <div className="flex flex-col gap-1" key={task.id}>
              <Task 
                id={task.id} 
                name={task.name} 
                description={task.description} 
                completed={task.completed} 
                onDelete={handleDeleteTask} 
                onComplete={handleCompleted} 
              />
            </div>
          ))}
        </div>

        <AddNewTask onAddTask={handleAddTask} />

        {/* Conditional header and completed tasks list */}
        {completedTasks.length > 0 && (
          <>
            <div className="text-5xl font-bold text-indigo-500">Completed Tasks</div>
            <div className="flex flex-col gap-4">
              {completedTasks.map((task) => (
                <div className="flex flex-col gap-1" key={task.id}>
                  <Task 
                    id={task.id} 
                    name={task.name} 
                    description={task.description} 
                    completed={task.completed} 
                    onDelete={handleDeleteTask} 
                    onComplete={handleCompleted} 
                  />
                </div>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default App;