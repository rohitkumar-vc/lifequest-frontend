import React, { useState, useEffect } from 'react';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthProvider';
import api from '../api/axios';
import { Plus, UserPlus, ShieldCheck, Users, Ban, CheckCircle, Crown, Search, Filter, Receipt, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { user: currentUser } = useAuth();
    const { addToast } = useToast();
    
    // ... (rest of simple states)

    // Tabs: 'actions', 'users'
    const [activeTab, setActiveTab] = useState('actions');
    
    // -- Action Tab States --
    const [isInviteOpen, setInviteOpen] = useState(false);
    const [isItemOpen, setItemOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteUsername, setInviteUsername] = useState('');
    const [inviteFullName, setInviteFullName] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemCost, setItemCost] = useState(10);
    const [itemDesc, setItemDesc] = useState('');
    const [itemEffect, setItemEffect] = useState('hp_restore');
    const [loading, setLoading] = useState(false);

    // -- User Management Tab States --
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // -- History Modal State --
    const [historyState, setHistoryState] = useState({
        isOpen: false,
        userName: '',
        data: [],
        loading: false
    });

    // ... (fetch logic)

    // Fetch Users when switching to 'users' tab
    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/admin/users');
            setUsers(res.data);
        } catch (error) {
            addToast('Failed to load users', 'error');
        }
    };

    const fetchUserHistory = async (userId, userName) => {
        setHistoryState({ isOpen: true, userName, data: [], loading: true });
        try {
            const res = await api.get(`/shop/admin/history/${userId}`);
            setHistoryState(prev => ({ ...prev, data: res.data, loading: false }));
        } catch (error) {
            addToast("Failed to fetch user history", "error");
            setHistoryState(prev => ({ ...prev, isOpen: false, loading: false }));
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = (
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        // Determine effective status for filtering
        const effectiveStatus = user.status || (user.is_active ? 'active' : 'inactive');
        const matchesStatus = statusFilter === 'all' || effectiveStatus === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

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
    
    // Confirmation Modal State
    const [confirmState, setConfirmState] = useState({ 
        isOpen: false, 
        type: '', // 'role' or 'status'
        userId: '',
        newValue: '',
        title: '',
        message: '' 
    });

    const openConfirmModal = (type, userId, newValue, title, message) => {
        setConfirmState({ isOpen: true, type, userId, newValue, title, message });
    };

    const handleConfirmAction = async () => {
        const { type, userId, newValue } = confirmState;
        if (type === 'role') {
            await handleRoleUpdate(userId, newValue);
        } else if (type === 'status') {
            await handleStatusToggle(userId, newValue);
        }
        setConfirmState({ ...confirmState, isOpen: false });
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await api.patch(`/auth/admin/users/${userId}/role`, { role: newRole });
            addToast('Role updated', 'success');
            fetchUsers(); 
        } catch (error) {
            addToast(error.response?.data?.detail || 'Failed to update role', 'error');
        }
    };
    
    // Wrapper for button click
    const onRoleClick = (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const action = currentRole === 'admin' ? 'Demote' : 'Promote';
        if (userId === currentUser._id) return; // double check

        openConfirmModal(
            'role', 
            userId, 
            newRole, 
            `${action} User`, 
            `Are you sure you want to ${action.toLowerCase()} this user?`
        );
    };

    const handleStatusToggle = async (userId, newStatus) => {
        try {
            await api.patch(`/auth/admin/users/${userId}/status`, { status: newStatus });
            addToast(`User ${newStatus === 'active' ? 'activated' : 'disabled'}`, 'success');
            fetchUsers(); 
        } catch (error) {
            addToast(error.response?.data?.detail || 'Failed to update status', 'error');
        }
    };

    // Wrapper for status click
    const onStatusClick = (userId, currentStatus) => {
        // currentStatus might be undefined, fallback to logic
        // But better to pass exact current status or calculate it
        // The table calculation was complex: user.status || (user.is_active ? 'active' : 'inactive')
        // Let's rely on what we passed.
        const effectiveStatus = currentStatus || 'inactive'; 
        const newStatus = effectiveStatus === 'active' || effectiveStatus === 'invited' ? 'inactive' : 'active';
        const action = newStatus === 'active' ? 'Activate' : 'Disable';
        
        if (userId === currentUser._id) return; // double check

        openConfirmModal(
            'status',
            userId,
            newStatus,
            `${action} Account`,
            `Are you sure you want to ${action.toLowerCase()} this user?`
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 px-4 md:px-0">
             <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-indigo-400 shrink-0" />
                        Admin Command Center
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">Manage the realm's inhabitants and economy.</p>
                </div>
                
                {/* Tabs */}
                <div className="flex bg-black/40 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('actions')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-md transition-all text-sm whitespace-nowrap ${activeTab === 'actions' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Overview
                    </button>
                    <button 
                         onClick={() => setActiveTab('users')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-md transition-all text-sm whitespace-nowrap ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Manage Users
                    </button>
                </div>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'actions' ? (
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
            ) : (
                <div className="bg-card-dark border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-400" /> User Registry
                        </h2>
                        
                        {/* Filter & Search Bar */}
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="text"
                                    placeholder="Search users..."
                                    className="w-full md:w-64 pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            
                            {/* Role Filter */}
                            <select 
                                className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>

                            {/* Status Filter */}
                            <select 
                                className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="invited">Invited</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-black/20 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Adventurer</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Level</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredUsers.map(user => {
                                    const isMe = currentUser?._id === user._id || currentUser?.id === user._id || currentUser?.username === user.username;
                                    const effectiveStatus = user.status || (user.is_active ? 'active' : 'inactive');

                                    return (
                                        <tr key={user._id} className={`hover:bg-white/5 transition-colors ${isMe ? 'bg-indigo-500/5' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white flex items-center gap-2">
                                                    {user.full_name || user.username}
                                                    {isMe && <span className="text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded">YOU</span>}
                                                </div>
                                                <div className="text-gray-500 text-xs">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700/50 text-gray-400'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold capitalize
                                                    ${effectiveStatus === 'active' ? 'bg-green-500/20 text-green-400' : 
                                                    effectiveStatus === 'invited' ? 'bg-indigo-500/20 text-indigo-400' : 
                                                    'bg-red-500/20 text-red-400'}`}>
                                                    {effectiveStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-white font-mono">
                                                Lvl {user.stats?.level || 1}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => fetchUserHistory(user._id, user.username)}
                                                        className="p-2 rounded transition-colors hover:bg-white/10 text-gray-400 hover:text-amber-400"
                                                        title="View Purchase History"
                                                    >
                                                        <Receipt className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => onRoleClick(user._id, user.role)}
                                                        disabled={isMe}
                                                        className={`p-2 rounded transition-colors ${isMe ? 'text-gray-600 cursor-not-allowed' : 'hover:bg-white/10 text-gray-400 hover:text-purple-400'}`}
                                                        title={isMe ? "You cannot change your own role" : (user.role === 'admin' ? "Demote to User" : "Promote to Admin")}
                                                    >
                                                        <Crown className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => onStatusClick(user._id, effectiveStatus)}
                                                        disabled={isMe}
                                                        className={`p-2 rounded transition-colors ${isMe ? 'text-gray-600 cursor-not-allowed' : (user.is_active ? 'text-gray-400 hover:bg-white/10 hover:text-red-400' : 'text-red-500 hover:bg-white/10 hover:text-green-400')}`}
                                                        title={isMe ? "You cannot disable yourself" : (user.is_active ? "Disable Account" : "Activate Account")}
                                                    >
                                                        {user.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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
            
            {/* Confirmation Modal */}
            <Modal isOpen={confirmState.isOpen} onClose={() => setConfirmState({ ...confirmState, isOpen: false })} title={confirmState.title}>
                 <div className="space-y-6">
                    <p className="text-gray-300">{confirmState.message}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setConfirmState({ ...confirmState, isOpen: false })}
                            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmAction}
                            className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                 </div>
            </Modal>

            {/* History Modal */}
            <Modal
                isOpen={historyState.isOpen}
                onClose={() => setHistoryState(prev => ({ ...prev, isOpen: false }))}
                title={`History: ${historyState.userName}`}
            >
                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {historyState.loading ? (
                        <div className="text-center py-8 text-gray-500">Loading records...</div>
                    ) : historyState.data.length > 0 ? (
                        <div className="space-y-3">
                            {historyState.data.map((record) => (
                                <div key={record.id} className="bg-black/20 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-white text-sm">{record.item_name}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(record.purchased_at.endsWith('Z') ? record.purchased_at : record.purchased_at + 'Z').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                                        -{record.cost}
                                        <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                                            <span className="text-[10px]">G</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No purchases recorded for this user.
                        </div>
                    )}
                </div>
            </Modal>

        </div>
    );
};

export default AdminDashboard;
