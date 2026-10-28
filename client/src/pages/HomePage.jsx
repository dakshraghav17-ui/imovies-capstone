import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const GENRES = ['All', 'Horror', 'Mystery', 'Thriller', 'Drama', 'Crime', 'Sci-Fi', 'Comedy', 'Romance', 'Action', 'History'];

/**
 * Home page – hero section + searchable / filterable movie grid.
 */
const HomePage = () => {
  const [movies,       setMovies]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [total,        setTotal]        = useState(0);

  // Fetch movies whenever filters / page change
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search)               params.search = search;
      if (selectedGenre !== 'All') params.genre  = selectedGenre;

      const res = await axios.get('/api/v1/movies', { params });
      setMovies(res.data.movies      ?? []);
      setTotalPages(res.data.totalPages ?? 1);
      setTotal(res.data.total        ?? 0);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedGenre, page]);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleGenre = (genre) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────── */}
      <div className="page-header" style={{ textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ color: '#38bdf8', fontWeight: 900, fontSize: '3rem', marginBottom: '8px', textShadow: '0 0 25px rgba(56, 189, 248, 0.35)' }}>
            🎬 IMovies
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '24px' }}>
            Book your cinema experience — browse movies, pick your seats, enjoy the show!
          </p>

          {/* Search bar */}
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              className="form-control search-bar"
              placeholder="🔍 Search movies by title…"
              value={search}
              onChange={handleSearch}
              style={{ fontSize: '1rem', padding: '12px 20px' }}
            />
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="container pb-5">

        {/* Genre filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => handleGenre(genre)}
              className="btn btn-sm"
              style={{
                background:   selectedGenre === genre ? '#38bdf8' : '#171b26',
                color:        selectedGenre === genre ? '#041019' : '#94a3b8',
                border:       selectedGenre === genre ? '1px solid #38bdf8' : '1px solid #1e2638',
                borderRadius: '20px',
                padding:      '6px 16px',
                fontWeight:   selectedGenre === genre ? 700 : 500,
                transition:   'all 0.2s',
                boxShadow:    selectedGenre === genre ? '0 4px 14px rgba(56, 189, 248, 0.3)' : 'none',
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
            Showing {movies.length} of {total} movies
            {selectedGenre !== 'All' ? ` in "${selectedGenre}"` : ''}
            {search ? ` matching "${search}"` : ''}
          </p>
        )}

        {/* Movie grid */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border" style={{ color: '#38bdf8' }} role="status">
              <span className="visually-hidden">Loading…</span>
            </div>
          </div>
        ) : movies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎬</div>
            <h4 style={{ color: '#f0f9ff', fontWeight: 700 }}>No movies found</h4>
            <p>Try adjusting your search or genre filter.</p>
          </div>
        ) : (
          <div className="row g-4">
            {movies.map(movie => (
              <div key={movie.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width:        '40px',
                  height:       '40px',
                  borderRadius: '8px',
                  background:   page === p ? '#38bdf8' : '#171b26',
                  color:        page === p ? '#041019' : '#94a3b8',
                  border:       page === p ? '1px solid #38bdf8' : '1px solid #1e2638',
                  cursor:       'pointer',
                  fontWeight:   page === p ? 700 : 500,
                  boxShadow:    page === p ? '0 4px 12px rgba(56, 189, 248, 0.25)' : 'none',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
