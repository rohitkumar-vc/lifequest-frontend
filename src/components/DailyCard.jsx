import React from 'react';
import { motion } from 'framer-motion';
import { Check, Repeat, Trash2 } from 'lucide-react';
import { useGame } from '../context/GameProvider';

const DailyCard = ({ task, onDelete }) => {
    const { toggleDaily } = useGame();
    const isCompleted = task.completed;

    const handleToggle = () => {
        toggleDaily(task._id);
    };

    return (
        <motion.div 
            layout
            className={`bg-card-dark border rounded-lg p-4 mb-3 transition-colors group flex items-center justify-between relative ${isCompleted ? 'border-gray-700 opacity-60' : 'border-blue-500/30'}`}
        >
            <div className="flex-1">
                <h3 className={`font-semibold text-white ${isCompleted ? 'line-through text-gray-500' : ''}`}>{task.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span className={`flex items-center gap-1 ${task.streak > 0 ? 'text-blue-400' : 'text-gray-500'}`}>
                        <Repeat className="w-3 h-3" />
                        {task.streak}
                    </span>
                    <span className="capitalize px-2 py-0.5 rounded bg-white/5">{task.difficulty}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task._id); }}
                    className="p-1 text-gray-600 hover:text-red-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    title="Delete Daily"
                >
                    <Trash2 className="w-5 h-5" />
                </button>

                <button 
                    onClick={handleToggle}
                className={`
                    w-8 h-8 flex items-center justify-center rounded border transition-all
                    ${isCompleted 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-transparent border-gray-600 text-transparent hover:border-blue-500'
                    }
                `}
            >
                <Check className="w-5 h-5" />
            </button>
            </div>
        </motion.div>
    );
};

export default DailyCard;
