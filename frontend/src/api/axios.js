import axios from 'axios';

const rawApiUrl = (import.meta.env.VITE_API_URL || '/api').trim();
const API_URL = rawApiUrl.replace(/\/+$/, '');
const normalizedApiUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

const axiosInstance = axios.create({
    baseURL: normalizedApiUrl,
});

// Debug: Print resolved API base URL in deployed build console
try {
    if (console.debug) console.debug('API baseURL:', normalizedApiUrl);
} catch (e) {}

// Separate client for token refresh to avoid interceptor recursion
const refreshClient = axios.create({
    baseURL: normalizedApiUrl,
});

axiosInstance.interceptors.request.use(
    (config) => {
        try {
            if (console.debug) console.debug('Axios request:', config.method, config.url);
        } catch (e) {}
        
        const token = localStorage.getItem("access_token");

        if (token) {
            // Added explicit Bearer token header mapping for DRF SimpleJWT
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Fix: Ensure every request endpoint ends with a trailing slash for Django
        if (config.url && !config.url.endsWith('/')) {
            config.url += '/';
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");

                if (!refreshToken) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.href = "/";
                    return Promise.reject(new Error('No refresh token available'));
                }

                // Fix: Removed the duplicate 'api/' subpath mapping. 
                // Since refreshClient baseURL already has '/api', 'token/refresh/' is correct.
                // Added trailing slash verification to match your Django configuration paths.
                const req = await refreshClient.post('token/refresh/', {
                    refresh: refreshToken,
                });

                const newAccessToken = req.data.access;

                localStorage.setItem("access_token", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Clear state and log out if token rotation fails
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/";
                return Promise.reject(refreshError);
            }
        }

        try {
            if (console.error) {
                console.error('Axios response error:', error?.response?.status, error?.config?.url, error?.response?.data);
            }
        } catch (e) {}
        return Promise.reject(error);
    }
);

export default axiosInstance;
