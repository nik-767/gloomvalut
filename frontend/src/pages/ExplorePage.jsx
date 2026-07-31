import React, { useState } from 'react';
import { Search, Plus, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DestinationCard from '../components/destination/DestinationCard';
import { useDestinations } from '../hooks/useDestinations';
import { useAppData } from '../hooks/useAppData';

export default function ExploreView({ onOpenAddModal }) {
  const { destinations } = useDestinations(null);
  const { users, tags } = useAppData();
  const navigate = useNavigate();

  const onSelectDestination = (id) => navigate(`/destination/${id}`);
  const onSelectUser = (id) => navigate(`/profile/${id}`);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagId, setSelectedTagId] = useState(null);

  // Filter logic
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = 
      dest.castle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTag = selectedTagId ? dest.tagIds?.includes(selectedTagId) : true;
    
    return matchesSearch && matchesTag;
  });

  return (
    <div>
      {/* Header Banner */}
      <div>
        <div>
          <Compass size={32} />
        </div>
        <h1>
          Discover Castle Destinations
        </h1>
        <p>
          Browse historic fortresses, spooky ruins, and breathtaking royal chambers. Filter by atmosphere and find your next expedition.
        </p>

        {/* Search & Actions Bar */}
        <div>
          {/* Search Input */}
          <div>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by castle name or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Add Castle Button */}
          <button onClick={onOpenAddModal}>
            <Plus size={18} />
            <span>Add Castle</span>
          </button>
        </div>
      </div>

      {/* Tags Filter Row */}
      <div>
        <button onClick={() => setSelectedTagId(null)}>
          All Castles
        </button>
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => setSelectedTagId(tag.id)}
          >
            #{tag.name}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredDestinations.length > 0 ? (
        <div>
          {filteredDestinations.map(dest => {
            const creator = users.find(u => u.id === dest.posted_by);
            const destTags = tags.filter(t => dest.tagIds?.includes(t.id)) || [];
            
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
        <div>
          <p>
            No castle destinations matched your filters.
          </p>
          <button onClick={() => { setSearchQuery(''); setSelectedTagId(null); }}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
