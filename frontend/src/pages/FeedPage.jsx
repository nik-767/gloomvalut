import React from 'react';
import { Star, MessageSquare, Compass, UserPlus, Sparkles, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDestinations } from '../hooks/useDestinations';
import { useReviews } from '../hooks/useReviews';
import { useFollows } from '../hooks/useFollows';
import { useAppData } from '../hooks/useAppData';

export default function FeedView({ currentUser }) {
  const { destinations } = useDestinations(currentUser);
  const { reviews } = useReviews();
  const { follows, handleFollowToggle } = useFollows(currentUser);
  const { users } = useAppData();
  
  const navigate = useNavigate();
  const onSelectUser = (id) => navigate(`/profile/${id}`);
  const onSelectDestination = (id) => navigate(`/destination/${id}`);
  const onNavigateToExplore = () => navigate('/explore');
  const onFollowToggle = handleFollowToggle;
  // Get list of user IDs that current user follows
  const followedUserIds = follows
    .filter(f => f.followerId === currentUser?.id)
    .map(f => f.followingId);

  // Compile feed items:
  // 1. Destinations posted by followed users
  const feedDestinations = destinations
    .filter(d => followedUserIds.includes(d.posted_by))
    .map(d => ({
      ...d,
      type: 'destination',
      date: new Date().toISOString() // Mock date
    }));

  // 2. Reviews posted by followed users
  const feedReviews = reviews
    .filter(r => followedUserIds.includes(r.userId))
    .map(r => ({
      ...r,
      type: 'review',
      date: new Date().toISOString() // Mock date
    }));

  // Combine and sort (for simplicity, we just list them combined)
  const feedItems = [...feedDestinations, ...feedReviews];

  // Users we might recommend to follow (any user we don't already follow and is not ourselves)
  const recommendedUsers = users.filter(u => 
    u.id !== currentUser?.id && 
    !followedUserIds.includes(u.id)
  );

  return (
    <div>
      <div>
        <div>
          {/* Main Feed Column */}
          <div>
            <h2>
              Your Castle Timeline
            </h2>

            {feedItems.length > 0 ? (
              feedItems.map((item, idx) => {
                if (item.type === 'destination') {
                  const creator = users.find(u => u.id === item.posted_by);
                  return (
                    <div key={`dest-${item.id}-${idx}`}>
                      <div>
                        <div>
                          {creator?.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span onClick={() => creator && onSelectUser?.(creator.id)}>
                            {creator?.username}
                          </span>
                          <span> posted a new castle destination</span>
                        </div>
                      </div>

                      {/* Destination Mini Preview */}
                      <div onClick={() => onSelectDestination?.(item.id)}>
                        <img 
                          src={item.imageUrl} 
                          alt={item.castle} 
                        />
                        <div>
                          <h3>{item.castle}</h3>
                          <span>{item.country}</span>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // Review item
                  const reviewer = users.find(u => u.id === item.userId);
                  const dest = destinations.find(d => d.id === item.destinationId);
                  return (
                    <div key={`rev-${item.id}-${idx}`}>
                      <div>
                        <div>
                          {reviewer?.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span onClick={() => reviewer && onSelectUser?.(reviewer.id)}>
                            {reviewer?.username}
                          </span>
                          <span> reviewed </span>
                          <strong onClick={() => dest && onSelectDestination?.(dest.id)}>
                            {dest?.castle}
                          </strong>
                        </div>
                        <div>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < item.rating ? 'currentColor' : 'transparent'} 
                            />
                          ))}
                        </div>
                      </div>

                      <p>
                        "{item.comment}"
                      </p>
                    </div>
                  );
                }
              })
            ) : (
              <div>
                <Sparkles size={36} />
                <h3>Your timeline is empty</h3>
                <p>
                  Follow other castle explorers or head to the Explore tab to find and rate amazing destinations.
                </p>
                <button onClick={onNavigateToExplore}>
                  <Compass size={16} />
                  <span>Explore Castles</span>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Columns (Suggestions & Stats) */}
          <div>
            {/* User Stats Card */}
            <div>
              <h3>Explorer Status</h3>
              <div>
                <div>
                  {currentUser?.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong>{currentUser?.username}</strong>
                  <span>Guild Member</span>
                </div>
              </div>
              <div>
                <span>Following: {follows.filter(f => f.followerId === currentUser?.id).length}</span>
                <span>Followers: {follows.filter(f => f.followingId === currentUser?.id).length}</span>
              </div>
            </div>

            {/* Recommendations Card */}
            <div>
              <h3>Explorers to Follow</h3>
              {recommendedUsers.length > 0 ? (
                <div>
                  {recommendedUsers.map((user) => (
                    <div key={user.id}>
                      <div onClick={() => onSelectUser?.(user.id)}>
                        <div>
                          {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span>
                          {user.username}
                        </span>
                      </div>
                      <button onClick={() => onFollowToggle?.(user.id)}>
                        <UserPlus size={12} />
                        <span>Follow</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>
                  You are following everyone in the vault!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
