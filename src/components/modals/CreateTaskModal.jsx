import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../context/AuthProvider';
import { useGame } from '../../context/GameProvider';
import { useToast } from '../ui/Toast';
import api from '../../api/axios';
import { Shield, Sword } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose, defaultType = 'habit' }) => {
    const { fetchTasks, createHabit } = useGame(); // Use context actions
    const { refreshUser } = useAuth();
    const { addToast } = useToast();
    
    const [title, setTitle] = useState('');
    const [type, setType] = useState(defaultType);
    const [difficulty, setDifficulty] = useState('medium');
    const [deadline, setDeadline] = useState('');
    const [habitDirection, setHabitDirection] = useState('positive'); // 'positive' | 'negative'
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (type === 'habit') {
                // --- CREATE HABIT ---
                await createHabit({
                    title,
                    type: habitDirection, // 'positive' or 'negative'
                    difficulty
                });
                addToast("Habit created successfully!", "success");
            } else {
                // --- CREATE TASK (Daily/Todo) ---
                const payload = {
                    title,
                    type,
                    difficulty,
                    deadline: type === 'todo' && deadline ? new Date(deadline).toISOString() : null,
                    user_id: "me" 
                };
                await api.post('/tasks/', payload);
                await fetchTasks();
                await refreshUser();
                addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`, 'success');
            }

            // Reset and Close
            setTitle('');
            setDifficulty('medium');
            setDeadline('');
            onClose();
        } catch (error) {
            console.error(error);
            addToast('Failed to create task', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Create New ${type.charAt(0).toUpperCase() + type.slice(1)}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                    <div className="flex bg-black/20 p-1 rounded-lg">
                        {['habit', 'daily', 'todo'].map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`flex-1 capitalize py-1.5 text-sm rounded-md transition-all ${type === t ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Habit Direction (Specific to Habits) */}
                {type === 'habit' && (
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setHabitDirection('positive')}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${habitDirection === 'positive' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-black/20 border-white/5 text-gray-400 hover:border-green-500/50'}`}
                        >
                            <Sword className="w-6 h-6" />
                            <span className="text-sm font-bold">Build (+)</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setHabitDirection('negative')}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${habitDirection === 'negative' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-black/20 border-white/5 text-gray-400 hover:border-red-500/50'}`}
                        >
                            <Shield className="w-6 h-6" />
                            <span className="text-sm font-bold">Break (-)</span>
                        </button>
                    </div>
                )}

                {/* Title */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                         <label className="block text-sm font-medium text-gray-400">Title</label>
                         <span className={`text-xs ${title.length === 100 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                             {title.length}/100
                         </span>
                    </div>
                    <input 
                        type="text" 
                        required
                        maxLength={100}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black/20 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        placeholder={type === 'habit' ? (habitDirection === 'positive' ? 'e.g. Morning Jog' : 'e.g. No Sugar') : "e.g. Finish Report"}
                    />
                </div>

                {/* Difficulty */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty</label>
                    <select 
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                    >
                        <option value="easy" className="bg-gray-900 text-white">Easy</option>
                        <option value="medium" className="bg-gray-900 text-white">Medium</option>
                        <option value="hard" className="bg-gray-900 text-white">Hard</option>
                    </select>
                </div>

                {/* Deadline (Todo Only) */}
                {type === 'todo' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Deadline</label>
                        <input 
                            type="datetime-local" 
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full bg-black/20 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        />
                         <p className="text-xs text-gray-500 mt-1">Set a deadline to get Upfront Gold!</p>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-colors mt-4 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : `Create ${type === 'habit' ? (habitDirection === 'positive' ? 'Good Habit' : 'Bad Habit') : 'Task'}`}
                </button>
            </form>
        </Modal>
    );
};

export default CreateTaskModal;
