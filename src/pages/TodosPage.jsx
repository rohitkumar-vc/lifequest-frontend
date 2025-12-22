import React, { useState } from 'react';
import { useGame } from '../context/GameProvider';
import TodoCard from '../components/TodoCard';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import RenewTodoModal from '../components/modals/RenewTodoModal';
import { useToast } from '../components/ui/Toast';

const TodosPage = () => {
    const { todos, completeTodo, deleteTodo, renewalTodo } = useGame();
    const { addToast } = useToast();
    
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [renewingTodo, setRenewingTodo] = useState(null); // Objects | null
    
    // Sort: Active vs Overdue vs Completed
    const sortedTodos = [...todos].sort((a, b) => {
        // Overdue first
        if (a.status === 'overdue' && b.status !== 'overdue') return -1;
        if (b.status === 'overdue' && a.status !== 'overdue') return 1;
        
        // Then Active
        if (a.status === 'active' && b.status === 'completed') return -1;
        if (b.status === 'active' && a.status === 'completed') return 1;
        
        // Then Date
        return new Date(a.created_at) - new Date(b.created_at);
    });

    const handleRenew = async (todoId, newDeadline) => {
        try {
            await renewalTodo(todoId, newDeadline);
            addToast("Legacy Renewed! Good luck.", "success");
        } catch (error) {
             addToast("Renewal failed (Need Gold?)", "error");
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                 <div>
                    <h1 className="text-3xl font-bold text-white mb-2">To-Dos (Bets)</h1>
                    <p className="text-gray-400">Complete quickly to keep the Gold!</p>
                </div>
                <button 
                   onClick={() => setCreateModalOpen(true)}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
               >
                   + Place Bet
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTodos.map(todo => (
                     <TodoCard 
                        key={todo._id} 
                        todo={todo} 
                        onComplete={completeTodo} 
                        onDelete={deleteTodo}
                        onRenew={(t) => setRenewingTodo(t)} 
                    />
                ))}
                 {sortedTodos.length === 0 && (
                     <div className="col-span-full py-12 text-center text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                        No active bets. Start one!
                     </div>
                )}
            </div>
            
            {/* Modals */}
            <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} defaultType="todo" />
            
            <RenewTodoModal 
                isOpen={!!renewingTodo} 
                onClose={() => setRenewingTodo(null)} 
                todo={renewingTodo}
                onRenew={handleRenew}
            />
        </div>
    );
};

export default TodosPage;
