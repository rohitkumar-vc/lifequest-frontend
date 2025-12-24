import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, AlertTriangle, Trash2, RefreshCw, Coins, Loader2 } from 'lucide-react';
import Modal from './ui/Modal';

const TodoCard = ({ todo, onComplete, onDelete, onRenew }) => {
    const isCompleted = todo.status === 'completed';
    const isOverdue = todo.status === 'overdue';
    
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const borderColor = isCompleted ? 'border-green-500/50' : isOverdue ? 'border-red-500/50' : 'border-gray-700';
    const bgColor = isCompleted ? 'bg-green-500/5' : isOverdue ? 'bg-red-500/5' : 'bg-card-dark';

    // Formatting date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleString('en-IN', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata' 
        });
    };

    const handleDeleteClick = () => {
        if (isCompleted) {
            performDelete();
        } else {
            setShowDeleteConfirm(true);
        }
    };

    const performDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(todo._id);
        } catch (error) {
            console.error("Delete failed", error);
            setIsDeleting(false); // Only reset if failed (otherwise component unmounts)
        }
    };

    return (
        <>
            <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                    ${bgColor} border ${borderColor} rounded-xl p-4 mb-3 transition-all relative group
                `}
            >
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                        <h3 className={`font-semibold text-white ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                            {todo.title}
                        </h3>
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
                             {todo.deadline && (
                                <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400 font-bold' : ''}`}>
                                    <Clock className="w-3 h-3" />
                                    {formatDate(todo.deadline)}
                                </span>
                            )}
                            <span className="capitalize px-2 py-0.5 rounded bg-white/5">{todo.difficulty}</span>
                            
                            {/* Gold Info */}
                            {todo.upfront_gold_given > 0 && (
                                 <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${isOverdue ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                     <Coins className="w-3 h-3" />
                                     {isOverdue ? `Lost ${todo.upfront_gold_given}g` : `Bet ${todo.upfront_gold_given}g`}
                                 </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Delete */}
                        <button 
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                            className="p-1.5 text-gray-600 hover:text-red-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                        >
                             {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>

                        {/* Active Actions */}
                        {!isCompleted && !isOverdue && (
                            <button 
                                onClick={() => onComplete(todo._id)}
                                className="text-gray-500 hover:text-green-500 transition-colors"
                                title="Complete"
                            >
                                <Circle className="w-6 h-6" />
                            </button>
                        )}

                        {/* Completed State */}
                        {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}

                        {/* Overdue Actions (Renew) */}
                        {isOverdue && (
                            <button 
                                onClick={() => onRenew(todo)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 text-xs rounded-lg flex items-center gap-1 transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Renew
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Overdue Warning */}
                {isOverdue && (
                     <div className="mt-3 text-xs bg-red-500/10 text-red-400 p-2 rounded border border-red-500/20 flex items-center gap-2">
                         <AlertTriangle className="w-4 h-4" />
                         Penalty Applied. Renew to try again (Cost: 10%).
                     </div>
                )}
            </motion.div>

            {/* Confirmation Modal for Active/Overdue Todos */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Deletion"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">
                        {todo.upfront_gold_given > 0 
                            ? `Are you sure? Since this task is not completed, you will repay the loan of ${todo.upfront_gold_given} Gold.`
                            : "Are you sure you want to delete this task?"}
                    </p>
                    
                    <div className="flex justify-end gap-3 mt-4">
                        <button 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => {
                                setShowDeleteConfirm(false); // Close first/concurrently
                                performDelete(); // Then show local loader
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                        >
                            Delete Task
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default TodoCard;
