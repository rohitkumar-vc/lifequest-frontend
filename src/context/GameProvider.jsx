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

    // --- Habits Logic ---
    const [habits, setHabits] = useState([]);

    /**
     * Fetches all habits for the current user.
     * Populates the `habits` state.
     */
    const fetchHabits = async () => {
        if (!user) return;
        try {
            const response = await api.get('/habits/');
            setHabits(response.data);
        } catch (error) {
            console.error("Failed to fetch habits", error);
        }
    };

    /**
     * Creates a new habit.
     * @param {Object} habitData - { title, type: 'positive'|'negative', difficulty }
     */
    const createHabit = async (habitData) => {
        try {
            await api.post('/habits/', habitData);
            await fetchHabits();
            await refreshUser();
            return true;
        } catch (error) {
            console.error("Failed to create habit", error);
            throw error;
        }
    };

    /**
     * Triggers a habit action (Success/Failure).
     * @param {string} habitId 
     * @param {'success'|'failure'} action 
     * @returns {Object} { habit, badge_unlocked, badge_label }
     */
    const triggerHabit = async (habitId, action) => {
        try {
            const res = await api.post(`/habits/${habitId}/trigger`, { action });
            await fetchHabits();
            await refreshUser();
            return res.data; 
        } catch (error) {
            console.error("Failed to trigger habit", error);
            throw error;
        }
    };

    const deleteHabit = async (habitId) => {
        try {
            await api.delete(`/habits/${habitId}`);
            await fetchHabits();
        } catch (error) {
            console.error("Failed to delete habit", error);
        }
    };

    // Initial Load
    useEffect(() => {
        if (user) {
            fetchHabits();
        }
    }, [user]);

    return (
        <GameContext.Provider value={{ tasks, habits, shopItems, fetchTasks, fetchHabits, completeTask, createHabit, toggleHabit, triggerHabit, deleteHabit, toggleDaily, buyItem, deleteTask, deleteShopItem }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
