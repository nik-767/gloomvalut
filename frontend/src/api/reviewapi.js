import axiosInstance  from "./axiosInstance";

export const getReviews = async () => {
    try {
        const response = await axiosInstance.get("/reviews");
        return response.data
    }catch(error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
}

export const getReviewById = async (id) => {
    try {
        const response = await axiosInstance.get(`/reviews/${id}`);
        return response.data
    }catch(error) {
        console.error('error fetching review by id:' , error);
        throw error;
    }
}

export const createReview = async (reviewData) => {
    try {
        const response = await axiosInstance.post(`/reviews/${reviewData}`);
        return response.reviewData
    }
    catch(error) {
        console.error('error creating review:' , error);
        throw error;
    }
}

export const updateReview = async (reviewId, reviewData) => {
    const response = await axiosInstance.put(
        `reviews/${reviewId}/`,
        reviewData
    );

    return response.data;
};

export const deleteReview = async (reviewId) => {
    const response = await axiosInstance.delete(
        `reviews/${reviewId}/`
    );

    return response.data;
};