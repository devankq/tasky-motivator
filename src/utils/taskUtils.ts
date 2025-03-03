
import { Task, TaskPriority } from '../types/task';
import { toast } from 'sonner';

const STORAGE_KEY = 'todo-list-tasks';
const CHECKSUM_KEY = 'todo-list-checksum';

// Function to generate a simple checksum for data verification
export const generateChecksum = (data: string): number => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return hash;
};

// Load tasks from localStorage with checksum verification
export const loadTasks = (): Task[] => {
  try {
    const tasksJSON = localStorage.getItem(STORAGE_KEY);
    const storedChecksum = localStorage.getItem(CHECKSUM_KEY);
    
    if (!tasksJSON || !storedChecksum) return [];
    
    const calculatedChecksum = generateChecksum(tasksJSON).toString();
    
    if (calculatedChecksum !== storedChecksum) {
      console.error('Checksum verification failed. Data might be corrupted.');
      toast.error('There was an issue loading your tasks. Some data might be lost.');
      return [];
    }
    
    return JSON.parse(tasksJSON);
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

// Save tasks to localStorage with checksum
export const saveTasks = (tasks: Task[]): void => {
  try {
    const tasksJSON = JSON.stringify(tasks);
    const checksum = generateChecksum(tasksJSON).toString();
    
    localStorage.setItem(STORAGE_KEY, tasksJSON);
    localStorage.setItem(CHECKSUM_KEY, checksum);
  } catch (error) {
    console.error('Error saving tasks:', error);
    toast.error('Failed to save your changes. Please try again.');
  }
};

// Generate a unique ID for new tasks
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Sort tasks based on various criteria
export const sortTasks = (tasks: Task[], sortBy: string): Task[] => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        // High priority first
        const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      
      case 'dueDate':
        // Tasks with due dates first, sorted by earliest
        if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      
      case 'created':
      default:
        // Newest first
        return b.createdAt - a.createdAt;
    }
  });
};

// Filter tasks based on their status
export const filterTasks = (tasks: Task[], filter: string): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
};

// Find potential autocomplete suggestions based on previous tasks
export const findAutocompleteSuggestions = (
  input: string, 
  tasks: Task[], 
  maxSuggestions: number = 5
): string[] => {
  if (!input.trim()) return [];
  
  const normalizedInput = input.toLowerCase().trim();
  const allTitles = tasks.map(task => task.title);
  
  // Find unique titles that match the input
  const matches = [...new Set(allTitles)]
    .filter(title => title.toLowerCase().includes(normalizedInput) && title.toLowerCase() !== normalizedInput)
    .sort()
    .slice(0, maxSuggestions);
  
  return matches;
};

// Get a motivational message based on task completion status
export const getMotivationalMessage = (tasks: Task[]): string => {
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const remainingCount = totalCount - completedCount;
  
  if (totalCount === 0) {
    return "Ready to plan your day? Add your first task to get started.";
  }
  
  if (completedCount === totalCount && totalCount > 0) {
    return "Amazing job! You've completed all your tasks. Time to celebrate!";
  }
  
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  if (percentage >= 75) {
    return "You're making incredible progress! Just a few more tasks to go.";
  } else if (percentage >= 50) {
    return "Halfway there! Keep up the great momentum.";
  } else if (percentage >= 25) {
    return "You're making good progress. Stay focused!";
  } else if (completedCount > 0) {
    return "Great start! Keep tackling those tasks one by one.";
  } else {
    return `You have ${remainingCount} task${remainingCount !== 1 ? 's' : ''} to complete. You can do this!`;
  }
};

// Check if a task is overdue
export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.completed) return false;
  return Date.now() > task.dueDate;
};

// Format a date to a readable string
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
};
