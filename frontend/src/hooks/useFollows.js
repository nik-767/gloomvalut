import { useAppDataContext } from '../context/AppDataContext';

/**
 * Backward-compatible hook that exposes follow actions from shared app data.
 */
export const useFollows = () => {
  const { follows, handleFollowToggle } = useAppDataContext();

  return {
    follows,
    handleFollowToggle,
  };
};

export default useFollows;
