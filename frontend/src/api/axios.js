import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://127.0.0.1:8000/api/', // Replace with your Django backend URL
});

export default axiosInstance;