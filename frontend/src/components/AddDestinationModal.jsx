import React, { useState } from 'react';
import { X, Globe, Building, Image, Star, Plus } from 'lucide-react';

const IMAGE_PRESETS = [
  { name: 'Gothic Castle', url: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mountain Palace', url: 'https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&w=800&q=80' },
  { name: 'Island Abbey', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80' },
  { name: 'Coastal Ruins', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }
];

export default function AddDestinationModal({ isOpen, onClose, tags = [], onAddDestination }) {
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
    <div>
      <div>
        {/* Header */}
        <div>
          <h2>
            <Building size={20} />
            <span>Add Castle Destination</span>
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div>
          {error && (
            <div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Castle Name */}
            <div>
              <label>
                Castle Name *
              </label>
              <div>
                <Building size={16} />
                <input
                  type="text"
                  placeholder="e.g. Neuschwanstein Castle"
                  value={castleName}
                  onChange={(e) => setCastleName(e.target.value)}
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label>
                Country *
              </label>
              <div>
                <Globe size={16} />
                <input
                  type="text"
                  placeholder="e.g. Germany"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label>
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
              <div>
                <span>Atmosphere Rating *</span>
                <strong>
                  <Star size={12} /> {atmosphere}
                </strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={atmosphere}
                onChange={(e) => setAtmosphere(parseFloat(e.target.value))}
              />
            </div>

            {/* Select Tags */}
            <div>
              <label>
                Castle Tags (Select multiple)
              </label>
              <div>
                {tags.map(tag => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {isSelected ? '[x] ' : '[ ] '}#{tag.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Choose Image Preset */}
            <div>
              <label>
                Castle Visual Theme
              </label>
              <div>
                {IMAGE_PRESETS.map((preset) => {
                  const isSelected = selectedImageUrl === preset.url;
                  return (
                    <div
                      key={preset.name}
                      onClick={() => setSelectedImageUrl(preset.url)}
                    >
                      <img src={preset.url} alt={preset.name} />
                      <div>
                        {isSelected ? '=> ' : ''}{preset.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Bar */}
            <div>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit">
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
