import React from 'react';
import { useAuth } from '../context/AuthProvider';
import { Heart, Zap, Coins, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const StatsBar = ({ onMenuClick }) => {
    const { user } = useAuth();
    // ... items ...

    if (!user) return null;

    const { stats } = user;

    return (
        <div className="sticky top-0 h-20 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-8 z-40 shadow-2xl shrink-0 transition-all duration-300">
             {/* Mobile Menu Button - Styled */}
             <button 
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Open Menu"
             >
                <Menu className="w-6 h-6" />
             </button>

             {/* Desktop Welcome / Breadcrumb */}
             <div className="hidden lg:flex items-center gap-2">
                 <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                 <div>
                    <h3 className="text-white font-bold text-sm tracking-wide">Adventure Mode</h3>
                    <p className="text-xs text-gray-500 font-medium">Let the journey begin...</p>
                 </div>
             </div>
            
            <div className="flex items-center gap-3 md:gap-6 ml-auto">
                {/* Stats Group */}
                <div className="flex items-center gap-4 bg-black/20 p-2 rounded-xl border border-white/5 shadow-inner">
                    {/* HP Bar */}
                    <div className="relative group">
                        <div className="flex items-center gap-2 mb-1">
                            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                            <span className="text-[10px] font-bold text-red-400 tracking-wider">HEALTH</span>
                        </div>
                        <div className="w-28 md:w-40 h-4 bg-gray-800/50 rounded-full overflow-hidden relative ring-1 ring-white/10">
                             <motion.div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-red-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.hp}%` }}
                                transition={{ duration: 0.5 }}
                             >
                                 <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                             </motion.div>
                             {/* Numeric Overlay */}
                             <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-md">
                                 {Math.round(stats.hp)} / 100
                             </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-white/10 hidden md:block"></div>

                    {/* XP Bar */}
                    <div className="relative group">
                         <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-bold text-yellow-500 tracking-wider">XP / LVL {stats.level}</span>
                        </div>
                        <div className="w-28 md:w-40 h-4 bg-gray-800/50 rounded-full overflow-hidden relative ring-1 ring-white/10">
                            <motion.div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${(stats.xp / (stats.max_xp || 100)) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                            </motion.div>
                            {/* Numeric Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-md">
                                 {Math.round(stats.xp)} / {stats.max_xp || 100}
                             </div>
                        </div>
                    </div>
                </div>

                {/* Gold Display - Premium Pill */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-900/40 to-yellow-900/40 px-4 py-2 rounded-xl border border-amber-500/20 shadow-lg shadow-amber-900/10 group hover:border-amber-500/40 transition-colors cursor-help" title="Your current Gold balance">
                    <div className="bg-amber-500/10 p-1.5 rounded-full">
                        <Coins className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                        <span className="block text-[10px] text-amber-500/80 font-bold leading-none mb-0.5">GOLD</span>
                        <span className="font-mono font-bold text-amber-100 text-sm leading-none">{stats.gold.toFixed(0)}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StatsBar;
