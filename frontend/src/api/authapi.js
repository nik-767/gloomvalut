import axiosInstance from './axios';
import { getUserIdFromToken } from '../utils/jwt';

/**
 * Trims auth payload strings before sending them to Django.
 */
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

/**
 * Registers a new guild member and returns the backend response with JWT tokens.
 */
export const registerUser = async (userData) => {
  const response = await axiosInstance.post('register/', normalizeAuthPayload(userData));
  return response.data;
};

/**
 * Logs a user in and returns access/refresh tokens from Simple JWT.
 */
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('login/', normalizeAuthPayload(credentials));
  return response.data;
};

/**
 * Requests a fresh access token using the stored refresh token.
 */
export const refreshToken = async (refresh) => {
  const response = await axiosInstance.post('token/refresh/', { refresh });
  return response.data;
};

/**
 * Rebuilds the current user object from localStorage and the JWT payload.
 */
export const getCurrentUser = async () => {
  const storedUser = localStorage.getItem('current_user');
  const accessToken = localStorage.getItem('access_token');
  const tokenUserId = getUserIdFromToken(accessToken);

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);

    return {
      ...parsedUser,
      id: parsedUser.id ?? tokenUserId,
    };
  }

  return {
    id: tokenUserId,
    username: 'Guest',
    email: '',
  };
};
