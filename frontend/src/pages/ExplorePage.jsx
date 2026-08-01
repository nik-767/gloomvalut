import React, { useState } from 'react';
import { Search, Plus, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DestinationCard from '../components/destination/DestinationCard';
import { useDestinations } from '../hooks/useDestinations';
import { useAppData } from '../hooks/useAppData';

/**
 * Browse, search, and filter all castle destinations in the vault.
 */
export default function ExplorePage({ onOpenAddModal }) {
  const { destinations, loading, error } = useDestinations();
  const { users, tags } = useAppData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagId, setSelectedTagId] = useState(null);

  const onSelectDestination = (id) => navigate(`/destination/${id}`);
  const onSelectUser = (id) => navigate(`/profile/${id}`);

  /** Applies search text and selected tag filters to the destination list. */
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      !searchQuery ||
      dest.castle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTagId || dest.tagIds?.includes(selectedTagId);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="gv-page">
      <section className="gv-card gv-hero">
        <div className="gv-hero-icon">
          <Compass size={32} />
        </div>
        <h1>Discover Castle Destinations</h1>
        <p>
          Browse historic fortresses, spooky ruins, and breathtaking royal chambers.
          Filter by atmosphere and find your next expedition.
        </p>

        <div className="gv-toolbar">
          <div className="gv-searchbar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by castle name or country..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <button className="gv-btn gv-btn-primary" onClick={onOpenAddModal} type="button">
            <Plus size={18} />
            <span>Add Castle</span>
          </button>
        </div>
      </section>

      {tags.length > 0 && (
        <div className="gv-filter-row">
          <button
            type="button"
            className={`gv-filter-btn ${selectedTagId === null ? 'active' : ''}`}
            onClick={() => setSelectedTagId(null)}
          >
            All Castles
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`gv-filter-btn ${selectedTagId === tag.id ? 'active' : ''}`}
              onClick={() => setSelectedTagId(tag.id)}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="gv-loading">Loading destinations...</p>}
      {error && <div className="gv-alert">{error}</div>}

      {filteredDestinations.length > 0 ? (
        <div className="gv-grid-cards">
          {filteredDestinations.map((dest) => {
            const creator = users.find((user) => user.id === dest.posted_by);
            const destTags = dest.tags?.length ? dest.tags : tags.filter((tag) => dest.tagIds?.includes(tag.id));

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
        !loading && (
          <div className="gv-empty gv-card">
            <p>No castle destinations matched your filters.</p>
            <button
              className="gv-btn"
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTagId(null);
              }}
            >
              Reset Filters
            </button>
          </div>
        )
      )}
    </div>
  );
}
