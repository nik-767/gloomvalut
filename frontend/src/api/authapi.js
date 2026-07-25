import api from "./axios";

export const registerUser = async (userData) => {
    const response = await api.post('register/', userData);
    return response.data;
};

// SEND USER CREDENTIALS TO THE BACKEND FOR LOGIN 
export const loginUser = async (Credentials) => {
    const response = await api.post("token/", Credentials);
    return response.data;
};

export const refreshToken = async (refresh) => {
    const response = await api.post("token/refresh/", {
        refresh,
    });
}

hh nikhil