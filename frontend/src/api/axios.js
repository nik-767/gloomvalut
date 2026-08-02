import axios from 'axios';

const rawApiUrl = (import.meta.env.VITE_API_URL || '/api').trim();
const API_URL = rawApiUrl.replace(/\/+$/, '');
const normalizedApiUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

const axiosInstance = axios.create({
    baseURL: normalizedApiUrl,
});

// debug: print resolved API base URL in deployed build console
try {
    // only run in environments where console is available
    console.debug && console.debug('API baseURL:', normalizedApiUrl);
} catch (e) {}

// separate client for token refresh to avoid interceptor recursion
const refreshClient = axios.create({
    baseURL: normalizedApiUrl,
});
axiosInstance.interceptors.request.use(
    (config) => {
        try {
            console.debug && console.debug('Axios request:', config.method, config.url);
        } catch (e) {}
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
                    return Promise.reject(new Error('No refresh token'));
                }

                const req = await refreshClient.post('token/refresh/', {
                    refresh: refreshToken,
                });

                const newAccessToken = req.data.access;

                localStorage.setItem("access_token", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/";
                return Promise.reject(refreshError);
            }
        }

        try {
            console.error && console.error('Axios response error:', error?.response?.status, error?.config?.url, error?.response?.data);
        } catch (e) {}
        return Promise.reject(error);
    }
);

export default axiosInstance;