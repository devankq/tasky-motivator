import React, { useState, useRef, useEffect } from 'react';
import { Task, TaskPriority } from '../types/task';
import { findAutocompleteSuggestions } from '../utils/taskUtils';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (title: string, priority: TaskPriority) => void;
  existingTasks: Task[];
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, existingTasks }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (title.trim()) {
      const newSuggestions = findAutocompleteSuggestions(title, existingTasks);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
    setActiveSuggestion(-1);
  }, [title, existingTasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      onAddTask(title.trim(), priority);
      setTitle('');
      setPriority('medium');
      setSuggestions([]);
      
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : 0);
    }
    else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault();
      setTitle(suggestions[activeSuggestion]);
      setSuggestions([]);
      setActiveSuggestion(-1);
    }
    else if (e.key === 'Escape') {
      setSuggestions([]);
      setActiveSuggestion(-1);
      inputRef.current?.blur();
    }
  };

  const applySuggestion = (suggestion: string) => {
    setTitle(suggestion);
    setSuggestions([]);
    setActiveSuggestion(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="mb-8 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="glass-container p-4">
        <div className="relative mb-3">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 150);
            }}
            placeholder="What needs to be done?"
            className="glass-input w-full py-3 pl-4 pr-12 text-gray-800"
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
            aria-label="Add task"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
          
          {suggestions.length > 0 && isFocused && (
            <div 
              ref={suggestionsRef}
              className="absolute left-0 right-0 mt-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/10 shadow-lg z-10 overflow-hidden animate-slide-up"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-4 py-2 cursor-pointer hover:bg-white/30 transition-colors text-white",
                    index === activeSuggestion ? "bg-white/20" : ""
                  )}
                  onMouseDown={() => applySuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-4">
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              className="sr-only"
              value="low"
              checked={priority === 'low'}
              onChange={() => setPriority('low')}
            />
            <span className={cn(
              "inline-block w-5 h-5 rounded-full border-2 mr-2 transition-all duration-200",
              priority === 'low' 
                ? "border-priority-low bg-priority-low scale-110 shadow-[0_0_8px_rgba(139,92,246,0.5)]" 
                : "border-white/30 group-hover:border-white/50"
            )}></span>
            <span className="text-sm font-medium text-white/80 group-hover:text-white">Low</span>
          </label>
          
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              className="sr-only"
              value="medium"
              checked={priority === 'medium'}
              onChange={() => setPriority('medium')}
            />
            <span className={cn(
              "inline-block w-5 h-5 rounded-full border-2 mr-2 transition-all duration-200",
              priority === 'medium' 
                ? "border-priority-medium bg-priority-medium scale-110 shadow-[0_0_8px_rgba(14,165,233,0.5)]" 
                : "border-white/30 group-hover:border-white/50"
            )}></span>
            <span className="text-sm font-medium text-white/80 group-hover:text-white">Medium</span>
          </label>
          
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              className="sr-only"
              value="high"
              checked={priority === 'high'}
              onChange={() => setPriority('high')}
            />
            <span className={cn(
              "inline-block w-5 h-5 rounded-full border-2 mr-2 transition-all duration-200",
              priority === 'high' 
                ? "border-priority-high bg-priority-high scale-110 shadow-[0_0_8px_rgba(249,115,22,0.5)]" 
                : "border-white/30 group-hover:border-white/50"
            )}></span>
            <span className="text-sm font-medium text-white/80 group-hover:text-white">High</span>
          </label>
        </div>
      </form>
    </div>
  );
};

export default TaskInput;
