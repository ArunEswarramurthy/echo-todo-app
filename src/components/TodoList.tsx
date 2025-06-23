
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TodoItem from './TodoItem';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load todos from Supabase on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error loading todos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setTodos(data || []);
    } catch (error) {
      console.error('Error loading todos:', error);
      toast({
        title: "Error",
        description: "Failed to load todos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (inputValue.trim() !== '') {
      try {
        const { data, error } = await supabase
          .from('todos')
          .insert([
            {
              text: inputValue.trim(),
              completed: false,
            }
          ])
          .select()
          .single();

        if (error) {
          toast({
            title: "Error adding todo",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        setTodos(prev => [data, ...prev]);
        setInputValue('');
        toast({
          title: "Success",
          description: "Todo added successfully",
        });
      } catch (error) {
        console.error('Error adding todo:', error);
        toast({
          title: "Error",
          description: "Failed to add todo",
          variant: "destructive",
        });
      }
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error updating todo",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting todo",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-white text-lg">Loading todos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">My Tasks</h1>
        <p className="text-white/80">Stay organized and get things done</p>
      </div>

      {/* Add Todo Input */}
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50"
        />
        <Button
          onClick={addTodo}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 hover:border-white/50"
        >
          <Plus size={20} />
        </Button>
      </div>

      {/* Stats */}
      {totalCount > 0 && (
        <div className="text-center mb-6">
          <p className="text-white/80">
            {completedCount} of {totalCount} tasks completed
          </p>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div
              className="bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg">No tasks yet</div>
            <div className="text-white/40 text-sm mt-1">Add a task above to get started</div>
          </div>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              text={todo.text}
              completed={todo.completed}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
