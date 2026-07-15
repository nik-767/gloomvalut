import React, { useState } from 'react';
import { Search, Plus, Compass } from 'lucide-react';
import DestinationCard from './DestinationCard';

export default function ExploreView({ 
  destinations, 
  users, 
  tags, 
  onSelectDestination, 
  onSelectUser, 
  onOpenAddModal 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagId, setSelectedTagId] = useState(null);

  // Filter logic
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = 
      dest.castle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTag = selectedTagId ? dest.tagIds.includes(selectedTagId) : true;
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '0 16px 60px 16px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '40px',
        marginBottom: '32px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(25, 23, 56, 0.75) 0%, rgba(17, 16, 38, 0.75) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%', color: 'var(--accent-primary)', marginBottom: '16px' }}>
          <Compass size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 800 }}>
          Discover <span className="text-gradient">Castle Destinations</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 24px auto', fontSize: '1rem', lineHeight: '1.6' }}>
          Browse historic fortresses, spooky ruins, and breathtaking royal chambers. Filter by atmosphere and find your next expedition.
        </p>

        {/* Search & Actions Bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '16px',
          maxWidth: '800px',
          margin: '0 auto',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '260px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by castle name or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '48px', height: '48px', borderRadius: '12px' }}
            />
          </div>

          {/* Add Castle Button */}
          <button 
            onClick={onOpenAddModal}
            className="btn btn-primary"
            style={{ height: '48px', borderRadius: '12px', padding: '0 24px', flexShrink: 0 }}
          >
            <Plus size={18} />
            <span>Add Castle</span>
          </button>
        </div>
      </div>

      {/* Tags Filter Row */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexWrap: 'wrap', 
        gap: '8px', 
        marginBottom: '32px' 
      }}>
        <button
          onClick={() => setSelectedTagId(null)}
          className="btn"
          style={{
            padding: '6px 16px',
            fontSize: '0.85rem',
            borderRadius: '20px',
            background: selectedTagId === null ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
            color: selectedTagId === null ? '#fff' : 'var(--text-secondary)',
            border: selectedTagId === null ? 'none' : '1px solid rgba(255,255,255,0.08)'
          }}
        >
          All Castles
        </button>
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => setSelectedTagId(tag.id)}
            className="btn"
            style={{
              padding: '6px 16px',
              fontSize: '0.85rem',
              borderRadius: '20px',
              background: selectedTagId === tag.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              color: selectedTagId === tag.id ? '#fff' : 'var(--text-secondary)',
              border: selectedTagId === tag.id ? 'none' : '1px solid rgba(255,255,255,0.08)'
            }}
          >
            #{tag.name}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredDestinations.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredDestinations.map(dest => {
            const creator = users.find(u => u.id === dest.posted_by);
            const destTags = tags.filter(t => dest.tagIds.includes(t.id));
            
            return (
              <DestinationCard
                key={dest.id}
                destination={dest}
                creator={creator}
                tags={destTags}
                onSelect={() => onSelectDestination(dest.id)}
                onSelectCreator={onSelectUser}
              />
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{
          padding: '60px 24px',
          textAlign: 'center',
          border: '1px dashed var(--border-color)',
          borderRadius: '16px'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px' }}>
            No castle destinations matched your filters.
          </p>
          <button 
            className="btn btn-secondary" 
            onClick={() => { setSearchQuery(''); setSelectedTagId(null); }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
