import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { GameProvider } from './context/GameProvider';
import { ToastProvider } from './components/ui/Toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HabitsPage from './pages/HabitsPage';
import DailiesPage from './pages/DailiesPage';
import TodosPage from './pages/TodosPage';
import ShopPage from './pages/ShopPage';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import SetupPassword from './pages/SetupPassword';
import Layout from './components/Layout';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-bg-dark flex items-center justify-center text-white">Loading...</div>;
    return user ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <GameProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/setup-password" element={<SetupPassword />} />
                        
                        {/* Protected Routes wrapped in Layout */}
import NotFoundPage from './pages/NotFoundPage';

// ... existing imports ...

// Inside component
                        <Route element={<ProtectedRoute />}>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/habits" element={<HabitsPage />} />
                                <Route path="/dailies" element={<DailiesPage />} />
                                <Route path="/todos" element={<TodosPage />} />
                                <Route path="/shop" element={<ShopPage />} />
                                <Route path="/profile" element={<Profile />} /> 
                                <Route path="/admin" element={<AdminDashboard />} />
                            </Route>
                        </Route>

                        {/* 404 Route */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </GameProvider>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
