import { memo } from "react";
import { TaskContent } from "../types/task";

type TaskProps = TaskContent & {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
};

// Design component whose sole purpose is to display the task on the screen.
function Task({ id, name, description, completed, onDelete, onComplete }: TaskProps) {
  return (
    // Main container positioned relatively for the absolute delete button
    <div className="relative bg-slate-800 p-4 pr-12 rounded-lg border border-slate-700 flex items-center justify-between gap-4">
      
      {/* Absolute delete button at top-right */}
      <button
        onClick={() => onDelete(id)}
        className="absolute top-2 right-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/60 w-7 h-7 rounded-full flex items-center justify-center transition-colors text-lg leading-none"
        title="Delete task"
        aria-label="Delete task"
      >
        ✕
      </button>

      {/* Task text content wrapper with min-w-0 to handle long text wrapping */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h2 className={`text-xl font-bold ${completed ? 'text-slate-500' : 'text-indigo-400'}`}>
          {name}
        </h2>
        <p className={`text-base wrap-break-word ${completed ? 'text-slate-500' : 'text-slate-300'}`}>
          {description}
        </p>
      </div>

      {/* Styled Checkbox centered on the right */}
      <div className="flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          onChange={() => onComplete(id)}
          checked={completed}
          title="Complete task"
          aria-label="Complete task"
          className="w-5 h-5 accent-indigo-500 cursor-pointer rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

    </div>
  );
}

export default memo(Task);