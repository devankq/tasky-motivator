
import React from 'react';
import { Task } from '../types/task';
import TaskItem from './TaskItem';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-400 italic">No tasks found</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "space-y-3 transition-all duration-300",
      tasks.length > 0 ? "opacity-100" : "opacity-0"
    )}>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
