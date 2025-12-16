import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip interceptor logic for login requests to avoid infinite loops or reloads
        if (originalRequest.url.includes('/auth/login')) {
            return Promise.reject(error);
        }

        // If error is 401 and we haven't retried yet
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // Call backend to refresh token
                    // We use axios directly to avoid interceptor loop
                    const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`,
                        { refresh_token: refreshToken }
                    );

                    const newAccessToken = response.data.access_token;
                    const newRefreshToken = response.data.refresh_token;

                    localStorage.setItem('token', newAccessToken);
                    // If backend rotates refresh token, update it too
                    if (newRefreshToken) {
                        localStorage.setItem('refresh_token', newRefreshToken);
                    }

                    // Update header and retry original request
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed - logout
                    console.error("Session expired", refreshError);
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                }
            } else {
                // No refresh token available
                localStorage.removeItem('token');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
