import React, { useState } from 'react';
import { useGame } from '../context/GameProvider';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/modals/CreateTaskModal';

const TodosPage = () => {
    const { tasks, completeTask, deleteTask } = useGame();
    const [isModalOpen, setModalOpen] = useState(false);
    
    // Sort: Active first, then completed.
    const todos = tasks
        .filter(t => t.type === 'todo')
        .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                 <div>
                    <h1 className="text-3xl font-bold text-white mb-2">To-Dos</h1>
                    <p className="text-gray-400">One-time tasks to get done.</p>
                </div>
                <button 
                   onClick={() => setModalOpen(true)}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
               >
                   + Add To-Do
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todos.map(todo => (
                     <TaskCard key={todo._id} task={todo} onComplete={completeTask} onDelete={deleteTask} />
                ))}
                 {todos.length === 0 && (
                     <div className="col-span-full py-12 text-center text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                        You are all caught up!
                     </div>
                )}
            </div>
            <CreateTaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} defaultType="todo" />
        </div>
    );
};

export default TodosPage;
