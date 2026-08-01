import axiosInstance from './axios';

/**
 * Fetches every castle destination from the Django viewset.
 */
export const getDestinations = async () => {
  const response = await axiosInstance.get('gloomvalutview/');
  return response.data;
};

/**
 * Fetches one destination by primary key.
 */
export const getDestination = async (id) => {
  const response = await axiosInstance.get(`gloomvalutview/${id}/`);
  return response.data;
};

/**
 * Creates a destination using multipart form data so image uploads work.
 */
export const createDestination = async (data) => {
  const formData = new FormData();

  formData.append('castle', data.castle);
  formData.append('country', data.country);
  formData.append('description', data.description);
  formData.append('atmosphere', data.atmosphere);

  if (data.imageFile) {
    formData.append('image', data.imageFile);
  }

  data.tagIds?.forEach((tagId) => {
    formData.append('tags', tagId);
  });

  const response = await axiosInstance.post('gloomvalutview/', formData);

  return response.data;
};

/**
 * Updates an existing destination. Supports optional image replacement.
 */
export const updateDestination = async (id, data) => {
  const formData = new FormData();

  formData.append('castle', data.castle);
  formData.append('country', data.country);
  formData.append('description', data.description);
  formData.append('atmosphere', data.atmosphere);

  if (data.imageFile) {
    formData.append('image', data.imageFile);
  }

  data.tagIds?.forEach((tagId) => {
    formData.append('tags', tagId);
  });

  const response = await axiosInstance.patch(`gloomvalutview/${id}/`, formData);

  return response.data;
};

/**
 * Permanently removes a destination from the vault.
 */
export const deleteDestination = async (id) => {
  const response = await axiosInstance.delete(`gloomvalutview/${id}/`);
  return response.data;
};
