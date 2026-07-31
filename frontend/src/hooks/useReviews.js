import { useState } from 'react';

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);

  const handleAddReview = (newReview) => {
    const newId = reviews.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    setReviews((prev) => [
      ...prev,
      {
        id: newId,
        ...newReview
      }
    ]);
  };

  return { reviews, setReviews, handleAddReview };
};
