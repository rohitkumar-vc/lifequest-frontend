import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password, rememberMe);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-card-dark border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                        LifeQuest
                    </h1>
                    <p className="text-gray-400 mt-2">Enter the realm</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-brand-primary transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-brand-primary transition-colors"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-600 rounded bg-black/20"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                            Keep me signed in
                        </label>
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-brand-primary hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95"
                    >
                        Login
                    </button>
                    
                    <div className="text-center text-xs text-gray-500 mt-4">
                        Don't have an account? Ask your Guild Master (Admin).
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
