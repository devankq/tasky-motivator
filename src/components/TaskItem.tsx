
import React, { useState } from 'react';
import { Task } from '../types/task';
import { isTaskOverdue, formatDate } from '../utils/taskUtils';
import { cn } from '@/lib/utils';
import { Check, Clock, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isOverdue = isTaskOverdue(task);
  
  const handleDelete = () => {
    setIsDeleting(true);
    // Add a small delay to allow for exit animation
    setTimeout(() => onDelete(task.id), 300);
  };
  
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return '';
    }
  };
  
  return (
    <div 
      className={cn(
        "task-card mb-3 group",
        `priority-${task.priority}`,
        task.completed ? "completed" : "",
        isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100",
        isOverdue && !task.completed ? "border-red-300" : ""
      )}
    >
      <button
        onClick={() => onToggleComplete(task.id)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          task.completed 
            ? "border-priority-completed bg-priority-completed" 
            : "border-gray-300 group-hover:border-gray-400"
        )}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed && <Check size={14} className="text-white" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 
              className={cn(
                "text-white font-medium break-words",
                task.completed ? "line-through text-white/60" : ""
              )}
            >
              {task.title}
            </h3>
            
            <div className="flex items-center mt-1 space-x-2">
              <span 
                className={cn(
                  "priority-chip",
                  `priority-${task.priority}`
                )}
              >
                {getPriorityLabel(task.priority)}
              </span>
              
              {task.dueDate && (
                <span 
                  className={cn(
                    "text-xs flex items-center",
                    task.completed 
                      ? "text-white/60" 
                      : isOverdue 
                        ? "text-red-400 font-medium" 
                        : "text-white/80"
                  )}
                >
                  <Clock size={12} className="mr-1" />
                  {isOverdue && !task.completed ? 'Overdue: ' : ''}
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleDelete}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-red-900/30 transition-colors"
        aria-label="Delete task"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default TaskItem;
