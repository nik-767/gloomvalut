import React, { useState } from 'react';
import { UserPlus, UserMinus, Compass, MessageSquare, Star, ArrowLeft, Calendar } from 'lucide-react';
import DestinationCard from './DestinationCard';

export default function ProfileView({ 
  userId, 
  users, 
  profiles, 
  destinations, 
  reviews, 
  follows, 
  currentUser, 
  onFollowToggle, 
  onSelectDestination, 
  onSelectUser,
  onBack 
}) {
  const [activeTab, setActiveTab] = useState('destinations');

  const user = users.find(u => u.id === userId);
  if (!user) return <div>User not found.</div>;

  const profile = profiles.find(p => p.userId === user.id) || { bio: 'No biography provided yet.', created: new Date().toISOString() };
  const userDestinations = destinations.filter(d => d.posted_by === user.id);
  const userReviews = reviews.filter(r => r.userId === user.id);

  const isOwnProfile = user.id === currentUser?.id;

  // Follow statistics calculation
  const followerCount = follows.filter(f => f.followingId === user.id).length;
  const followingCount = follows.filter(f => f.followerId === user.id).length;
  const isFollowing = follows.some(f => f.followerId === currentUser?.id && f.followingId === user.id);

  // Formatting date
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div>
      {/* Back Button if not own profile */}
      {!isOwnProfile && onBack && (
        <button onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      )}

      {/* Profile Info Header */}
      <div>
        <div>
          {/* Avatar */}
          <div>
            {user.username.substring(0, 2).toUpperCase()}
          </div>

          {/* Core Info */}
          <div>
            <div>
              <h1>
                {user.username}
              </h1>
              
              {/* Follow / Unfollow Button */}
              {!isOwnProfile && (
                <button onClick={() => onFollowToggle?.(user.id)}>
                  {isFollowing ? (
                    <>
                      <UserMinus size={14} />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div>
              <Calendar size={14} />
              <span>Joined {formatDate(profile.created)}</span>
            </div>

            <p>
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div>
          <div>
            <div>{userDestinations.length}</div>
            <div>Castles</div>
          </div>
          <div>
            <div>{userReviews.length}</div>
            <div>Reviews</div>
          </div>
          <div>
            <div>{followerCount}</div>
            <div>Followers</div>
          </div>
          <div>
            <div>{followingCount}</div>
            <div>Following</div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div>
        <button onClick={() => setActiveTab('destinations')}>
          <Compass size={16} />
          <span>Destinations Posted</span>
        </button>

        <button onClick={() => setActiveTab('reviews')}>
          <MessageSquare size={16} />
          <span>Reviews Left</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'destinations' ? (
        userDestinations.length > 0 ? (
          <div>
            {userDestinations.map(dest => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onSelect={() => onSelectDestination?.(dest.id)}
              />
            ))}
          </div>
        ) : (
          <div>
            No castle destinations posted yet.
          </div>
        )
      ) : (
        userReviews.length > 0 ? (
          <div>
            {userReviews.map(rev => {
              const castleObj = destinations.find(d => d.id === rev.destinationId);
              return (
                <div 
                  key={rev.id} 
                  onClick={() => castleObj && onSelectDestination?.(castleObj.id)}
                >
                  <div>
                    <h3>
                      {castleObj ? castleObj.castle : 'Unknown Castle'}
                    </h3>
                    <div>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < rev.rating ? 'currentColor' : 'transparent'} 
                        />
                      ))}
                    </div>
                  </div>
                  <p>
                    "{rev.comment}"
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            No reviews written yet.
          </div>
        )
      )}
    </div>
  );
}
