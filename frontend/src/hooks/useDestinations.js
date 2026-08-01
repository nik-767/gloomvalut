import { useState, useEffect, useCallback } from 'react';

import {
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../api/destinationapi';

export const useDestinations = (currentUser) => {
  const [destinations, setDestinations] = useState([]);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDestinations();
      setDestinations(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch destinations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handleCreateDestination = async (destinationData) => {
    setLoading(true);
    setError(null);

    try {
      const newDestination = await createDestination({
        ...destinationData,
        posted_by: currentUser?.id,
      });

      setDestinations((prev) => [newDestination, ...prev]);

      return newDestination;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          'Failed to create destination.'
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDestination = async (id, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await updateDestination(id, updateData);

      setDestinations((prev) =>
        prev.map((dest) => (dest.id === id ? updated : dest))
      );

      return updated;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          'Failed to update destination.'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDestination = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDestination(id);

      setDestinations((prev) =>
        prev.filter((dest) => dest.id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          'Failed to delete destination'
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    destinations,
    destination,
    loading,
    error,
    fetchDestinations,
    createDestination: handleCreateDestination,
    handleAddDestination: handleCreateDestination,
    updateDestination: handleUpdateDestination,
    deleteDestination: handleDeleteDestination,
  };
};

export default useDestinations;
