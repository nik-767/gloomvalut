import axiosInstance from './axios';

/**
 * Loads the authenticated user's feed: destinations posted by people they follow.
 */
export const getFeedDestinations = async () => {
  const response = await axiosInstance.get('feed/');
  return response.data;
};
