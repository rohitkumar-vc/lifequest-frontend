import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, Skull, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onComplete, onDelete }) => {
    const isExpired = task.status === 'expired';
    const isCompleted = task.status === 'completed';
    
    const difficultyColors = {
        easy: 'border-green-500/50 hover:border-green-500',
        medium: 'border-yellow-500/50 hover:border-yellow-500',
        hard: 'border-red-500/50 hover:border-red-500',
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                bg-card-dark border rounded-lg p-4 mb-3 transition-colors group cursor-pointer relative
                ${difficultyColors[task.difficulty] || 'border-gray-700'}
                ${isExpired ? 'opacity-50 grayscale' : ''}
            `}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className={`font-semibold text-white ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                         {task.deadline && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(task.deadline).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        )}
                        <span className="capitalize px-2 py-0.5 rounded bg-white/5">{task.difficulty}</span>
                        {task.type === 'habit' && task.streak > 0 && (
                             <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold ml-2">
                                 🔥 {task.streak}
                             </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Delete Action (Visible on Hover/Mobile) */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task._id); }}
                        className="p-1 text-gray-600 hover:text-red-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        title="Delete Task"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>

                    {/* Checkbox / Completion Toggle */}
                    {!isExpired && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onComplete(task._id); }}
                            className={`transition-colors ${isCompleted ? 'text-green-500 hover:text-gray-400' : 'text-gray-500 hover:text-green-500'}`}
                            title={isCompleted ? "Click to Undo" : "Complete Task"}
                        >
                            {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                        </button>
                    )}
                     {isExpired && <Skull className="w-6 h-6 text-red-500" />}
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;
