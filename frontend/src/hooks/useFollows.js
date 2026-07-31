import { useState } from 'react';

export const useFollows = (currentUser) => {
  const [follows, setFollows] = useState([]);

  const handleFollowToggle = (targetUserId) => {
    const isFollowing = follows.some(
      (f) => f.followerId === currentUser?.id && f.followingId === targetUserId
    );

    if (isFollowing) {
      setFollows((prev) => prev.filter(
        (f) => !(f.followerId === currentUser?.id && f.followingId === targetUserId)
      ));
    } else {
      const newId = follows.reduce((max, f) => Math.max(max, f.id), 0) + 1;
      setFollows((prev) => [
        ...prev,
        {
          id: newId,
          followerId: currentUser?.id ?? null,
          followingId: targetUserId
        }
      ]);
    }
  };

  return { follows, setFollows, handleFollowToggle };
};
