import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskType } from '../types/task';
import { fetchTasks, addTaskApi, deleteTaskApi, toggleTaskApi } from '../services/taskService';

/**
 * Custom hook encapsulating TanStack Query logic with Optimistic Updates for task operations.
 */
export function useTasks(token: string) {
  const queryClient = useQueryClient();

  // Fetch tasks query
  const query = useQuery<TaskType[]>({
    queryKey: ['tasks'],
    queryFn: () => fetchTasks(token)
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: (newTask: TaskType) => addTaskApi(newTask, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // Delete task mutation with OPTIMISTIC UPDATE
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => deleteTaskApi(id, token),
    onMutate: async (id: string) => {
      // Cancel ongoing refetches so they don't overwrite optimistic result
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot current cache state
      const previousTasks = queryClient.getQueryData<TaskType[]>(['tasks']);

      // Optimistically update cache immediately
      if (previousTasks) {
        queryClient.setQueryData<TaskType[]>(
          ['tasks'],
          previousTasks.filter((task) => task.id !== id)
        );
      }

      // Context value passed to onError for rollback
      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      // Rollback to previous state if server request fails
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      // Refetch from server after mutation settles
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // Toggle task completion mutation with OPTIMISTIC UPDATE
  const toggleTaskMutation = useMutation({
    mutationFn: (task: TaskType) => toggleTaskApi(task, token),
    onMutate: async (taskToToggle: TaskType) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<TaskType[]>(['tasks']);

      if (previousTasks) {
        queryClient.setQueryData<TaskType[]>(
          ['tasks'],
          previousTasks.map((t) =>
            t.id === taskToToggle.id ? { ...t, completed: !t.completed } : t
          )
        );
      }

      return { previousTasks };
    },
    onError: (_err, _task, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  return {
    tasks: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    addTask: addTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    toggleTask: toggleTaskMutation.mutate
  };
}