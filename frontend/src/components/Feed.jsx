import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeed, deleteCastle, toggleFollow } from '../api/api';
import { useAuth } from '../context/AuthContext';

const statusLabel = (count) => {
  if (count > 0) return `${count} followers`;
  return 'No followers yet';
};

export default function Feed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [castles, setCastles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getFeed();
        setCastles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, []);

  const handleDelete = async (castleId) => {
    setRefreshing(true);
    setError('');

    try {
      await deleteCastle(castleId);
      setCastles((current) => current.filter((castle) => castle.id !== castleId));
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFollowToggle = async (creatorId) => {
    setRefreshing(true);
    setError('');

    try {
      await toggleFollow(creatorId);
      setCastles((current) => [...current]);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400/80">Vault feed</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Recent castles from followed explorers</h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Explore the latest castle stories, follow new creators, and manage your own posts directly from the feed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="rounded-full border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-sky-500 hover:text-sky-300"
            >
              Explore castles
            </button>
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Add castle
            </button>
          </div>
        </header>

        {loading ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-300">
            Loading feed...
          </section>
        ) : error ? (
          <section className="rounded-3xl border border-rose-700/60 bg-rose-950/80 p-8 text-center text-rose-200">
            <p className="text-lg font-semibold">Unable to load feed</p>
            <p className="mt-2 text-sm text-rose-300">{error}</p>
          </section>
        ) : castles.length === 0 ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-300">
            <p className="text-xl font-semibold text-white">No castles found</p>
            <p className="mt-3 max-w-xl mx-auto text-sm text-slate-400">
              Follow other explorers to populate your feed, or add a new castle to start the adventure.
            </p>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-2">
            {castles.map((castle) => {
              const isOwner = castle.posted_by === user?.id;
              const creatorName = castle.posted_by_username || 'Unknown Explorer';
              const imageUrl = castle.image || castle.imageUrl || '/static/core/images/placeholder.jpg';

              return (
                <article
                  key={castle.id}
                  className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-slate-950/20"
                >
                  <div className="relative overflow-hidden bg-slate-800">
                    <img
                      src={imageUrl}
                      alt={castle.castle}
                      className="h-72 w-full object-cover transition duration-300 hover:scale-[1.02]"
                      onError={(event) => {
                        event.currentTarget.src = '/static/core/images/placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent px-5 py-4 text-white">
                      <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">{castle.country || 'Unknown region'}</p>
                      <h2 className="mt-2 text-2xl font-semibold">{castle.castle}</h2>
                    </div>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-400">By</p>
                        <button
                          type="button"
                          onClick={() => navigate(`/profile/${castle.posted_by}`)}
                          className="text-base font-semibold text-white transition hover:text-sky-300"
                        >
                          {creatorName}
                        </button>
                      </div>
                      <div className="rounded-full bg-slate-950 px-4 py-2 text-xs uppercase tracking-[0.25em] text-sky-300">
                        {castle.tags?.length ? `${castle.tags.length} tags` : 'No tags'}
                      </div>
                    </div>

                    <p className="text-sm leading-7 text-slate-300">{castle.description}</p>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-slate-950 px-3 py-2 text-xs uppercase tracking-[0.25em] text-sky-400/90">
                        Atmosphere {castle.atmosphere ?? '—'}
                      </span>
                      <span className="rounded-full bg-slate-950 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                        {statusLabel(castle.tags?.length || 0)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/destination/${castle.id}`)}
                        className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
                      >
                        View details
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFollowToggle(castle.posted_by)}
                        className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-500 hover:text-sky-300"
                      >
                        Follow / Unfollow
                      </button>

                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDelete(castle.id)}
                          className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                          disabled={refreshing}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
