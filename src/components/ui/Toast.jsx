import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

// Utility for Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />
    };

    const styles = {
        success: 'bg-green-500/10 border-green-500/20 text-green-100',
        error: 'bg-red-500/10 border-red-500/20 text-red-100',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-100'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={cn(
                "pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-md min-w-[300px] max-w-sm",
                styles[type] || styles.info
            )}
        >
            <div className="mt-0.5">{icons[type] || icons.info}</div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};
