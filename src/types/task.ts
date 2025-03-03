
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  createdAt: number;
  dueDate?: number;
  completedAt?: number;
}
