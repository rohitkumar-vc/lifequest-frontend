import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Repeat, Flame, ShoppingBag, User, Shield, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthProvider';
import StatsBar from './StatsBar';
import CreateTaskModal from './modals/CreateTaskModal';
import Modal from './ui/Modal';

const Layout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    const location = useLocation();

    const isAdmin = user?.role === 'admin';

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/habits', icon: Flame, label: 'Habits' },
        { path: '/dailies', icon: Repeat, label: 'Dailies' },
        { path: '/todos', icon: CheckSquare, label: 'To-Dos' },
        { path: '/shop', icon: ShoppingBag, label: 'Shop' },
        { path: '/profile', icon: User, label: 'Profile' },
        ...(isAdmin ? [{ path: '/admin', icon: Shield, label: 'Admin' }] : [])
    ];

    return (
        <div className="min-h-screen bg-bg-dark text-white flex">
            {/* Sidebar Overlay (Mobile) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside 
                className={`
                    fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0F172A]/90 backdrop-blur-xl border-r border-white/5 flex flex-col
                    transform lg:transform-none transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">LifeQuest</h1>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <button 
                        onClick={() => setCreateModalOpen(true)}
                        className="w-full mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all text-sm uppercase tracking-wider"
                    >
                        + New Task
                    </button>

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                ${isActive 
                                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-xs font-bold text-white">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">Lvl {user?.stats?.level} Adventurer</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setLogoutModalOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <StatsBar onMenuClick={() => setSidebarOpen(true)} />
                <div className="flex-1 overflow-y-auto bg-grid-pattern p-4 lg:p-8 pt-8 custom-scrollbar relative">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-full h-96 bg-indigo-900/10 rounded-full blur-3xl -z-10 transform -translate-y-1/2" />
                    <Outlet />
                </div>
            </main>

            {/* Global Modals */}
            <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
            
            {/* Logout Confirmation Modal */}
            <Modal isOpen={isLogoutModalOpen} onClose={() => setLogoutModalOpen(false)} title="Confirm Logout">
                <div className="bg-black/20 rounded-lg p-2.5 mb-6">
                    <p className="text-gray-300">Are you sure you want to log out of your adventure?</p>
                </div>
                <div className="flex gap-3 justify-end">
                    <button 
                        onClick={() => setLogoutModalOpen(false)}
                        className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                         onClick={() => {
                            logout();
                            setLogoutModalOpen(false);
                         }}
                        className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors font-medium border border-red-500/20"
                    >
                        Yes, Log Out
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Layout;
