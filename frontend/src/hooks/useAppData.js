import { useAppDataContext } from '../context/AppDataContext';

/**
 * Backward-compatible hook that exposes users, tags, and profile helpers.
 */
export const useAppData = () => {
  const {
    users,
    tags,
    profiles,
    profileCache,
    feedDestinations,
    loadProfile,
    handleUpdateProfile,
  } = useAppDataContext();

  return {
    users,
    tags,
    profiles,
    profileCache,
    feedDestinations,
    loadProfile,
    handleUpdateProfile,
  };
};

export default useAppData;
