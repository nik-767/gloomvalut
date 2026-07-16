import React from 'react';
import { Star, MessageSquare, Compass, UserPlus, Sparkles, Heart } from 'lucide-react';

export default function FeedView({ 
  currentUser, 
  users, 
  destinations, 
  reviews, 
  follows, 
  onFollowToggle, 
  onSelectUser, 
  onSelectDestination,
  onNavigateToExplore 
}) {
  // Get list of user IDs that current user follows
  const followedUserIds = follows
    .filter(f => f.followerId === currentUser.id)
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
    u.id !== currentUser.id && 
    !followedUserIds.includes(u.id)
  );

  return (
    <div className="animate-fade-in" style={{ padding: '0 16px 60px 16px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="feed-grid-layout">
        {/* Large media query style simulation in JS */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '32px'
        }}>
          {/* Main Feed Column */}
          <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Your Castle <span className="text-gradient">Timeline</span>
            </h2>

            {feedItems.length > 0 ? (
              feedItems.map((item, idx) => {
                if (item.type === 'destination') {
                  const creator = users.find(u => u.id === item.posted_by);
                  return (
                    <div 
                      key={`dest-${item.id}-${idx}`} 
                      className="glass-panel" 
                      style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}>
                          {creator?.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span 
                            style={{ fontWeight: 600, cursor: 'pointer' }} 
                            onClick={() => onSelectUser(creator.id)}
                            className="hover-underline"
                          >
                            {creator?.username}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> posted a new castle destination</span>
                        </div>
                      </div>

                      {/* Destination Mini Preview */}
                      <div 
                        style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', cursor: 'pointer' }}
                        onClick={() => onSelectDestination(item.id)}
                      >
                        <img 
                          src={item.imageUrl} 
                          alt={item.castle} 
                          style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }} className="hover-underline">{item.castle}</h3>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{item.country}</span>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // Review item
                  const reviewer = users.find(u => u.id === item.userId);
                  const dest = destinations.find(d => d.id === item.destinationId);
                  return (
                    <div 
                      key={`rev-${item.id}-${idx}`} 
                      className="glass-panel" 
                      style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}>
                          {reviewer?.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <span 
                            style={{ fontWeight: 600, cursor: 'pointer' }} 
                            onClick={() => onSelectUser(reviewer.id)}
                            className="hover-underline"
                          >
                            {reviewer?.username}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> reviewed </span>
                          <strong 
                            style={{ color: 'var(--text-primary)', cursor: 'pointer' }} 
                            onClick={() => onSelectDestination(dest.id)}
                            className="hover-underline"
                          >
                            {dest?.castle}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', gap: '2px', color: 'var(--warning)' }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < item.rating ? 'currentColor' : 'transparent'} 
                              color={i < item.rating ? 'var(--warning)' : 'var(--text-muted)'}
                            />
                          ))}
                        </div>
                      </div>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', fontStyle: 'italic' }}>
                        "{item.comment}"
                      </p>
                    </div>
                  );
                }
              })
            ) : (
              <div className="glass-panel" style={{
                padding: '50px 24px',
                textAlign: 'center',
                border: '1px dashed var(--border-color)',
                borderRadius: '16px'
              }}>
                <Sparkles size={36} color="var(--accent-primary)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Your timeline is empty</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
                  Follow other castle explorers or head to the Explore tab to find and rate amazing destinations.
                </p>
                <button className="btn btn-primary" onClick={onNavigateToExplore}>
                  <Compass size={16} />
                  <span>Explore Castles</span>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Columns (Suggestions & Stats) */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* User Stats Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>Explorer Status</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--accent-primary) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>
                  {currentUser.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>{currentUser.username}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Guild Member</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Following: {follows.filter(f => f.followerId === currentUser.id).length}</span>
                <span>Followers: {follows.filter(f => f.followingId === currentUser.id).length}</span>
              </div>
            </div>

            {/* Recommendations Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>Explorers to Follow</h3>
              {recommendedUsers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recommendedUsers.map((user) => (
                    <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyBehavior: 'space-between', justifyContent: 'space-between' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                        onClick={() => onSelectUser(user.id)}
                      >
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }} className="hover-underline">
                          {user.username}
                        </span>
                      </div>
                      <button
                        onClick={() => onFollowToggle(user.id)}
                        className="btn btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '12px' }}
                      >
                        <UserPlus size={12} />
                        <span>Follow</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
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
