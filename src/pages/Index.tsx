
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Task, TaskPriority } from '../types/task';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import FilterTabs from '../components/FilterTabs';
import MotivationalMessage from '../components/MotivationalMessage';
import { 
  generateId, 
  loadTasks, 
  saveTasks, 
  sortTasks, 
  filterTasks,
  isTaskOverdue
} from '../utils/taskUtils';
import { ArrowUpDown, Bell } from 'lucide-react';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [checkedForOverdueTasks, setCheckedForOverdueTasks] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = loadTasks();
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  // Check for overdue tasks on first render
  useEffect(() => {
    if (!checkedForOverdueTasks && tasks.length > 0) {
      const overdueTasks = tasks.filter(task => isTaskOverdue(task));
      
      if (overdueTasks.length > 0) {
        const taskText = overdueTasks.length === 1 
          ? 'You have 1 overdue task' 
          : `You have ${overdueTasks.length} overdue tasks`;
        
        toast(taskText, {
          description: "These tasks have passed their due date.",
          icon: <Bell className="text-red-500" />,
          duration: 5000,
        });
      }
      
      setCheckedForOverdueTasks(true);
    }
  }, [tasks, checkedForOverdueTasks]);

  // Add a new task
  const handleAddTask = (title: string, priority: TaskPriority) => {
    const newTask: Task = {
      id: generateId(),
      title,
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    
    setTasks(prevTasks => [newTask, ...prevTasks]);
    
    toast.success('Task added', {
      description: title,
      position: 'top-center',
      duration: 2000,
    });
  };

  // Toggle task completion
  const handleToggleComplete = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { 
              ...task, 
              completed: !task.completed,
              completedAt: !task.completed ? Date.now() : undefined
            } 
          : task
      )
    );
  };

  // Delete a task
  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    toast.success('Task deleted', {
      position: 'top-center',
      duration: 2000,
    });
  };

  // Handle filter change
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  // Computed properties
  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;
  
  // Get filtered and sorted tasks
  const filteredTasks = filterTasks(tasks, filter);
  const sortedAndFilteredTasks = sortTasks(filteredTasks, sortBy);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Elegant Tasks
          </h1>
          <p className="text-gray-600">
            Achieve more with less
          </p>
        </div>
        
        <TaskInput onAddTask={handleAddTask} existingTasks={tasks} />
        
        <div className="mb-6 flex justify-between items-center">
          <FilterTabs 
            filter={filter} 
            onFilterChange={handleFilterChange}
            activeCount={activeCount}
            completedCount={completedCount}
          />
          
          <div className="relative group">
            <button 
              onClick={() => {
                const nextSort = sortBy === 'priority' 
                  ? 'dueDate' 
                  : sortBy === 'dueDate' 
                    ? 'alphabetical' 
                    : sortBy === 'alphabetical' 
                      ? 'created' 
                      : 'priority';
                handleSortChange(nextSort);
              }}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 py-1 px-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ArrowUpDown size={16} />
              <span>Sort</span>
            </button>
            
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
              <div className="py-1">
                {['priority', 'dueDate', 'alphabetical', 'created'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortBy === option 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option === 'priority' && 'By Priority'}
                    {option === 'dueDate' && 'By Due Date'}
                    {option === 'alphabetical' && 'Alphabetically'}
                    {option === 'created' && 'By Creation Date'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-container p-4 sm:p-6">
          <TaskList 
            tasks={sortedAndFilteredTasks} 
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        </div>
        
        <MotivationalMessage tasks={tasks} />
      </div>
    </div>
  );
};

export default Index;
