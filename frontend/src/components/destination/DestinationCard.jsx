import React from 'react';
import { Star, MapPin, User } from 'lucide-react';

export default function DestinationCard({ destination, creator, tags = [], onSelect, onSelectCreator }) {
  // Truncate description for card preview
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div onClick={onSelect}>
      {/* Castle Image */}
      <div>
        <img 
          src={destination.imageUrl || 'https://images.unsplash.com/photo-1599875953199-198967929424?auto=format&fit=crop&w=800&q=80'} 
          alt={destination.castle} 
        />
        
        {/* Rating Badge */}
        <div>
          <div>
            <Star size={14} />
            <span>{destination.atmosphere?.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div>
        {/* Castle Name and Country */}
        <div>
          <h3>
            {destination.castle}
          </h3>
          <div>
            <MapPin size={12} />
            <span>{destination.country}</span>
          </div>
        </div>

        {/* Tags */}
        <div>
          {tags.map(tag => (
            <span key={tag.id}>
              #{tag.name}
            </span>
          ))}
        </div>

        {/* Description */}
        <p>
          {truncateText(destination.description, 120)}
        </p>

        {/* Poster Info (Footer) */}
        {creator && (
          <div 
            onClick={(e) => {
              e.stopPropagation(); // Avoid triggering card click
              onSelectCreator?.(creator.id);
            }}
          >
            <div>
              {creator.username.substring(0, 2).toUpperCase()}
            </div>
            <span>Posted by <strong>{creator.username}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
