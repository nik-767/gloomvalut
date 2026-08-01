import React, { useMemo } from 'react';
import { Star, MessageSquare, Compass, UserPlus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDestinations } from '../hooks/useDestinations';
import { useReviews } from '../hooks/useReviews';
import { useFollows } from '../hooks/useFollows';
import { useAppData } from '../hooks/useAppData';

/**
 * Shows activity from followed explorers plus follow recommendations.
 */
export default function FeedPage({ currentUser }) {
  const { destinations } = useDestinations();
  const { reviews } = useReviews();
  const { follows, handleFollowToggle } = useFollows();
  const { users, feedDestinations } = useAppData();
  const navigate = useNavigate();

  const followedUserIds = follows
    .filter((follow) => follow.followerId === currentUser?.id)
    .map((follow) => follow.followingId);

  /** Combines feed destinations and followed-user reviews into one timeline. */
  const feedItems = useMemo(() => {
    const destinationItems = (feedDestinations.length ? feedDestinations : destinations
      .filter((destination) => followedUserIds.includes(destination.posted_by)))
      .map((destination) => ({
        ...destination,
        type: 'destination',
      }));

    const reviewItems = reviews
      .filter((review) => followedUserIds.includes(review.userId))
      .map((review) => ({
        ...review,
        type: 'review',
      }));

    return [...destinationItems, ...reviewItems];
  }, [destinations, feedDestinations, followedUserIds, reviews]);

  const recommendedUsers = users.filter(
    (user) => user.id !== currentUser?.id && !followedUserIds.includes(user.id)
  );

  return (
    <div className="gv-page">
      <div className="gv-grid-2">
        <section>
          <div className="gv-page-header">
            <h2>Your Castle Timeline</h2>
            <p>Chronicles from explorers you follow across the vault.</p>
          </div>

          {feedItems.length > 0 ? (
            feedItems.map((item, index) => {
              if (item.type === 'destination') {
                const creator = users.find((user) => user.id === item.posted_by);

                return (
                  <article key={`dest-${item.id}-${index}`} className="gv-card gv-feed-item">
                    <div className="gv-feed-meta">
                      <div className="gv-avatar">
                        {creator?.username?.substring(0, 2).toUpperCase() || '??'}
                      </div>
                      <div>
                        <span className="gv-link" onClick={() => creator && navigate(`/profile/${creator.id}`)}>
                          {creator?.username || 'Unknown Explorer'}
                        </span>
                        <span> posted a new castle destination</span>
                      </div>
                    </div>

                    <div
                      className="gv-feed-preview"
                      onClick={() => navigate(`/destination/${item.id}`)}
                    >
                      <img src={item.imageUrl} alt={item.castle} />
                      <div>
                        <h3>{item.castle}</h3>
                        <span>{item.country}</span>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </article>
                );
              }

              const reviewer = users.find((user) => user.id === item.userId);
              const destination = destinations.find((dest) => dest.id === item.destinationId);

              return (
                <article key={`rev-${item.id}-${index}`} className="gv-card gv-feed-item">
                  <div className="gv-feed-meta">
                    <div className="gv-avatar">
                      {reviewer?.username?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <div>
                      <span className="gv-link" onClick={() => reviewer && navigate(`/profile/${reviewer.id}`)}>
                        {reviewer?.username || 'Unknown Explorer'}
                      </span>
                      <span> reviewed </span>
                      <strong
                        className="gv-link"
                        onClick={() => destination && navigate(`/destination/${destination.id}`)}
                      >
                        {destination?.castle || item.destinationName}
                      </strong>
                    </div>
                  </div>

                  <div className="gv-star-row">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={12}
                        fill={starIndex < item.rating ? 'currentColor' : 'transparent'}
                      />
                    ))}
                  </div>

                  <p>&ldquo;{item.comment}&rdquo;</p>
                </article>
              );
            })
          ) : (
            <div className="gv-empty gv-card">
              <Sparkles size={36} style={{ margin: '0 auto 1rem', color: 'var(--gv-gold)' }} />
              <h3>Your timeline is empty</h3>
              <p>
                Follow other castle explorers or head to Explore to find and rate amazing destinations.
              </p>
              <button className="gv-btn gv-btn-primary" type="button" onClick={() => navigate('/explore')}>
                <Compass size={16} />
                <span>Explore Castles</span>
              </button>
            </div>
          )}
        </section>

        <aside>
          <div className="gv-card gv-sidebar-card">
            <h3>Explorer Status</h3>
            <div className="gv-feed-meta">
              <div className="gv-avatar">
                {currentUser?.username?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <strong>{currentUser?.username}</strong>
                <div className="gv-stat-row">Guild Member</div>
              </div>
            </div>
            <div className="gv-stat-row">
              <span>
                Following: {follows.filter((follow) => follow.followerId === currentUser?.id).length}
              </span>
              <span>
                Followers: {follows.filter((follow) => follow.followingId === currentUser?.id).length}
              </span>
            </div>
          </div>

          <div className="gv-card gv-sidebar-card">
            <h3>Explorers to Follow</h3>
            {recommendedUsers.length > 0 ? (
              recommendedUsers.map((user) => (
                <div key={user.id} className="gv-feed-meta" style={{ justifyContent: 'space-between' }}>
                  <div
                    className="gv-field-inline gv-link"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <div className="gv-avatar">{user.username.substring(0, 2).toUpperCase()}</div>
                    <span>{user.username}</span>
                  </div>
                  <button className="gv-btn" type="button" onClick={() => handleFollowToggle(user.id)}>
                    <UserPlus size={12} />
                    <span>Follow</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="gv-stat-row">You are following everyone in the vault.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
