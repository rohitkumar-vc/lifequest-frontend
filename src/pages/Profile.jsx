import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import api from '../api/axios';
import { User, Lock, Mail, Trash2, AlertTriangle } from 'lucide-react';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const { addToast } = useToast();
    
    // Edit Email Modal
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/me', { email: newEmail });
            await refreshUser();
            addToast('Email updated successfully', 'success');
            setEmailModalOpen(false);
        } catch (error) {
            addToast('Failed to update email', 'error');
        }
    };

    // Password Modal
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '' });

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/change-password', {
                current_password: passwords.current,
                new_password: passwords.new
            });
            addToast('Password updated successfully', 'success');
            setPasswordModalOpen(false);
            setPasswords({ current: '', new: '' });
        } catch (error) {
            addToast(error.response?.data?.detail || 'Failed to update password', 'error');
        }
    };

    // Delete Account Logic
    const { logout } = useAuth();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await api.delete('/auth/me');
            addToast('Account deleted successfully. Goodbye!', 'success');
            logout();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.detail || "Failed to delete account";
            addToast(msg, 'error');
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-10">
            <h1 className="text-3xl font-bold text-white mb-6">Adventurer Profile</h1>
            
            {/* Identity Card */}
            <div className="bg-card-dark border border-white/5 rounded-2xl p-8 flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-indigo-500/20">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white capitalize">{user?.full_name || user?.username}</h2>
                    <p className="text-indigo-400 text-sm font-medium">@{user?.username}</p>
                    <p className="text-gray-400 text-sm mt-1">Level {user?.stats?.level} Hero</p>
                    <div className="mt-2 flex gap-2">
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Active</span>
                        {user?.role === 'admin' && <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-1 rounded">Admin</span>}
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
                {/* Username (Locked) */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center justify-between opacity-70">
                    <div className="flex items-center gap-4">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Username</p>
                            <p className="text-white font-mono">{user?.username}</p>
                        </div>
                    </div>
                    <Lock className="w-4 h-4 text-gray-600" />
                </div>

                {/* Email */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-colors cursor-pointer" onClick={() => { setNewEmail(user?.email); setEmailModalOpen(true); }}>
                    <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5 text-gray-400" />
                         <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Email Address</p>
                            <p className="text-white">{user?.email}</p>
                        </div>
                    </div>
                <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                </div>

                {/* Password Change Button */}
                 <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-colors cursor-pointer" onClick={() => setPasswordModalOpen(true)}>
                    <div className="flex items-center gap-4">
                        <Lock className="w-5 h-5 text-gray-400" />
                         <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Password</p>
                            <p className="text-white">•••••••••••</p>
                        </div>
                    </div>
                     <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Change</span>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-12 bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2">
                     <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                    Deleting your account is permanent. All progress will be lost.
                </p>
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors text-sm"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                </button>
            </div>

            {/* Modals */}
             <Modal isOpen={isEmailModalOpen} onClose={() => setEmailModalOpen(false)} title="Update Email">
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                    <input 
                        type="email" 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)} 
                        className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white" 
                        required 
                    />
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded font-bold">Save Changes</button>
                </form>
            </Modal>

            <Modal isOpen={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)} title="Change Password">
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Current Password</label>
                        <input 
                            type="password" 
                            value={passwords.current} 
                            onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
                            className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white" 
                            required 
                        />
                    </div>
                    <div>
                         <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">New Password</label>
                        <input 
                            type="password" 
                            value={passwords.new} 
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                            className="w-full bg-black/20 border border-gray-700 rounded p-2 text-white" 
                            required 
                        />
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded font-bold">Update Password</button>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Account?"
            >
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-500">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Are you fully sure?</h3>
                    <p className="text-gray-400 mb-6">
                        This will permanently delete your account and all associated data.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
