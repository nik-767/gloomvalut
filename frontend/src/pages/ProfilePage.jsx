import React, { useEffect, useState } from 'react';
import {
  UserPlus,
  UserMinus,
  Compass,
  MessageSquare,
  Star,
  ArrowLeft,
  Calendar,
  Save,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import DestinationCard from '../components/destination/DestinationCard';
import { useDestinations } from '../hooks/useDestinations';
import { useReviews } from '../hooks/useReviews';
import { useFollows } from '../hooks/useFollows';
import { useAppData } from '../hooks/useAppData';

/**
 * Displays a public explorer profile, their posts, reviews, and follow controls.
 */
export default function ProfilePage({ currentUser }) {
  const { id } = useParams();
  const userId = parseInt(id, 10);
  const navigate = useNavigate();

  const { destinations } = useDestinations();
  const { reviews } = useReviews();
  const { follows, handleFollowToggle } = useFollows();
  const { users, profileCache, loadProfile, handleUpdateProfile } = useAppData();

  const [activeTab, setActiveTab] = useState('destinations');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [bioDraft, setBioDraft] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  const cachedProfile = profileCache[userId];
  const user = users.find((item) => item.id === userId);
  const profile = cachedProfile?.profile;
  const isOwnProfile = userId === currentUser?.id;

  useEffect(() => {
    /** Loads profile stats and posts whenever the route user id changes. */
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setProfileError('');

      try {
        await loadProfile(userId);
      } catch (err) {
        setProfileError(err.message || 'Failed to load profile.');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [userId, loadProfile]);

  useEffect(() => {
    if (profile?.bio) {
      setBioDraft(profile.bio);
    }
  }, [profile?.bio]);

  if (loadingProfile) {
    return (
      <div className="gv-page">
        <p className="gv-loading">Reading profile from the vault...</p>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="gv-page">
        <div className="gv-empty gv-card">
          <p>{profileError || 'User not found.'}</p>
          <button className="gv-btn" type="button" onClick={() => navigate('/explore')}>
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const userDestinations = cachedProfile?.userPosts?.length
    ? cachedProfile.userPosts
    : destinations.filter((destination) => destination.posted_by === profile.userId);

  const userReviews = reviews.filter((review) => review.userId === profile.userId);
  const followerCount =
    cachedProfile?.followersCount ??
    follows.filter((follow) => follow.followingId === profile.userId).length;
  const followingCount =
    cachedProfile?.followingCount ??
    follows.filter((follow) => follow.followerId === profile.userId).length;
  const isFollowing =
    cachedProfile?.isFollowing ??
    follows.some(
      (follow) => follow.followerId === currentUser?.id && follow.followingId === profile.userId
    );

  /** Formats an ISO date into a readable joined date string. */
  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  /** Saves the signed-in user's biography through the profile API. */
  const handleSaveBio = async () => {
    setSavingBio(true);

    try {
      await handleUpdateProfile(userId, { bio: bioDraft });
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setSavingBio(false);
    }
  };

  return (
    <div className="gv-page">
      {!isOwnProfile && (
        <button className="gv-btn gv-btn-ghost" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      )}

      <section className="gv-card gv-card-body" style={{ marginTop: '1rem' }}>
        <div className="gv-feed-meta">
          <div className="gv-avatar" style={{ width: '4rem', height: '4rem' }}>
            {profile.username ? profile.username.substring(0, 2).toUpperCase() : '??'}
          </div>

          <div style={{ flex: 1 }}>
            <div className="gv-field-inline" style={{ justifyContent: 'space-between' }}>
              <h1>{profile.username}</h1>
              {!isOwnProfile && (
                <button className="gv-btn" type="button" onClick={() => handleFollowToggle(profile.userId)}>
                  {isFollowing ? (
                    <>
                      <UserMinus size={14} />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="gv-field-inline gv-stat-row">
              <Calendar size={14} />
              <span>Joined {formatDate(profile?.created)}</span>
            </div>

            {isOwnProfile ? (
              <>
                <div className="gv-field" style={{ marginTop: '1rem' }}>
                  <label>Bio</label>
                  <textarea
                    className="gv-textarea"
                    rows={3}
                    value={bioDraft}
                    onChange={(event) => setBioDraft(event.target.value)}
                  />
                </div>
                <button
                  className="gv-btn gv-btn-primary"
                  type="button"
                  onClick={handleSaveBio}
                  disabled={savingBio}
                >
                  <Save size={16} />
                  <span>{savingBio ? 'Saving...' : 'Save Bio'}</span>
                </button>
              </>
            ) : (
              <p style={{ marginTop: '1rem' }}>{profile?.bio || 'No biography provided yet.'}</p>
            )}
          </div>
        </div>

        <div className="gv-stat-grid">
          <div className="gv-stat-box">
            <strong>{userDestinations.length}</strong>
            <span>Castles</span>
          </div>
          <div className="gv-stat-box">
            <strong>{userReviews.length}</strong>
            <span>Reviews</span>
          </div>
          <div className="gv-stat-box">
            <strong>{followerCount}</strong>
            <span>Followers</span>
          </div>
          <div className="gv-stat-box">
            <strong>{followingCount}</strong>
            <span>Following</span>
          </div>
        </div>
      </section>

      <div className="gv-tabs">
        <button
          type="button"
          className={`gv-tab ${activeTab === 'destinations' ? 'active' : ''}`}
          onClick={() => setActiveTab('destinations')}
        >
          <Compass size={16} />
          <span>Destinations Posted</span>
        </button>
        <button
          type="button"
          className={`gv-tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <MessageSquare size={16} />
          <span>Reviews Left</span>
        </button>
      </div>

      {activeTab === 'destinations' ? (
        userDestinations.length > 0 ? (
          <div className="gv-grid-cards">
            {userDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onSelect={() => navigate(`/destination/${destination.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="gv-empty gv-card">No castle destinations posted yet.</div>
        )
      ) : userReviews.length > 0 ? (
        userReviews.map((review) => {
          const castle = destinations.find((destination) => destination.id === review.destinationId);

          return (
            <article
              key={review.id}
              className="gv-card gv-review-item gv-card-clickable"
              onClick={() => castle && navigate(`/destination/${castle.id}`)}
            >
              <div className="gv-review-meta">
                <h3>{castle?.castle || review.destinationName || 'Unknown Castle'}</h3>
                <div className="gv-star-row">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={12}
                      fill={index < review.rating ? 'currentColor' : 'transparent'}
                    />
                  ))}
                </div>
              </div>
              <p>&ldquo;{review.comment}&rdquo;</p>
            </article>
          );
        })
      ) : (
        <div className="gv-empty gv-card">No reviews written yet.</div>
      )}
    </div>
  );
}
