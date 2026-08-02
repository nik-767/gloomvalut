import axiosInstance from './axios';
import { getUserIdFromToken } from '../utils/jwt';

const saveTokens = (tokens) => {
  const access = tokens?.access ?? tokens?.tokens?.access;
  const refresh = tokens?.refresh ?? tokens?.tokens?.refresh;
  const userId = getUserIdFromToken(access);

  if (access) {
    localStorage.setItem('access_token', access);
  }

  if (refresh) {
    localStorage.setItem('refresh_token', refresh);
  }

  if (userId) {
    localStorage.setItem('user_id', String(userId));
  }
};

const buildError = (error) => {
  if (!error?.response) {
    return new Error('Network error. Please try again.');
  }

  return new Error(error.response.data?.detail || error.response.data?.error || 'An unexpected error occurred.');
};

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('login/', {
      username,
      password,
    });

    saveTokens(response.data.tokens);
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
};

export const getFeed = async () => {
  try {
    const response = await axiosInstance.get('feed/');
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
};

export const createCastle = async (formData) => {
  try {
    const response = await axiosInstance.post('gloomvalutview/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
};

export const updateCastle = async (id, patchData) => {
  try {
    const response = await axiosInstance.patch(`gloomvalutview/${id}/`, patchData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
};

export const deleteCastle = async (id) => {
  try {
    const response = await axiosInstance.delete(`gloomvalutview/${id}/`);
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
};

export const getProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(`profile/${userId}/`);
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
};

export const updateMyProfile = async (formData) => {
  try {
    const response = await axiosInstance.put('my-profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
};

export const getReviews = async (destinationId) => {
  try {
    const response = await axiosInstance.get(`reviews/${destinationId}/`);
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
};

export const addReview = async (destinationId, comment, rating) => {
  try {
    const response = await axiosInstance.post(`reviews/${destinationId}/`, {
      comment,
      rating,
    });
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
};

export const manageReview = async (reviewId, action, data = {}) => {
  try {
    if (action === 'patch') {
      const response = await axiosInstance.patch(`Reviewview/${reviewId}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    if (action === 'delete') {
      const response = await axiosInstance.delete(`Reviewview/${reviewId}/`);
      return response.data;
    }

    throw new Error('Invalid review action. Use "patch" or "delete".');
  } catch (error) {
    throw buildError(error);
  }
};

export const toggleFollow = async (userId) => {
  try {
    const response = await axiosInstance.post(`follow/${userId}/`);
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
};
