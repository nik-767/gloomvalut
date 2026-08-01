import { useAppDataContext } from '../context/AppDataContext';

/**
 * Backward-compatible hook that exposes destination actions from shared app data.
 */
export const useDestinations = () => {
  const {
    destinations,
    loading,
    error,
    refreshAll,
    handleAddDestination,
    handleUpdateDestination,
    handleDeleteDestination,
  } = useAppDataContext();

  return {
    destinations,
    loading,
    error,
    fetchDestinations: refreshAll,
    createDestination: handleAddDestination,
    handleAddDestination,
    updateDestination: handleUpdateDestination,
    deleteDestination: handleDeleteDestination,
  };
};

export default useDestinations;
