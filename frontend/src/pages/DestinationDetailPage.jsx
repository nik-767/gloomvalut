import React, { useState } from 'react';
import { ArrowLeft, Star, MessageSquare, MapPin, User, Send } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDestinations } from '../hooks/useDestinations';
import { useReviews } from '../hooks/useReviews';
import { useAppData } from '../hooks/useAppData';

export default function DestinationDetail({ currentUser }) {
  const { id } = useParams();
  const destinationId = parseInt(id);
  const navigate = useNavigate();

  const { destinations } = useDestinations(currentUser);
  const { reviews, handleAddReview } = useReviews();
  const { users, tags } = useAppData();

  const onBack = () => navigate(-1);
  const onSelectUser = (userId) => navigate(`/profile/${userId}`);
  const onAddReview = handleAddReview;
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [formError, setFormError] = useState('');

  const dest = destinations.find(d => d.id === destinationId);
  if (!dest) return <div>Castle not found.</div>;

  const creator = users.find(u => u.id === dest.posted_by);
  const destTags = tags.filter(t => dest.tagIds?.includes(t.id)) || [];
  const destReviews = reviews.filter(r => r.destinationId === dest.id) || [];

  // Calculate average rating
  const avgRating = destReviews.length > 0
    ? (destReviews.reduce((sum, r) => sum + r.rating, 0) / destReviews.length).toFixed(1)
    : dest.atmosphere?.toFixed(1);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setFormError('');

    if (!comment.trim()) {
      setFormError('Please write a comment for your review.');
      return;
    }

    onAddReview({
      destinationId: dest.id,
      userId: currentUser?.id,
      comment: comment.trim(),
      rating: parseInt(rating)
    });

    setComment('');
    setRating(5);
  };

  return (
    <div>
      {/* Back Button */}
      <button onClick={onBack}>
        <ArrowLeft size={16} />
        <span>Back to browse</span>
      </button>

      {/* Main Details Panel */}
      <div>
        {/* Banner Image */}
        <div>
          <img 
            src={dest.imageUrl || 'https://images.unsplash.com/photo-1599875953199-198967929424?auto=format&fit=crop&w=1200&q=80'} 
            alt={dest.castle} 
          />
          <div>
            <div>
              {destTags.map(tag => (
                <span key={tag.id}>
                  #{tag.name}
                </span>
              ))}
            </div>
            <h1>
              {dest.castle}
            </h1>
            <div>
              <div>
                <MapPin size={16} />
                <span>{dest.country}</span>
              </div>
              <div>
                <Star size={14} />
                <span>{avgRating} ({destReviews.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div>
          <h2>About the Castle</h2>
          <p>
            {dest.description}
          </p>

          {/* Creator Bar */}
          {creator && (
            <div>
              <div>
                <div>
                  {creator.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div>Posted By</div>
                  <strong onClick={() => onSelectUser?.(creator.id)}>
                    {creator.username}
                  </strong>
                </div>
              </div>
              <button onClick={() => onSelectUser?.(creator.id)}>
                View Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        {/* Write a Review */}
        <div>
          <h3>
            <Star size={20} />
            <span>Leave a Review</span>
          </h3>

          {formError && (
            <div>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmitReview}>
            {/* Rating Selector */}
            <div>
              <span>
                Atmosphere Rating
              </span>
              <div>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                  >
                    <Star size={24} fill={star <= rating ? 'currentColor' : 'transparent'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label>
                Your Experience
              </label>
              <textarea
                placeholder="Share details of your visit. How was the atmosphere, the preservation, or the spooky vibes?"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button type="submit">
              <Send size={16} />
              <span>Post Review</span>
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div>
          <h3>
            <MessageSquare size={20} />
            <span>Castle Reviews ({destReviews.length})</span>
          </h3>

          {destReviews.length > 0 ? (
            <div>
              {destReviews.map((rev) => {
                const reviewer = users.find(u => u.id === rev.userId);
                return (
                  <div key={rev.id}>
                    <div>
                      <div onClick={() => reviewer && onSelectUser?.(reviewer.id)}>
                        <div>
                          {reviewer ? reviewer.username.substring(0, 2).toUpperCase() : '??'}
                        </div>
                        <span>
                          {reviewer ? reviewer.username : 'Unknown User'}
                        </span>
                      </div>
                      <div>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            fill={i < rev.rating ? 'currentColor' : 'transparent'} 
                          />
                        ))}
                      </div>
                    </div>
                    <p>
                      {rev.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>
              No reviews yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
