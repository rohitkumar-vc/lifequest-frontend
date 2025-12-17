import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../components/ui/Toast'; // Ensure this path is correct

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await api.get('/auth/me');
                setUser(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password, rememberMe = false) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            params: { remember_me: rememberMe }
        });
        
        localStorage.setItem('token', response.data.access_token);
        if (response.data.refresh_token) {
            localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        await fetchUser();
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Enforce Password Change
    useEffect(() => {
        if (user?.change_password_required) {
            if (location.pathname !== '/profile') {
                addToast('Security Alert: Please change your password immediately.', 'error');
                navigate('/profile');
            }
        }
    }, [user, location.pathname]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
