import React from 'react';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, icon: Icon, tasks, onComplete, color }) => {
    return (
        <div className="bg-white/5 rounded-xl p-4 flex flex-col h-full border border-white/5">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className={`p-2 rounded-lg bg-${color}-500/20 text-${color}-400`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>
                <span className="ml-auto bg-white/10 text-xs px-2 py-1 rounded-full text-gray-400 font-mono">
                    {tasks.length}
                </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-600 text-sm italic">
                        No active quests
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskCard key={task._id} task={task} onComplete={onComplete} />
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskColumn;
