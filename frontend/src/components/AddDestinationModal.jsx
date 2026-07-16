import React, { useState } from 'react';
import { X, Globe, Building, Image, Star, Plus } from 'lucide-react';

const IMAGE_PRESETS = [
  { name: 'Gothic Castle', url: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mountain Palace', url: 'https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&w=800&q=80' },
  { name: 'Island Abbey', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80' },
  { name: 'Coastal Ruins', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }
];

export default function AddDestinationModal({ isOpen, onClose, tags, onAddDestination }) {
  const [castleName, setCastleName] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [atmosphere, setAtmosphere] = useState(4.5);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(IMAGE_PRESETS[0].url);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTagToggle = (tagId) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!castleName.trim() || !country.trim() || !description.trim()) {
      setError('Please fill in all required fields (Name, Country, Description).');
      return;
    }

    onAddDestination({
      castle: castleName.trim(),
      country: country.trim(),
      description: description.trim(),
      atmosphere: parseFloat(atmosphere),
      tagIds: selectedTagIds,
      imageUrl: selectedImageUrl
    });

    // Reset Form
    setCastleName('');
    setCountry('');
    setDescription('');
    setAtmosphere(4.5);
    setSelectedTagIds([]);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 4, 10, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="glass-panel animate-fade-in" 
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 50px rgba(0,0,0,0.6)',
          position: 'relative'
        }}
      >
        {/* Sticky Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'var(--bg-secondary)',
          padding: '24px 30px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} className="text-gradient" />
            <span>Add Castle Destination</span>
          </h2>
          <button 
            onClick={onClose} 
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '30px' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--danger)',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Castle Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                Castle Name *
              </label>
              <div style={{ position: 'relative' }}>
                <Building size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. Neuschwanstein Castle"
                  value={castleName}
                  onChange={(e) => setCastleName(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                Country *
              </label>
              <div style={{ position: 'relative' }}>
                <Globe size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. Germany"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                Description *
              </label>
              <textarea
                placeholder="Describe the castle, history, architecture and surrounding area..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Atmosphere Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                <span>Atmosphere Rating *</span>
                <strong style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Star size={12} fill="currentColor" /> {atmosphere}
                </strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={atmosphere}
                onChange={(e) => setAtmosphere(parseFloat(e.target.value))}
                style={{ cursor: 'pointer', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px' }}
              />
            </div>

            {/* Select Tags */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 500 }}>
                Castle Tags (Select multiple)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tags.map(tag => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.04)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.08)',
                        transition: 'all 0.2s'
                      }}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Choose Image Preset */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 500 }}>
                Castle Visual Theme
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {IMAGE_PRESETS.map((preset) => {
                  const isSelected = selectedImageUrl === preset.url;
                  return (
                    <div
                      key={preset.name}
                      onClick={() => setSelectedImageUrl(preset.url)}
                      style={{
                        position: 'relative',
                        height: '70px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid var(--accent-primary)' : '2px solid transparent',
                        boxShadow: isSelected ? '0 0 10px rgba(139,92,246,0.3)' : 'none'
                      }}
                    >
                      <img src={preset.url} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}>
                        {preset.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Bar */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end', 
              marginTop: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '20px'
            }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Plus size={16} />
                <span>Post Castle</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
