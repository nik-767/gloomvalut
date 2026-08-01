import { useAppDataContext } from '../context/AppDataContext';

/**
 * Backward-compatible hook that exposes review actions from shared app data.
 */
export const useReviews = () => {
  const {
    reviews,
    handleAddReview,
    handleDeleteReview,
  } = useAppDataContext();

  return {
    reviews,
    handleAddReview,
    handleDeleteReview,
  };
};

export default useReviews;
