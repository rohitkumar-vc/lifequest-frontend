import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trash2, Check, X, Shield, Sword, Award } from 'lucide-react';
import { useGame } from '../context/GameProvider';
import { useToast } from './ui/Toast';

const HabitCard = ({ habit, onDelete }) => {
    const { triggerHabit } = useGame();
    const { addToast } = useToast();
    
    // Check if done today (basic check using last_completed_date)
    // Note: This is an optimistic check. The backend has robust logic.
    const today = new Date().toDateString();
    const lastDate = habit.last_completed_date ? new Date(habit.last_completed_date).toDateString() : null;
    const isDoneToday = lastDate === today;

    const isPositive = habit.type === 'positive';

    const handleAction = async (action) => {
        if (isDoneToday) {
            addToast("Already logged today!", "info");
            return;
        }
        try {
            const res = await triggerHabit(habit._id, action);
            // res = { habit, badge_unlocked, badge_label }
            if (res.badge_unlocked) {
                addToast(`🏆 New Badge: ${res.badge_label}`, 'success');
            } else if (action === 'success') {
                addToast(isPositive ? "Great job!" : "Stayed strong!", "success");
            } else {
                addToast("Streak lost... Try again tomorrow.", "error");
            }
        } catch (err) {
            // Error handled in provider
        }
    };

    return (
        <motion.div 
            layout
            className={`
                bg-card-dark border rounded-xl p-5 mb-4 relative overflow-hidden group
                ${isPositive 
                    ? 'border-green-500/20 hover:border-green-500/40' 
                    : 'border-red-500/20 hover:border-red-500/40'}
            `}
        >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isPositive ? 'from-green-500/5' : 'from-red-500/5'} to-transparent rounded-bl-full pointer-events-none`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {isPositive ? <Sword className="w-4 h-4 text-green-400" /> : <Shield className="w-4 h-4 text-red-400" />}
                        <h3 className="text-lg font-bold text-white">{habit.title}</h3>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-sm">
                        <span className={`flex items-center gap-1 font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            <Flame className="w-4 h-4 fill-current" />
                            {habit.current_streak} Day Streak
                        </span>
                        <span className="text-gray-500 text-xs">Best: {habit.best_streak}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                     {/* Delete Button (Visible on Hover/Mobile) */}
                     <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(habit._id); }}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    
                    {/* Milestones / badges could go here or below */}
                </div>
            </div>

            {/* Milestones Row */}
            {habit.milestones && habit.milestones.length > 0 && (
                <div className="flex gap-1 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {habit.milestones.slice(-5).map((m, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full text-xs text-yellow-400 border border-yellow-500/10 whitespace-nowrap" title={m.label}>
                            <Award className="w-3 h-3" />
                            {m.day_count}D
                        </div>
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
                {isDoneToday ? (
                     <div className={`col-span-2 py-2 text-center rounded-lg border border-dashed text-sm font-medium ${isPositive ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-500'}`}>
                        Logged for today
                     </div>
                ) : (
                    <>
                        {/* Success Button */}
                        <button
                            onClick={() => handleAction('success')}
                            className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all
                                ${isPositive 
                                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white' 
                                    : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white'}
                            `}
                        >
                            <Check className="w-4 h-4" />
                            {isPositive ? 'Performed' : 'Avoided'}
                        </button>

                        {/* Failure Button */}
                        <button
                            onClick={() => handleAction('failure')}
                            className="flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                            {isPositive ? 'Skipped' : 'Indulged'}
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default HabitCard;
