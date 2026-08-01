import axiosInstance from './axios';

/**
 * Loads a public profile, that user's destinations, and follow statistics.
 */
export const getProfile = async (userId) => {
  const response = await axiosInstance.get(`profile/${userId}/`);
  return response.data;
};

/**
 * Updates the authenticated user's profile bio and optional avatar.
 */
export const updateProfile = async (userId, data) => {
  const formData = new FormData();
  formData.append('bio', data.bio ?? '');

  if (data.imageFile) {
    formData.append('pic', data.imageFile);
  }

  const response = await axiosInstance.patch(`profile/${userId}/`, formData);

  return response.data;
};
