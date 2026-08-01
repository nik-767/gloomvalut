import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  MessageSquare,
  MapPin,
  Send,
  Trash2,
  Pencil,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDestinations } from '../hooks/useDestinations';
import { useReviews } from '../hooks/useReviews';
import { useAppData } from '../hooks/useAppData';

/**
 * Shows one castle, its reviews, and owner actions such as edit or delete.
 */
export default function DestinationDetailPage({ currentUser }) {
  const { id } = useParams();
  const destinationId = parseInt(id, 10);
  const navigate = useNavigate();

  const { destinations, updateDestination, deleteDestination } = useDestinations();
  const { reviews, handleAddReview, handleDeleteReview } = useReviews();
  const { users } = useAppData();

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [formError, setFormError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [actionError, setActionError] = useState('');

  const destination = destinations.find((item) => item.id === destinationId);

  if (!destination) {
    return (
      <div className="gv-page">
        <div className="gv-empty gv-card">
          <p>Castle not found.</p>
          <button className="gv-btn" type="button" onClick={() => navigate('/explore')}>
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const creator = users.find((user) => user.id === destination.posted_by);
  const destinationReviews = reviews.filter((review) => review.destinationId === destination.id);
  const averageRating =
    destinationReviews.length > 0
      ? (
          destinationReviews.reduce((sum, review) => sum + review.rating, 0) /
          destinationReviews.length
        ).toFixed(1)
      : destination.atmosphere?.toFixed(1);

  const isOwner = destination.posted_by === currentUser?.id;
  const formState = editForm ?? destination;

  /** Persists a new review through the shared reviews hook. */
  const handleSubmitReview = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!comment.trim()) {
      setFormError('Please write a comment for your review.');
      return;
    }

    setSubmittingReview(true);

    try {
      await handleAddReview(destination.id, {
        comment: comment.trim(),
        rating: parseInt(rating, 10),
      });
      setComment('');
      setRating(5);
    } catch (err) {
      setFormError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          'Failed to post review.'
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  /** Saves edited castle fields for the current owner. */
  const handleSaveEdit = async () => {
    setActionError('');

    try {
      await updateDestination(destination.id, {
        castle: formState.castle,
        country: formState.country,
        description: formState.description,
        atmosphere: formState.atmosphere,
        tagIds: formState.tagIds,
      });
      setEditing(false);
      setEditForm(null);
    } catch (err) {
      setActionError(err.message || 'Failed to update destination.');
    }
  };

  /** Deletes the castle and returns the user to Explore. */
  const handleDelete = async () => {
    if (!window.confirm('Delete this castle permanently?')) {
      return;
    }

    try {
      await deleteDestination(destination.id);
      navigate('/explore');
    } catch (err) {
      setActionError(err.message || 'Failed to delete destination.');
    }
  };

  return (
    <div className="gv-page">
      <button className="gv-btn gv-btn-ghost" type="button" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        <span>Back to browse</span>
      </button>

      <section className="gv-card gv-detail-hero" style={{ marginTop: '1rem' }}>
        <div className="gv-detail-banner">
          <img src={destination.imageUrl} alt={destination.castle} />
          <div className="gv-detail-overlay">
            <div className="gv-tag-row">
              {destination.tags?.map((tag) => (
                <span key={tag.id} className="gv-tag">
                  #{tag.name}
                </span>
              ))}
            </div>
            <h1>{destination.castle}</h1>
            <div className="gv-field-inline">
              <MapPin size={16} />
              <span>{destination.country}</span>
              <span className="gv-star-row">
                <Star size={14} />
                {averageRating} ({destinationReviews.length} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="gv-detail-body">
          {actionError && <div className="gv-alert">{actionError}</div>}

          {editing ? (
            <>
              <div className="gv-field">
                <label>Castle Name</label>
                <input
                  className="gv-input"
                  value={formState.castle}
                  onChange={(event) =>
                    setEditForm({ ...formState, castle: event.target.value })
                  }
                />
              </div>
              <div className="gv-field">
                <label>Country</label>
                <input
                  className="gv-input"
                  value={formState.country}
                  onChange={(event) =>
                    setEditForm({ ...formState, country: event.target.value })
                  }
                />
              </div>
              <div className="gv-field">
                <label>Description</label>
                <textarea
                  className="gv-textarea"
                  rows={4}
                  value={formState.description}
                  onChange={(event) =>
                    setEditForm({ ...formState, description: event.target.value })
                  }
                />
              </div>
              <div className="gv-actions-row">
                <button className="gv-btn gv-btn-primary" type="button" onClick={handleSaveEdit}>
                  Save Changes
                </button>
                <button
                  className="gv-btn gv-btn-ghost"
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setEditForm(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>About the Castle</h2>
              <p>{destination.description}</p>
            </>
          )}

          {creator && (
            <div className="gv-creator-bar">
              <div className="gv-field-inline">
                <div className="gv-avatar">
                  {creator.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="gv-stat-row">Posted By</div>
                  <strong
                    className="gv-link"
                    onClick={() => navigate(`/profile/${creator.id}`)}
                  >
                    {creator.username}
                  </strong>
                </div>
              </div>
              <button
                className="gv-btn"
                type="button"
                onClick={() => navigate(`/profile/${creator.id}`)}
              >
                View Profile
              </button>
            </div>
          )}

          {isOwner && !editing && (
            <div className="gv-actions-row">
              <button
                className="gv-btn"
                type="button"
                onClick={() => {
                  setEditing(true);
                  setEditForm(destination);
                }}
              >
                <Pencil size={16} />
                <span>Edit Castle</span>
              </button>
              <button className="gv-btn gv-btn-danger" type="button" onClick={handleDelete}>
                <Trash2 size={16} />
                <span>Delete Castle</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="gv-card gv-card-body" style={{ marginTop: '1.5rem' }}>
        <h3 className="gv-star-row">
          <Star size={20} />
          <span>Leave a Review</span>
        </h3>

        {formError && <div className="gv-alert">{formError}</div>}

        <form onSubmit={handleSubmitReview}>
          <div className="gv-field">
            <span>Atmosphere Rating</span>
            <div className="gv-star-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`gv-star-btn ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  <Star size={24} fill={star <= rating ? 'currentColor' : 'transparent'} />
                </button>
              ))}
            </div>
          </div>

          <div className="gv-field">
            <label>Your Experience</label>
            <textarea
              className="gv-textarea"
              placeholder="Share details of your visit. How was the atmosphere, preservation, or the spooky vibes?"
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>

          <button className="gv-btn gv-btn-primary" type="submit" disabled={submittingReview}>
            <Send size={16} />
            <span>{submittingReview ? 'Posting...' : 'Post Review'}</span>
          </button>
        </form>
      </section>

      <section className="gv-card gv-card-body" style={{ marginTop: '1.5rem' }}>
        <h3 className="gv-star-row">
          <MessageSquare size={20} />
          <span>Castle Reviews ({destinationReviews.length})</span>
        </h3>

        {destinationReviews.length > 0 ? (
          destinationReviews.map((review) => {
            const reviewer = users.find((user) => user.id === review.userId);

            return (
              <article key={review.id} className="gv-review-item gv-card" style={{ marginTop: '1rem' }}>
                <div className="gv-review-meta" style={{ justifyContent: 'space-between' }}>
                  <div
                    className="gv-field-inline gv-link"
                    onClick={() => reviewer && navigate(`/profile/${reviewer.id}`)}
                  >
                    <div className="gv-avatar">
                      {reviewer ? reviewer.username.substring(0, 2).toUpperCase() : '??'}
                    </div>
                    <span>{reviewer?.username || review.username || 'Unknown User'}</span>
                  </div>

                  <div className="gv-field-inline">
                    <div className="gv-star-row">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={12}
                          fill={index < review.rating ? 'currentColor' : 'transparent'}
                        />
                      ))}
                    </div>
                    {review.userId === currentUser?.id && (
                      <button
                        className="gv-btn gv-btn-danger"
                        type="button"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <p>{review.comment}</p>
              </article>
            );
          })
        ) : (
          <p className="gv-stat-row">No reviews yet. Be the first to share your thoughts.</p>
        )}
      </section>
    </div>
  );
}
