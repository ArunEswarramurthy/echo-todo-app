
import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, text, completed, onToggle, onDelete }) => {
  return (
    <div className={`flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/60 ${completed ? 'opacity-75' : ''}`}>
      <button
        onClick={() => onToggle(id)}
        className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
          completed 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {completed && <Check size={14} />}
      </button>
      
      <span className={`flex-1 text-gray-800 transition-all duration-200 ${
        completed ? 'line-through text-gray-500' : ''
      }`}>
        {text}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
      >
        <X size={16} />
      </Button>
    </div>
  );
};

export default TodoItem;
