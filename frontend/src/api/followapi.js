import axiosInstance from './axios';

/**
 * Reads follower and following lists for a given user id.
 */
export const getFollowData = async (userId) => {
  const response = await axiosInstance.get(`follow/${userId}/`);
  return response.data;
};

/**
 * Toggles follow state for the current user against the target user id.
 */
export const toggleFollow = async (userId) => {
  const response = await axiosInstance.post(`follow/${userId}/`);
  return response.data;
};
