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