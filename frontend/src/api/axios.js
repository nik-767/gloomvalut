import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://127.0.0.1:8000/api/', // Replace with your Django backend URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default axiosInstance;