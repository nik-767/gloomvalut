import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import * as destinationApi from '../api/destinationapi';
import * as reviewApi from '../api/reviewapi';
import * as followApi from '../api/followapi';
import * as profileApi from '../api/profileapi';
import * as feedApi from '../api/feedapi';
import {
  collectTagsFromDestinations,
  collectUsersFromData,
  mapDestination,
  mapFollow,
  mapProfile,
  mapReview,
} from '../utils/mappers';

const AppDataContext = createContext(null);

/**
 * Provides shared castle data to every authenticated page.
 * Centralizing fetches here prevents duplicate API calls and stale UI state.
 */
export const AppDataProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [destinations, setDestinations] = useState([]);
  const [feedDestinations, setFeedDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [follows, setFollows] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [profileCache, setProfileCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads destinations, reviews, and follow relationships from the backend.
   */
  const refreshAll = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [
        destinationRows,
        reviewRows,
        followRows,
        feedRows,
      ] = await Promise.all([
        destinationApi.getDestinations(),
        reviewApi.getAllReviews(),
        followApi.getFollowData(user.id),
        feedApi.getFeedDestinations(),
      ]);

      const mappedDestinations = destinationRows.map(mapDestination);
      const mappedReviews = reviewRows.map(mapReview);
      const mappedFollows = [
        ...(followRows.followerse ?? []).map(mapFollow),
        ...(followRows.following ?? []).map(mapFollow),
      ];
      const uniqueFollows = Array.from(
        new Map(mappedFollows.map((follow) => [follow.id, follow])).values()
      );

      setDestinations(mappedDestinations);
      setReviews(mappedReviews);
      setFollows(uniqueFollows);
      setFeedDestinations(feedRows.map(mapDestination));
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          'Failed to load vault data.'
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const tags = useMemo(
    () => collectTagsFromDestinations(destinations),
    [destinations]
  );

  const users = useMemo(
    () =>
      collectUsersFromData({
        destinations,
        reviews,
        profiles,
        currentUser: user,
      }),
    [destinations, reviews, profiles, user]
  );

  /**
   * Creates a destination and inserts it into local state immediately.
   */
  const handleAddDestination = async (destinationData) => {
    const created = await destinationApi.createDestination(destinationData);
    const mapped = mapDestination(created);
    setDestinations((prev) => [mapped, ...prev]);
    return mapped;
  };

  /**
   * Updates a destination and keeps list and feed views synchronized.
   */
  const handleUpdateDestination = async (id, updateData) => {
    const updated = await destinationApi.updateDestination(id, updateData);
    const mapped = mapDestination(updated);

    setDestinations((prev) =>
      prev.map((destination) => (destination.id === id ? mapped : destination))
    );
    setFeedDestinations((prev) =>
      prev.map((destination) => (destination.id === id ? mapped : destination))
    );

    return mapped;
  };

  /**
   * Deletes a destination owned by the current user.
   */
  const handleDeleteDestination = async (id) => {
    await destinationApi.deleteDestination(id);

    setDestinations((prev) => prev.filter((destination) => destination.id !== id));
    setFeedDestinations((prev) => prev.filter((destination) => destination.id !== id));
    setReviews((prev) => prev.filter((review) => review.destinationId !== id));
  };

  /**
   * Adds a review for a destination and refreshes the shared review list.
   */
  const handleAddReview = async (destinationId, reviewData) => {
    const created = await reviewApi.createReview(destinationId, reviewData);
    const mapped = mapReview(created);
    setReviews((prev) => [...prev, mapped]);
    return mapped;
  };

  /**
   * Removes a review from both the API and local state.
   */
  const handleDeleteReview = async (reviewId) => {
    await reviewApi.deleteReview(reviewId);
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
  };

  /**
   * Toggles follow/unfollow against another explorer.
   */
  const handleFollowToggle = async (targetUserId) => {
    const response = await followApi.toggleFollow(targetUserId);
    const followRows = await followApi.getFollowData(user.id);
    const mappedFollows = [
      ...(followRows.followerse ?? []).map(mapFollow),
      ...(followRows.following ?? []).map(mapFollow),
    ];
    const uniqueFollows = Array.from(
      new Map(mappedFollows.map((follow) => [follow.id, follow])).values()
    );
    setFollows(uniqueFollows);

    // Update target user's cached profile follow state and count
    setProfileCache((prev) => {
      const cached = prev[targetUserId];
      if (!cached) return prev;
      const isFollowingNow = response.status === 'followed';
      const wasFollowing = cached.isFollowing;
      let diff = 0;
      if (wasFollowing && !isFollowingNow) diff = -1;
      else if (!wasFollowing && isFollowingNow) diff = 1;

      return {
        ...prev,
        [targetUserId]: {
          ...cached,
          isFollowing: isFollowingNow,
          followersCount: Math.max(0, (cached.followersCount ?? 0) + diff),
        },
      };
    });
  };

  /**
   * Loads and caches a public profile page payload.
   */
  const loadProfile = useCallback(async (userId) => {
    const payload = await profileApi.getProfile(userId);
    const mappedProfile = mapProfile(payload.profile);
    const mappedPosts = payload.user_posts.map(mapDestination);

    setProfileCache((prev) => ({
      ...prev,
      [userId]: {
        profile: mappedProfile,
        userPosts: mappedPosts,
        isFollowing: payload.is_following,
        followersCount: payload.followers_count,
        followingCount: payload.following_count,
      },
    }));

    setProfiles((prev) => {
      const exists = prev.some((profile) => profile.userId === mappedProfile.userId);
      return exists
        ? prev.map((profile) =>
            profile.userId === mappedProfile.userId ? mappedProfile : profile
          )
        : [...prev, mappedProfile];
    });

    mappedPosts.forEach((destination) => {
      setDestinations((prev) => {
        const exists = prev.some((item) => item.id === destination.id);
        return exists
          ? prev.map((item) => (item.id === destination.id ? destination : item))
          : [...prev, destination];
      });
    });

    return payload;
  }, []);

  /**
   * Updates the signed-in user's biography and optional avatar.
   */
  const handleUpdateProfile = useCallback(async (userId, profileData) => {
    const updated = await profileApi.updateProfile(userId, profileData);
    const mappedProfile = mapProfile(updated);

    setProfiles((prev) =>
      prev.map((profile) =>
        profile.userId === mappedProfile.userId ? mappedProfile : profile
      )
    );

    setProfileCache((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        profile: mappedProfile,
      },
    }));

    return mappedProfile;
  }, []);

  const value = {
    destinations,
    feedDestinations,
    reviews,
    follows,
    profiles,
    profileCache,
    users,
    tags,
    loading,
    error,
    refreshAll,
    handleAddDestination,
    handleUpdateDestination,
    handleDeleteDestination,
    handleAddReview,
    handleDeleteReview,
    handleFollowToggle,
    handleUpdateProfile,
    loadProfile,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

/**
 * Reads shared vault data from AppDataProvider.
 */
export const useAppDataContext = () => {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppDataContext must be used within AppDataProvider');
  }

  return context;
};

export default AppDataContext;
