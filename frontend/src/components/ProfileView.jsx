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
  if (!user) return <div style={{ padding: '40px', textAlign: 'center' }}>User not found.</div>;

  const profile = profiles.find(p => p.userId === user.id) || { bio: 'No biography provided yet.', created: new Date().toISOString() };
  const userDestinations = destinations.filter(d => d.posted_by === user.id);
  const userReviews = reviews.filter(r => r.userId === user.id);

  const isOwnProfile = user.id === currentUser.id;

  // Follow statistics calculation
  const followerCount = follows.filter(f => f.followingId === user.id).length;
  const followingCount = follows.filter(f => f.followerId === user.id).length;
  const isFollowing = follows.some(f => f.followerId === currentUser.id && f.followingId === user.id);

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
    <div className="animate-fade-in" style={{ padding: '0 16px 60px 16px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back Button if not own profile */}
      {!isOwnProfile && onBack && (
        <button 
          onClick={onBack}
          className="btn btn-secondary" 
          style={{ marginBottom: '24px', padding: '8px 16px', borderRadius: '8px' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      )}

      {/* Profile Info Header */}
      <div className="glass-panel" style={{ padding: '40px', marginBottom: '32px', position: 'relative' }}>
        {/* Decorative Top Accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
          borderRadius: '16px 16px 0 0'
        }} />

        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          gap: '30px', 
          alignItems: 'center' 
        }}>
          {/* Avatar */}
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--accent-primary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#fff',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            {user.username.substring(0, 2).toUpperCase()}
          </div>

          {/* Core Info */}
          <div style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                {user.username}
              </h1>
              
              {/* Follow / Unfollow Button */}
              {!isOwnProfile && (
                <button
                  onClick={() => onFollowToggle(user.id)}
                  className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem' }}
                >
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              <Calendar size={14} />
              <span>Joined {formatDate(profile.created)}</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', maxWidth: '600px' }}>
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ 
          display: 'flex', 
          gap: '40px', 
          marginTop: '32px', 
          paddingTop: '24px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="text-gradient">{userDestinations.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Castles</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="text-gradient">{userReviews.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reviews</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="text-gradient">{followerCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Followers</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="text-gradient">{followingCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Following</div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '24px',
        gap: '24px'
      }}>
        <button
          onClick={() => setActiveTab('destinations')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'destinations' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'destinations' ? 'var(--text-primary)' : 'var(--text-muted)',
            padding: '12px 4px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s'
          }}
        >
          <Compass size={16} />
          <span>Destinations Posted</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'reviews' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'reviews' ? 'var(--text-primary)' : 'var(--text-muted)',
            padding: '12px 4px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s'
          }}
        >
          <MessageSquare size={16} />
          <span>Reviews Left</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'destinations' ? (
        userDestinations.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {userDestinations.map(dest => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onSelect={() => onSelectDestination(dest.id)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No castle destinations posted yet.
          </div>
        )
      ) : (
        userReviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {userReviews.map(rev => {
              const castleObj = destinations.find(d => d.id === rev.destinationId);
              return (
                <div 
                  key={rev.id} 
                  className="glass-panel" 
                  style={{ 
                    padding: '24px', 
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                  onClick={() => castleObj && onSelectDestination(castleObj.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }} className="hover-underline">
                      {castleObj ? castleObj.castle : 'Unknown Castle'}
                    </h3>
                    <div style={{ display: 'flex', gap: '2px', color: 'var(--warning)' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < rev.rating ? 'currentColor' : 'transparent'} 
                          color={i < rev.rating ? 'var(--warning)' : 'var(--text-muted)'}
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5' }}>
                    "{rev.comment}"
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No reviews written yet.
          </div>
        )
      )}
    </div>
  );
}
