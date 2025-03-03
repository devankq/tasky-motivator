
import React, { useEffect, useState } from 'react';
import { Task } from '../types/task';
import { getMotivationalMessage } from '../utils/taskUtils';

interface MotivationalMessageProps {
  tasks: Task[];
}

const MotivationalMessage: React.FC<MotivationalMessageProps> = ({ tasks }) => {
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start exit animation
    if (message) {
      setIsAnimating(true);
      
      // After exit animation completes, update message
      const timer = setTimeout(() => {
        setMessage(getMotivationalMessage(tasks));
        setIsAnimating(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      // Initial message load (no animation)
      setMessage(getMotivationalMessage(tasks));
    }
  }, [tasks]);

  return (
    <div 
      className={`text-center py-6 overflow-hidden min-h-[80px] flex items-center justify-center transition-opacity duration-300 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <p className="text-gray-600 text-lg font-light animate-fade-in max-w-lg">
        {message}
      </p>
    </div>
  );
};

export default MotivationalMessage;
