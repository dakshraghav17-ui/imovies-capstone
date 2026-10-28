import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Shows full movie info + available showtimes grouped by date/theatre.
 * Clicking a showtime navigates to /booking/:showId.
 */
const MovieDetailPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [movie,        setMovie]        = useState(null);
  const [shows,        setShows]        = useState([]);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingShows, setLoadingShows] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch movie details
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/api/v1/movies/${id}`);
        setMovie(res.data.movie);
      } catch {
        setMovie(null);
      } finally {
        setLoadingMovie(false);
      }
    };
    fetch();
  }, [id]);

  // Fetch showtimes for this movie
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/v1/shows', { params: { movieId: id } });
        const list = res.data.shows ?? [];
        setShows(list);
        if (list.length > 0) setSelectedDate(list[0].date);
      } catch {
        setShows([]);
      } finally {
        setLoadingShows(false);
      }
    };
    fetch();
  }, [id]);

  // Unique dates from shows
  const dates = [...new Set(shows.map(s => s.date))].sort();

  // Shows for the selected date, grouped by theatre
  const showsForDate = shows.filter(s => s.date === selectedDate);
  const byTheatre = showsForDate.reduce((acc, s) => {
    const key = s.theatreName || s.theatre?.name || 'Unknown Theatre';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  if (loadingMovie) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" style={{ color: '#38bdf8' }} role="status" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center" style={{ color: '#94a3b8' }}>
        <h3 style={{ color: '#f0f9ff', fontWeight: 700 }}>Movie not found.</h3>
        <button className="btn mt-3" style={{ background: '#38bdf8', color: '#041019', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '8px 20px', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)' }} onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ── Page header ─────────────────────────────── */}
      <div className="page-header">
        <div className="container">
          <button
            className="btn btn-sm mb-3"
            style={{ background: '#171b26', color: '#94a3b8', border: '1px solid #1e2638', fontWeight: 600, borderRadius: '8px' }}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">

          {/* ── Left: Poster ──────────────────────────── */}
          <div className="col-12 col-md-4 col-lg-3">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{ width: '100%', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.2)', boxShadow: '0 8px 25px rgba(0,0,0,0.6)' }}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${movie.id}/300/450`; }}
            />
          </div>

          {/* ── Right: Info ───────────────────────────── */}
          <div className="col-12 col-md-8 col-lg-9">
            <h1 style={{ color: '#f0f9ff', fontWeight: 900, marginBottom: '8px' }}>{movie.title}</h1>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', color: '#94a3b8', fontWeight: 500 }}>
              <span>⭐ <strong style={{ color: '#fbbf24' }}>{movie.rating}/10</strong></span>
              <span>⏱ {movie.duration} min</span>
              <span>🌐 {movie.language}</span>
              {movie.releaseDate && <span>📅 {new Date(movie.releaseDate).getFullYear()}</span>}
            </div>

            {/* Genres */}
            <div style={{ marginBottom: '16px' }}>
              {(movie.genre || []).map(g => (
                <span key={g} className="genre-badge">{g}</span>
              ))}
            </div>

            {/* Description */}
            {movie.description && (
              <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: '16px' }}>{movie.description}</p>
            )}

            {/* Director / Cast */}
            {movie.director && (
              <p style={{ color: '#94a3b8', marginBottom: '8px' }}>
                <strong style={{ color: '#f0f9ff' }}>Director:</strong> {movie.director}
              </p>
            )}
            {movie.cast && movie.cast.length > 0 && (
              <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
                <strong style={{ color: '#f0f9ff' }}>Cast:</strong> {movie.cast.join(', ')}
              </p>
            )}

            {/* ── Showtimes ─────────────────────────────── */}
            <div className="info-card">
              <h5 style={{ color: '#f0f9ff', marginBottom: '16px', fontWeight: 800 }}>🎞️ Available Showtimes</h5>

              {loadingShows ? (
                <div className="loading-spinner" style={{ minHeight: '80px' }}>
                  <div className="spinner-border" style={{ color: '#38bdf8' }} role="status" />
                </div>
              ) : dates.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>No shows available for this movie.</p>
              ) : (
                <>
                  {/* Date tabs */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {dates.map(date => (
                      <button
                        key={date}
                        className={`showtime-btn${selectedDate === date ? ' active' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        📅 {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </button>
                    ))}
                  </div>

                  {/* Theatre groups */}
                  {Object.entries(byTheatre).map(([theatre, theatreShows]) => (
                    <div key={theatre} style={{ marginBottom: '16px' }}>
                      <h6 style={{ color: '#38bdf8', marginBottom: '10px', fontWeight: 700 }}>🏛️ {theatre}</h6>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {theatreShows
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map(show => (
                            <button
                              key={show.id}
                              className="showtime-btn"
                              onClick={() => navigate(`/booking/${show.id}`)}
                            >
                              🕐 {show.startTime}
                              {show.availableSeats != null && (
                                <span style={{ color: '#22c55e', marginLeft: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                                  ({show.availableSeats} left)
                                </span>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
