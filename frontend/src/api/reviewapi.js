import axiosInstance from './axios';

/**
 * Loads all reviews from the Review viewset.
 */
export const getAllReviews = async () => {
  const response = await axiosInstance.get('Reviewview/');
  return response.data;
};

/**
 * Loads reviews for one destination through the nested review API route.
 */
export const getReviewsByDestination = async (destinationId) => {
  const response = await axiosInstance.get(`reviews/${destinationId}/`);
  return response.data;
};

/**
 * Creates a review for a destination. The backend attaches the current user automatically.
 */
export const createReview = async (destinationId, reviewData) => {
  const response = await axiosInstance.post(`reviews/${destinationId}/`, {
    comment: reviewData.comment,
    rating: reviewData.rating,
  });

  return response.data;
};

/**
 * Updates an existing review through the Review viewset.
 */
export const updateReview = async (reviewId, reviewData) => {
  const response = await axiosInstance.patch(`Reviewview/${reviewId}/`, reviewData);
  return response.data;
};

/**
 * Deletes a review through the Review viewset.
 */
export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(`Reviewview/${reviewId}/`);
  return response.data;
};
