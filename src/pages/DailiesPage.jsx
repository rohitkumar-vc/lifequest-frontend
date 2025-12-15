import React, { useState } from 'react';
import { useGame } from '../context/GameProvider';
import DailyCard from '../components/DailyCard';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { Trash2 } from 'lucide-react';

const DailiesPage = () => {
    const { tasks, deleteTask } = useGame();
    const { addToast } = useToast();
    const [isModalOpen, setModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const dailies = tasks.filter(t => t.type === 'daily');

    const handleDeleteClick = (taskId) => {
        const task = tasks.find(t => t._id === taskId);
        setTaskToDelete(task);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;
        setIsDeleting(true);
        try {
            await deleteTask(taskToDelete._id);
            addToast('Daily task deleted', 'success');
            setTaskToDelete(null);
        } catch (error) {
            addToast('Failed to delete task', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                     <h1 className="text-3xl font-bold text-white mb-2">Dailies</h1>
                    <p className="text-gray-400">Tasks that reset every day.</p>
                </div>
                <button 
                   onClick={() => setModalOpen(true)}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
               >
                   + Add Daily
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dailies.map(daily => (
                    <DailyCard key={daily._id} task={daily} onDelete={handleDeleteClick} />
                ))}
                 {dailies.length === 0 && (
                     <div className="col-span-full py-12 text-center text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                        No dailies found.
                     </div>
                )}
            </div>
             <CreateTaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} defaultType="daily" />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                title="Delete Daily?"
            >
                {taskToDelete && (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-500">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <p className="text-lg text-gray-200 mb-2">
                            Are you sure you want to delete <span className="font-bold text-white">"{taskToDelete.title}"</span>?
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            This action cannot be undone. All streak progress will be lost.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setTaskToDelete(null)}
                                className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DailiesPage;
