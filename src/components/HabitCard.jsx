import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Flame, Trash2 } from 'lucide-react';
import { useGame } from '../context/GameProvider';

const HabitCard = ({ task, onDelete }) => {
    const { toggleHabit } = useGame();
    const isCompletedToday = task.completed_today;

    const handleToggle = () => {
        toggleHabit(task._id);
    };
    
    const difficultyColors = {
        easy: 'border-green-500/30',
        medium: 'border-yellow-500/30',
        hard: 'border-red-500/30',
    };

    return (
        <motion.div 
            layout
            className={`bg-card-dark border rounded-lg p-4 mb-3 transition-colors group flex items-center justify-between relative 
                ${difficultyColors[task.difficulty] || 'border-gray-700'} 
                ${isCompletedToday ? 'opacity-70 bg-white/5' : ''}
            `}
        >
            <div className="flex-1">
                <h3 className={`font-semibold text-white ${isCompletedToday ? 'text-gray-400' : ''}`}>{task.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-orange-400">
                        <Flame className="w-3 h-3" />
                        {task.streak}
                    </span>
                    <span className="capitalize px-2 py-0.5 rounded bg-white/5">{task.difficulty}</span>
                    {isCompletedToday && <span className="text-green-400 font-medium">Done Today</span>}
                </div>
            </div>

            <div className="flex items-center gap-2">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task._id); }}
                    className="p-1 px-2 text-gray-600 hover:text-red-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 mr-2"
                    title="Delete Habit"
                >
                    <Trash2 className="w-5 h-5" />
                </button>

                <button 
                    onClick={handleToggle}
                    className={`w-8 h-8 flex items-center justify-center rounded border transition-all
                        ${isCompletedToday 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'bg-transparent border-gray-600 text-gray-400 hover:border-green-500 hover:text-green-500'
                        }
                    `}
                >
                    <Plus className={`w-5 h-5 transition-transform ${isCompletedToday ? 'rotate-45' : ''}`} />
                </button>
            </div>
        </motion.div>
    );
};

export default HabitCard;
