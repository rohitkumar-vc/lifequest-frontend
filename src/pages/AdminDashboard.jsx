import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import api from '../api/axios';
import { Plus, UserPlus, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
    const { addToast } = useToast();
    
    // Modal States
    const [isInviteOpen, setInviteOpen] = useState(false);
    const [isItemOpen, setItemOpen] = useState(false);
    
    // Form States
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteUsername, setInviteUsername] = useState('');
    const [inviteFullName, setInviteFullName] = useState('');
    
    const [itemName, setItemName] = useState('');
    const [itemCost, setItemCost] = useState(10);
    const [itemDesc, setItemDesc] = useState('');
    const [itemEffect, setItemEffect] = useState('hp_restore');
    
    const [loading, setLoading] = useState(false);

    const handleInvite = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/admin/register-user', { 
                email: inviteEmail, 
                username: inviteUsername,
                full_name: inviteFullName
            });
            addToast(`User ${inviteUsername} created!`, 'success');
            setInviteOpen(false);
            setInviteEmail('');
            setInviteUsername('');
            setInviteFullName('');
        } catch (error) {
            addToast(error.response?.data?.detail || 'Failed to create user', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/shop/items', { 
                name: itemName,
                cost: parseInt(itemCost),
                description: itemDesc,
                effect_type: itemEffect
            });
            addToast(`Item "${itemName}" added to shop!`, 'success');
            setItemOpen(false);
            setItemName('');
            setItemCost(10);
            setItemDesc('');
        } catch (error) {
             addToast('Failed to create item', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="border-b border-white/10 pb-6">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-indigo-400" />
                    Admin Command Center
                </h1>
                <p className="text-gray-400">Manage the realm's inhabitants and economy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Management */}
                <div className="bg-card-dark border border-white/5 p-6 rounded-2xl hover:border-indigo-500/30 transition-all cursor-pointer" onClick={() => setInviteOpen(true)}>
                    <div className="p-3 bg-indigo-500/10 rounded-lg w-fit mb-4">
                        <UserPlus className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Invite New Adventurer</h2>
                    <p className="text-gray-400 text-sm">Send an email invitation to a new user to join the quest.</p>
                </div>

                {/* Shop Management */}
                <div className="bg-card-dark border border-white/5 p-6 rounded-2xl hover:border-orange-500/30 transition-all cursor-pointer" onClick={() => setItemOpen(true)}>
                    <div className="p-3 bg-orange-500/10 rounded-lg w-fit mb-4">
                        <Plus className="w-8 h-8 text-orange-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Stock the Market</h2>
                    <p className="text-gray-400 text-sm">Add new items, potions, or equipment to the global shop.</p>
                </div>
            </div>

            {/* --- Modals --- */}
            
            {/* Invite Modal */}
            <Modal isOpen={isInviteOpen} onClose={() => setInviteOpen(false)} title="Create New User">
                <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                        <input className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white" value={inviteFullName} onChange={e => setInviteFullName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <input className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white" value={inviteUsername} onChange={e => setInviteUsername(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input type="email" className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
                    </div>
                    <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded font-bold">
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                </form>
            </Modal>

            {/* Add Item Modal */}
            <Modal isOpen={isItemOpen} onClose={() => setItemOpen(false)} title="Add Shop Item">
                <form onSubmit={handleAddItem} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Item Name</label>
                        <input className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white" value={itemName} onChange={e => setItemName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Cost (Gold)</label>
                        <input type="number" className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white" value={itemCost} onChange={e => setItemCost(e.target.value)} required />
                    </div>
                     <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <input className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white" value={itemDesc} onChange={e => setItemDesc(e.target.value)} required />
                    </div>
                     <div>
                        <label className="block text-sm text-gray-400 mb-1">Effect Type</label>
                        <select className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white" value={itemEffect} onChange={e => setItemEffect(e.target.value)}>
                            <option value="hp_restore">HP Restore</option>
                            <option value="shield">Shield (Future)</option>
                            <option value="xp_boost">XP Boost (Future)</option>
                        </select>
                    </div>
                    <button disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white p-2 rounded font-bold">
                        {loading ? 'Crafting...' : 'Add Item'}
                    </button>
                </form>
            </Modal>

        </div>
    );
};

export default AdminDashboard;
