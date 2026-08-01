import { DEFAULT_CASTLE_IMAGE, resolveMediaUrl } from './media';

/**
 * Normalizes a destination record from Django into the shape used by React components.
 */
export const mapDestination = (destination = {}) => ({
  id: destination.id,
  castle: destination.castle,
  country: destination.country,
  description: destination.description,
  atmosphere: Number(destination.atmosphere ?? 0),
  posted_by: destination.posted_by ?? null,
  postedByUsername: destination.posted_by_username ?? null,
  imageUrl: resolveMediaUrl(destination.image, DEFAULT_CASTLE_IMAGE),
  tagIds: Array.isArray(destination.tags) ? destination.tags : [],
  tags: Array.isArray(destination.tags_detail) ? destination.tags_detail : [],
});

/**
 * Normalizes a review record from Django into frontend-friendly field names.
 */
export const mapReview = (review = {}) => ({
  id: review.id,
  comment: review.comment,
  rating: Number(review.rating ?? 0),
  userId: review.user,
  username: review.username ?? null,
  destinationId: review.destination,
  destinationName: review.destination_name ?? null,
});

/**
 * Normalizes follow rows returned by the follow API.
 */
export const mapFollow = (follow = {}) => ({
  id: follow.id,
  followerId: follow.followers,
  followingId: follow.following,
});

/**
 * Normalizes profile payloads from the profile API.
 */
export const mapProfile = (profile = {}) => ({
  id: profile.id,
  userId: profile.user_id ?? profile.user,
  username: profile.username ?? null,
  bio: profile.bio ?? '',
  created: profile.created ?? null,
  imageUrl: resolveMediaUrl(profile.pic),
});

/**
 * Builds a lightweight user object for display in cards and feed items.
 */
export const mapUser = (id, username) => ({
  id,
  username: username || `Explorer ${id}`,
});

/**
 * Collects unique tags from destination records for Explore filters.
 */
export const collectTagsFromDestinations = (destinations = []) => {
  const tagMap = new Map();

  destinations.forEach((destination) => {
    destination.tags?.forEach((tag) => {
      if (tag?.id) {
        tagMap.set(tag.id, tag);
      }
    });
  });

  return Array.from(tagMap.values());
};

/**
 * Builds a deduplicated user directory from destinations, reviews, and profiles.
 */
export const collectUsersFromData = ({
  destinations = [],
  reviews = [],
  profiles = [],
  currentUser = null,
} = {}) => {
  const userMap = new Map();

  if (currentUser?.id) {
    userMap.set(currentUser.id, mapUser(currentUser.id, currentUser.username));
  }

  destinations.forEach((destination) => {
    if (destination.posted_by) {
      userMap.set(
        destination.posted_by,
        mapUser(destination.posted_by, destination.postedByUsername)
      );
    }
  });

  reviews.forEach((review) => {
    if (review.userId) {
      userMap.set(review.userId, mapUser(review.userId, review.username));
    }
  });

  profiles.forEach((profile) => {
    if (profile.userId) {
      userMap.set(profile.userId, mapUser(profile.userId, profile.username));
    }
  });

  return Array.from(userMap.values());
};
