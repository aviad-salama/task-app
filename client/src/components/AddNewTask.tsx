import { useForm, SubmitHandler } from 'react-hook-form';
import { TaskContent, TaskType} from '../types/task';
import { memo } from 'react';

// Define the Props expected by AddNewTask
interface AddNewTaskProps {
  onAddTask: (newTask: TaskType) => void;
}



function AddNewTask({ onAddTask }: AddNewTaskProps) {
  // Initialize react-hook-form methods
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskContent>();

  // Runs only if form validations pass
  const onSubmit: SubmitHandler<TaskContent> = (data) => {
    const newTask: TaskType = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      description: data.description?.trim() ?? '',
      completed: false
    };

    // Pass new task to parent component
    onAddTask(newTask);

    // Reset input fields
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 bg-slate-800 p-4 rounded-lg border border-slate-700">

      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Task name"
          // Register field with validation rule
          {...register('name', { required: 'Task name is required' })}
          className="p-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
        />
        {/* Render validation error if present */}
        {errors.name && (
          <span className="text-red-400 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Task description"
          {...register('description')}
          className="p-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Add Task
      </button>
    </form>
  );
}

export default memo(AddNewTask);