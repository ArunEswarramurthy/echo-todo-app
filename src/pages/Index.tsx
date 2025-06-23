
import TodoList from '@/components/TodoList';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 md:p-8">
      <div className="min-h-screen flex items-center justify-center">
        <TodoList />
      </div>
    </div>
  );
};

export default Index;
