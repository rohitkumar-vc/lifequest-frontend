import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthProvider';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const { user, refreshUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [shopItems, setShopItems] = useState({});

    const fetchTasks = async () => {
        if (!user) return;
        try {
            const response = await api.get('/tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    const fetchShop = async () => {
         if (!user) return;
        try {
            const response = await api.get('/shop/items');
            setShopItems(response.data);
        } catch (error) {
            console.error("Failed to fetch shop", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTasks();
            fetchShop(); // Load initially
        }
    }, [user]);

    const completeTask = async (taskId) => {
        try {
            await api.post(`/tasks/${taskId}/complete`);
            await refreshUser(); // Update stats
            await fetchTasks(); // Update task list
            return true;
        } catch (error) {
            console.error("Failed to complete task", error);
            throw error;
        }
    };
    
    const toggleHabit = async (taskId) => {
        try {
            await api.post(`/tasks/${taskId}/habit-toggle`);
            await refreshUser();
            await fetchTasks();
        } catch (error) {
            console.error("Failed to toggle habit", error);
        }
    };

    const toggleDaily = async (taskId) => {
        try {
            await api.post(`/tasks/${taskId}/daily-toggle`);
            await refreshUser();
            await fetchTasks();
        } catch (error) {
             console.error("Failed to toggle daily", error);
        }
    };

    const buyItem = async (itemId) => {
        try {
            await api.post(`/shop/buy/${itemId}`);
            await refreshUser();
            return true;
        } catch (error) {
            console.error("Failed to buy item", error);
             throw error;
        }
    };

    const deleteTask = async (taskId) => {
        try {
             await api.delete(`/tasks/${taskId}`);
             await fetchTasks();
             await refreshUser(); // In case of upfront gold penalty
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const deleteShopItem = async (itemId) => {
        try {
             await api.delete(`/shop/items/${itemId}`);
             await fetchShop();
        } catch (error) {
            console.error("Failed to delete shop item", error);
        }
    };

    return (
        <GameContext.Provider value={{ tasks, shopItems, fetchTasks, completeTask, toggleHabit, toggleDaily, buyItem, deleteTask, deleteShopItem }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
