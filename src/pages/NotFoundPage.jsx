import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
                    <AlertCircle className="w-24 h-24 text-red-500 relative z-10" />
                </div>
                
                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-white mb-4">Lost in the Void</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    The path you seek cannot be found. It may have been destroyed or never existed in this realm.
                </p>

                <button 
                    onClick={() => navigate('/')}
                    className="group flex items-center gap-2 mx-auto bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-6 py-3 rounded-xl transition-all"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Return to Home Base</span>
                </button>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
