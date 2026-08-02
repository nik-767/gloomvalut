import axiosInstance from './axios';

export const getTags = async () => {
  const response = await axiosInstance.get('tags/');
  return response.data;
};

export const createTag = async (name) => {
  const response = await axiosInstance.post('tags/', { name });
  return response.data;
};

export default {
  getTags,
  createTag,
};
