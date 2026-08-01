import api from "./axios";

const normalizeAuthPayload = (data = {}) => {
    const payload = { ...data };

    if (typeof payload.username === 'string') {
        payload.username = payload.username.trim();
    }

    if (typeof payload.email === 'string') {
        payload.email = payload.email.trim();
    }

    return payload;
};

export const registerUser = async (userData) => {
    const response = await api.post("register/", normalizeAuthPayload(userData));
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await api.post("login/", normalizeAuthPayload(credentials));
    return response.data;
};

export const refreshToken = async (refresh) => {
    const response = await api.post("token/refresh/", {
        refresh,
    });

    return response.data;
};

export const getCurrentUser = async (fallbackUser = null) => {
    const storedUser = localStorage.getItem("current_user");

    if (storedUser) {
        return JSON.parse(storedUser);
    }

    if (fallbackUser) {
        return fallbackUser;
    }

    return {
        id: null,
        username: "Guest",
    };
};


