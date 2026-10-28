import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable movie card displayed in the browsing grid.
 * Navigates to the movie detail page on click.
 */
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const goToDetail = () => navigate(`/movies/${movie.id}`);

  return (
    <div className="movie-card" onClick={goToDetail}>
      {/* Poster image with fallback */}
      <img
        src={movie.posterUrl}
        alt={movie.title}
        onError={(e) => {
          e.target.src = `https://picsum.photos/seed/${movie.id}/300/450`;
        }}
      />

      <div className="movie-card-body">
        {/* Title */}
        <h6 style={{ color: '#f0f9ff', fontWeight: 700, marginBottom: '8px' }}>
          {movie.title}
        </h6>

        {/* Genre badges (max 2) */}
        <div style={{ marginBottom: '8px' }}>
          {(movie.genre || []).slice(0, 2).map(g => (
            <span key={g} className="genre-badge">{g}</span>
          ))}
        </div>

        {/* Rating + Duration */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: 600 }}>
            ⭐ {movie.rating}/10
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>
            ⏱ {movie.duration} min
          </span>
        </div>

        {/* Language */}
        <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px', fontWeight: 500 }}>
          {movie.language}
        </div>

        {/* CTA */}
        <button
          className="btn btn-sm w-100 mt-3"
          style={{ background: '#38bdf8', color: '#041019', border: 'none', borderRadius: '8px', fontWeight: 700, boxShadow: '0 2px 10px rgba(56, 189, 248, 0.25)' }}
          onClick={(e) => { e.stopPropagation(); goToDetail(); }}
        >
          Book Now →
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
