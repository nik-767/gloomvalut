import axios from 'axios';

const rawApiUrl = (import.meta.env.VITE_API_URL || 'https://gloomvalut.onrender.com/api').trim();
const API_URL = rawApiUrl.replace(/\/+$/, '');
const normalizedApiUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

const axiosInstance = axios.create({
    baseURL: normalizedApiUrl,
});

axiosInstance.interceptors.request.use(
    (config) => {
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

                const req = await axiosInstance.post(
                    'token/refresh/',
                    {
                        refresh: refreshToken,
                    }
                );

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

        return Promise.reject(error);
    }
);

export default axiosInstance;