import { useState, useCallback } from 'react';
import { createDestination } from '../api/destinationapi';

export const useDestinations = (currentUser) => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDestinations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real implementation, we would fetch from getDestinations() here
      // For now, we preserve the existing empty state behavior
    } catch (err) {
      setError(err.message || 'Failed to fetch destinations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddDestination = async (newDest) => {
    try {
      const newId = destinations.reduce((max, d) => Math.max(max, d.id), 0) + 1;
      setDestinations((prev) => [
        {
          id: newId,
          posted_by: currentUser?.id ?? null,
          ...newDest
        },
        ...prev
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  return { destinations, setDestinations, handleAddDestination, isLoading, error, refetch: fetchDestinations };
};
