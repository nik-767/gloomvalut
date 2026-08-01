import React, { useState } from 'react';
import { X, Globe, Building, Star, Plus, Upload } from 'lucide-react';

/**
 * Modal form for posting a new castle destination to the vault API.
 */
export default function AddDestinationModal({ isOpen, onClose, tags = [], onAddDestination }) {
  const [castleName, setCastleName] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [atmosphere, setAtmosphere] = useState(4.5);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  /** Adds or removes a tag id from the selected tag list. */
  const handleTagToggle = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  /** Validates the form and sends the destination payload to the parent handler. */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!castleName.trim() || !country.trim() || !description.trim()) {
      setError('Please fill in all required fields (Name, Country, Description).');
      return;
    }

    setSubmitting(true);

    try {
      await onAddDestination({
        castle: castleName.trim(),
        country: country.trim(),
        description: description.trim(),
        atmosphere: parseFloat(atmosphere),
        tagIds: selectedTagIds,
        imageFile,
      });

      setCastleName('');
      setCountry('');
      setDescription('');
      setAtmosphere(4.5);
      setSelectedTagIds([]);
      setImageFile(null);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.castle?.[0] ||
          err.message ||
          'Failed to create destination.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gv-modal-overlay" onClick={onClose}>
      <div className="gv-card gv-modal" onClick={(event) => event.stopPropagation()}>
        <div className="gv-modal-header">
          <h2>
            <Building size={20} />
            <span> Add Castle Destination</span>
          </h2>
          <button className="gv-btn gv-btn-ghost" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="gv-modal-body">
          {error && <div className="gv-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="gv-field">
              <label>Castle Name *</label>
              <div className="gv-field-inline gv-searchbar">
                <Building size={16} />
                <input
                  type="text"
                  placeholder="e.g. Neuschwanstein Castle"
                  value={castleName}
                  onChange={(event) => setCastleName(event.target.value)}
                />
              </div>
            </div>

            <div className="gv-field">
              <label>Country *</label>
              <div className="gv-field-inline gv-searchbar">
                <Globe size={16} />
                <input
                  type="text"
                  placeholder="e.g. Germany"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                />
              </div>
            </div>

            <div className="gv-field">
              <label>Description *</label>
              <textarea
                className="gv-textarea"
                placeholder="Describe the castle, history, architecture and surrounding area..."
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="gv-field">
              <div className="gv-field-inline" style={{ justifyContent: 'space-between' }}>
                <span>Atmosphere Rating *</span>
                <strong className="gv-star-row">
                  <Star size={12} /> {atmosphere}
                </strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={atmosphere}
                onChange={(event) => setAtmosphere(parseFloat(event.target.value))}
              />
            </div>

            {tags.length > 0 && (
              <div className="gv-field">
                <label>Castle Tags</label>
                <div className="gv-filter-row">
                  {tags.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        className={`gv-filter-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        #{tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="gv-field">
              <label>Castle Image</label>
              <label className="gv-btn gv-btn-ghost">
                <Upload size={16} />
                <span>{imageFile ? imageFile.name : 'Upload image file'}</span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <div className="gv-modal-footer">
              <button className="gv-btn gv-btn-ghost" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="gv-btn gv-btn-primary" type="submit" disabled={submitting}>
                <Plus size={16} />
                <span>{submitting ? 'Posting...' : 'Post Castle'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
