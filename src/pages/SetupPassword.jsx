import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SetupPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }
        
        try {
            await api.post('/auth/setup-password', {
                token,
                password
            });
            setMessage("Password set successfully! Redirecting to login...");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to set password");
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
             <div className="w-full max-w-md bg-card-dark border border-white/10 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Setup Your Password</h1>
                
                {message && <div className="text-green-500 text-center mb-4">{message}</div>}
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                         className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                         required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                         className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                         required
                    />
                     <button 
                        type="submit"
                        className="w-full bg-brand-secondary hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-all"
                    >
                        Set Password
                    </button>
                </form>
             </div>
        </div>
    );
};

export default SetupPassword;
