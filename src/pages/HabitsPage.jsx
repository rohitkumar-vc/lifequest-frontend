import React, { useState } from 'react';
import { useGame } from '../context/GameProvider';
import HabitCard from '../components/HabitCard';
import CreateTaskModal from '../components/modals/CreateTaskModal';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { Trash2, Sword, Shield } from 'lucide-react';

const HabitsPage = () => {
    const { habits, deleteHabit } = useGame();
    const { addToast } = useToast();
    const [isModalOpen, setModalOpen] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter Habits
    const positiveHabits = habits.filter(h => h.type === 'positive');
    const negativeHabits = habits.filter(h => h.type === 'negative');

    const handleDeleteClick = (habitId) => {
        const habit = habits.find(h => h._id === habitId);
        setHabitToDelete(habit);
    };

    const confirmDelete = async () => {
        if (!habitToDelete) return;
        setIsDeleting(true);
        try {
            await deleteHabit(habitToDelete._id);
            addToast('Habit deleted successfully', 'success');
            setHabitToDelete(null);
        } catch (error) {
            addToast('Failed to delete habit', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Habit Forge</h1>
                    <p className="text-gray-400">Build your character, one day at a time.</p>
                </div>
                <button 
                    onClick={() => setModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    + New Habit
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Positive Column */}
                <div>
                    <div className="flex items-center gap-2 mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <Sword className="w-5 h-5 text-green-400" />
                        <h2 className="text-xl font-bold text-green-400">Building</h2>
                        <span className="ml-auto text-xs bg-green-500/20 px-2 py-0.5 rounded text-green-300">{positiveHabits.length} Active</span>
                    </div>
                    
                    <div className="space-y-4">
                        {positiveHabits.map(habit => (
                            <HabitCard key={habit._id} habit={habit} onDelete={handleDeleteClick} />
                        ))}
                        {positiveHabits.length === 0 && (
                            <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl text-gray-500">
                                No positive habits yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Negative Column */}
                <div>
                    <div className="flex items-center gap-2 mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <Shield className="w-5 h-5 text-red-400" />
                        <h2 className="text-xl font-bold text-red-400">Breaking</h2>
                        <span className="ml-auto text-xs bg-red-500/20 px-2 py-0.5 rounded text-red-300">{negativeHabits.length} Active</span>
                    </div>

                    <div className="space-y-4">
                        {negativeHabits.map(habit => (
                            <HabitCard key={habit._id} habit={habit} onDelete={handleDeleteClick} />
                        ))}
                         {negativeHabits.length === 0 && (
                            <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl text-gray-500">
                                No bad habits to break? Nice!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CreateTaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} defaultType="habit" />
             
             {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!habitToDelete}
                onClose={() => setHabitToDelete(null)}
                title="Delete Habit?"
            >
                {habitToDelete && (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-500">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <p className="text-lg text-gray-200 mb-2">
                            Delete <span className="font-bold text-white">"{habitToDelete.title}"</span>?
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            This action cannot be undone. All streak progress will be lost.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setHabitToDelete(null)}
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

export default HabitsPage;
