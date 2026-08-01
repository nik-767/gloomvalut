import React from 'react';
import { Star, MapPin, User } from 'lucide-react';

/**
 * Renders a compact castle card used on Explore and Profile pages.
 */
export default function DestinationCard({ destination, creator, tags = [], onSelect, onSelectCreator }) {
  const truncateText = (text, maxLength) => {
    if (!text) {
      return '';
    }

    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <article className="gv-card gv-card-clickable" onClick={onSelect}>
      <div className="gv-card-image-wrap">
        <img src={destination.imageUrl} alt={destination.castle} />
        <div className="gv-badge">
          <Star size={14} />
          <span>{destination.atmosphere?.toFixed(1)}</span>
        </div>
      </div>

      <div className="gv-card-body">
        <h3>{destination.castle}</h3>
        <div className="gv-field-inline" style={{ color: 'var(--gv-muted)' }}>
          <MapPin size={12} />
          <span>{destination.country}</span>
        </div>

        {tags.length > 0 && (
          <div className="gv-tag-row">
            {tags.map((tag) => (
              <span key={tag.id} className="gv-tag">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <p>{truncateText(destination.description, 120)}</p>

        {creator && (
          <div
            className="gv-field-inline gv-link"
            onClick={(event) => {
              event.stopPropagation();
              onSelectCreator?.(creator.id);
            }}
          >
            <div className="gv-avatar">{creator.username.substring(0, 2).toUpperCase()}</div>
            <span>
              Posted by <strong>{creator.username}</strong>
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
