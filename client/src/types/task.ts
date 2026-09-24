//Defining the main data structure of a task
export interface TaskContent{       
    name: string;        
    description: string;   
}
//extending the data structure to include id and completed.
export interface TaskType extends TaskContent {
  id: string;
  completed: boolean;
}

// Interface representing the raw task structure returned by the backend
export interface BackendTaskItem {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  completed?: boolean;
}