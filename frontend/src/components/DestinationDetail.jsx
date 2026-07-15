import React, { useState } from 'react';
import { ArrowLeft, Star, MessageSquare, MapPin, User, Send } from 'lucide-react';

export default function DestinationDetail({ 
  destinationId, 
  destinations, 
  users, 
  tags, 
  reviews, 
  currentUser, 
  onAddReview, 
  onBack, 
  onSelectUser 
}) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [formError, setFormError] = useState('');

  const dest = destinations.find(d => d.id === destinationId);
  if (!dest) return <div style={{ padding: '40px', textAlign: 'center' }}>Castle not found.</div>;

  const creator = users.find(u => u.id === dest.posted_by);
  const destTags = tags.filter(t => dest.tagIds.includes(t.id));
  const destReviews = reviews.filter(r => r.destinationId === dest.id);

  // Calculate average rating
  const avgRating = destReviews.length > 0
    ? (destReviews.reduce((sum, r) => sum + r.rating, 0) / destReviews.length).toFixed(1)
    : dest.atmosphere.toFixed(1);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setFormError('');

    if (!comment.trim()) {
      setFormError('Please write a comment for your review.');
      return;
    }

    onAddReview({
      destinationId: dest.id,
      userId: currentUser.id,
      comment: comment.trim(),
      rating: parseInt(rating)
    });

    setComment('');
    setRating(5);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 16px 60px 16px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="btn btn-secondary" 
        style={{ marginBottom: '24px', padding: '8px 16px', borderRadius: '8px' }}
      >
        <ArrowLeft size={16} />
        <span>Back to browse</span>
      </button>

      {/* Main Details Panel */}
      <div className="glass-panel" style={{ overflow: 'hidden', marginBottom: '32px' }}>
        {/* Banner Image */}
        <div style={{ width: '100%', height: '350px', position: 'relative', backgroundColor: 'var(--bg-tertiary)' }}>
          <img 
            src={dest.imageUrl || 'https://images.unsplash.com/photo-1599875953199-198967929424?auto=format&fit=crop&w=1200&q=80'} 
            alt={dest.castle} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(10, 9, 21, 0.95) 0%, rgba(10, 9, 21, 0) 100%)',
            padding: '30px',
            paddingTop: '60px'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {destTags.map(tag => (
                <span key={tag.id} className="tag-badge" style={{ background: 'rgba(139, 92, 246, 0.25)', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#fff' }}>
                  #{tag.name}
                </span>
              ))}
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {dest.castle}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <MapPin size={16} />
                <span>{dest.country}</span>
              </div>
              <div className="rating-chip">
                <Star size={14} fill="currentColor" />
                <span>{avgRating} ({destReviews.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: 700 }}>About the Castle</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
            {dest.description}
          </p>

          {/* Creator Bar */}
          {creator && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.03)', 
              padding: '16px 20px', 
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}>
                  {creator.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted By</div>
                  <strong 
                    style={{ color: 'var(--text-primary)', cursor: 'pointer' }}
                    onClick={() => onSelectUser(creator.id)}
                    className="hover-underline"
                  >
                    {creator.username}
                  </strong>
                </div>
              </div>
              <button 
                onClick={() => onSelectUser(creator.id)}
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                View Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        {/* Write a Review */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} className="text-gradient" />
            <span>Leave a Review</span>
          </h3>

          {formError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmitReview}>
            {/* Rating Selector */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                Atmosphere Rating
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: star <= rating ? 'var(--warning)' : 'var(--text-muted)',
                      padding: '4px',
                      transition: 'transform 0.1s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Star size={24} fill={star <= rating ? 'currentColor' : 'transparent'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                Your Experience
              </label>
              <textarea
                placeholder="Share details of your visit. How was the atmosphere, the preservation, or the spooky vibes?"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
              <Send size={16} />
              <span>Post Review</span>
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} className="text-gradient" />
            <span>Castle Reviews ({destReviews.length})</span>
          </h3>

          {destReviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {destReviews.map((rev) => {
                const reviewer = users.find(u => u.id === rev.userId);
                return (
                  <div 
                    key={rev.id} 
                    style={{ 
                      paddingBottom: '20px', 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => onSelectUser(reviewer.id)}>
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
                          {reviewer ? reviewer.username.substring(0, 2).toUpperCase() : '??'}
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }} className="hover-underline">
                          {reviewer ? reviewer.username : 'Unknown User'}
                        </span>
                      </div>
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
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', paddingLeft: '36px' }}>
                      {rev.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0' }}>
              No reviews yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
