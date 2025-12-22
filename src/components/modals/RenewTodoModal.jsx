import React, { useState } from 'react';
import Modal from '../ui/Modal';

const RenewTodoModal = ({ isOpen, onClose, todo, onRenew }) => {
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (deadline) {
            onRenew(todo._id, new Date(deadline).toISOString());
            onClose();
            setDeadline('');
        }
    };

    if (!todo) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Renew Goal">
            <div className="space-y-4">
                 <p className="text-gray-400 text-sm">
                     Missed <strong>{todo.title}</strong>? Try again!
                     <br/>
                     <span className="text-yellow-500">Cost: {(todo.potential_reward * 0.10).toFixed(1)} Gold (10% of Reward)</span>
                 </p>
                 <form onSubmit={handleSubmit}>
                     <label className="block text-sm font-medium text-gray-400 mb-1">New Deadline</label>
                     <input 
                        type="datetime-local" 
                        required
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full bg-black/20 border border-gray-700 rounded-lg px-3 py-2 text-white mb-4 focus:outline-none focus:border-indigo-500"
                     />
                     <button 
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg"
                     >
                         Pay & Renew
                     </button>
                 </form>
            </div>
        </Modal>
    );
};

export default RenewTodoModal;
