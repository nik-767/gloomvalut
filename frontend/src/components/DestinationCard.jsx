import React from 'react';
import { Star, MapPin, User } from 'lucide-react';

export default function DestinationCard({ destination, creator, tags = [], onSelect, onSelectCreator }) {
  // Truncate description for card preview
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div 
      className="glass-panel animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
      onClick={onSelect}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.25)';
        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
      }}
    >
      {/* Castle Image */}
      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
        <img 
          src={destination.imageUrl || 'https://images.unsplash.com/photo-1599875953199-198967929424?auto=format&fit=crop&w=800&q=80'} 
          alt={destination.castle} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="card-image"
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        
        {/* Rating Badge */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 5 }}>
          <div className="rating-chip">
            <Star size={14} fill="currentColor" />
            <span>{destination.atmosphere.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Castle Name and Country */}
        <div style={{ marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.01em' }}>
            {destination.castle}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <MapPin size={12} />
            <span>{destination.country}</span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {tags.map(tag => (
            <span key={tag.id} className="tag-badge">
              #{tag.name}
            </span>
          ))}
        </div>

        {/* Description */}
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px', flexGrow: 1 }}>
          {truncateText(destination.description, 120)}
        </p>

        {/* Poster Info (Footer) */}
        {creator && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.06)', 
              paddingTop: '12px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}
            onClick={(e) => {
              e.stopPropagation(); // Avoid triggering card click
              onSelectCreator(creator.id);
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--accent-primary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}>
              {creator.username.substring(0, 2).toUpperCase()}
            </div>
            <span>Posted by <strong style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} className="hover-underline">{creator.username}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
