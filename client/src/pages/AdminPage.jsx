import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

/* ──────────────────────────────────────────────────────
   Admin Dashboard
   Tabs: Movies | Shows | All Bookings
   ────────────────────────────────────────────────────── */

const TABS = ['Movies', 'Shows', 'All Bookings'];

// Default empty movie form state
const emptyMovie = {
  title: '', description: '', genre: '', language: '',
  duration: '', rating: '', director: '', cast: '', posterUrl: '',
};

const AdminPage = () => {
  const [activeTab,    setActiveTab]    = useState('Movies');

  // Movies state
  const [movies,       setMovies]       = useState([]);
  const [loadingMov,   setLoadingMov]   = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);  // null = add new
  const [movieForm,    setMovieForm]    = useState(emptyMovie);
  const [saving,       setSaving]       = useState(false);

  // Shows state
  const [shows,        setShows]        = useState([]);
  const [loadingShows, setLoadingShows] = useState(true);

  // Bookings state
  const [bookings,     setBookings]     = useState([]);
  const [loadingBook,  setLoadingBook]  = useState(true);

  // ── Fetch all movies ──────────────────────────────────
  const fetchMovies = async () => {
    setLoadingMov(true);
    try {
      const res = await axios.get('/api/v1/movies', { params: { limit: 100 } });
      setMovies(res.data.movies ?? []);
    } catch { toast.error('Failed to load movies.'); }
    finally { setLoadingMov(false); }
  };

  // ── Fetch all shows ───────────────────────────────────
  const fetchShows = async () => {
    setLoadingShows(true);
    try {
      const res = await axios.get('/api/v1/shows');
      setShows(res.data.shows ?? []);
    } catch { toast.error('Failed to load shows.'); }
    finally { setLoadingShows(false); }
  };

  // ── Fetch all bookings (admin) ────────────────────────
  const fetchBookings = async () => {
    setLoadingBook(true);
    try {
      const res = await axios.get('/api/v1/bookings');
      setBookings(res.data.bookings ?? []);
    } catch { toast.error('Failed to load bookings.'); }
    finally { setLoadingBook(false); }
  };

  useEffect(() => {
    fetchMovies();
    fetchShows();
    fetchBookings();
  }, []);

  // ── Open add form ─────────────────────────────────────
  const openAdd = () => {
    setEditingMovie(null);
    setMovieForm(emptyMovie);
    setShowForm(true);
  };

  // ── Open edit form ────────────────────────────────────
  const openEdit = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title:       movie.title       ?? '',
      description: movie.description ?? '',
      genre:       (movie.genre || []).join(', '),
      language:    movie.language    ?? '',
      duration:    movie.duration    ?? '',
      rating:      movie.rating      ?? '',
      director:    movie.director    ?? '',
      cast:        (movie.cast  || []).join(', '),
      posterUrl:   movie.posterUrl   ?? '',
    });
    setShowForm(true);
  };

  // ── Save movie (add or update) ────────────────────────
  const handleSaveMovie = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...movieForm,
        genre:    movieForm.genre.split(',').map(s => s.trim()).filter(Boolean),
        cast:     movieForm.cast.split(',').map(s => s.trim()).filter(Boolean),
        duration: Number(movieForm.duration),
        rating:   Number(movieForm.rating),
      };

      if (editingMovie) {
        await axios.put(`/api/v1/movies/${editingMovie.id}`, payload);
        toast.success('Movie updated.');
      } else {
        await axios.post('/api/v1/movies', payload);
        toast.success('Movie added.');
      }

      setShowForm(false);
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete movie ──────────────────────────────────────
  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await axios.delete(`/api/v1/movies/${id}`);
      toast.success('Movie deleted.');
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  // ── Form field helper ─────────────────────────────────
  const field = (label, key, type = 'text', placeholder = '') => (
    <div className="mb-3" key={key}>
      <label style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '4px', display: 'block', fontWeight: 600 }}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          className="form-control search-bar"
          rows={3}
          placeholder={placeholder}
          value={movieForm[key]}
          onChange={e => setMovieForm(p => ({ ...p, [key]: e.target.value }))}
        />
      ) : (
        <input
          type={type}
          className="form-control search-bar"
          placeholder={placeholder}
          value={movieForm[key]}
          onChange={e => setMovieForm(p => ({ ...p, [key]: e.target.value }))}
        />
      )}
    </div>
  );

  // ── Status badge ──────────────────────────────────────
  const badge = (status) => {
    const colors = {
      confirmed: '#4ade80', cancelled: '#94a3b8', pending: '#fbbf24',
    };
    return (
      <span style={{ color: colors[status] || '#94a3b8', fontWeight: 700, fontSize: '0.8rem' }}>
        {status}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h2 style={{ color: '#f0f9ff', fontWeight: 900 }}>⚙️ Admin Dashboard</h2>
          <p style={{ color: '#94a3b8' }}>Manage movies, shows, and bookings.</p>
        </div>
      </div>

      <div className="container pb-5">

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', borderBottom: '1px solid rgba(56, 189, 248, 0.18)', paddingBottom: '0' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background:   'none',
                border:       'none',
                color:        activeTab === tab ? '#38bdf8' : '#94a3b8',
                fontWeight:   activeTab === tab ? 700 : 500,
                fontSize:     '1rem',
                padding:      '10px 20px',
                cursor:       'pointer',
                borderBottom: activeTab === tab ? '3px solid #38bdf8' : '3px solid transparent',
                transition:   'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── MOVIES TAB ─────────────────────────────────── */}
        {activeTab === 'Movies' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h5 style={{ color: '#f0f9ff', margin: 0, fontWeight: 700 }}>All Movies ({movies.length})</h5>
              <button
                onClick={openAdd}
                style={{ background: '#38bdf8', border: 'none', color: '#041019', padding: '8px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)' }}
              >
                + Add Movie
              </button>
            </div>

            {loadingMov ? (
              <div className="loading-spinner"><div className="spinner-border" style={{ color: '#38bdf8' }} role="status" /></div>
            ) : (
              <div className="table-responsive info-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.2)', color: '#94a3b8', fontSize: '0.85rem', background: '#171b26' }}>
                      {['Title', 'Genre', 'Language', 'Duration', 'Rating', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.1)', color: '#cbd5e1' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#f0f9ff' }}>{m.title}</td>
                        <td style={{ padding: '14px' }}>{(m.genre || []).join(', ')}</td>
                        <td style={{ padding: '14px' }}>{m.language}</td>
                        <td style={{ padding: '14px' }}>{m.duration} min</td>
                        <td style={{ padding: '14px', color: '#fbbf24', fontWeight: 600 }}>⭐ {m.rating}</td>
                        <td style={{ padding: '14px' }}>
                          <button
                            onClick={() => openEdit(m)}
                            style={{ background: '#171b26', border: '1px solid #1e2638', color: '#94a3b8', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontSize: '0.85rem', fontWeight: 600 }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMovie(m.id)}
                            style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#38bdf8', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── SHOWS TAB ──────────────────────────────────── */}
        {activeTab === 'Shows' && (
          <div>
            <h5 style={{ color: '#f0f9ff', marginBottom: '20px', fontWeight: 700 }}>All Shows ({shows.length})</h5>

            {loadingShows ? (
              <div className="loading-spinner"><div className="spinner-border" style={{ color: '#38bdf8' }} role="status" /></div>
            ) : (
              <div className="table-responsive info-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.2)', color: '#94a3b8', fontSize: '0.85rem', background: '#171b26' }}>
                      {['Movie', 'Theatre', 'Date', 'Time', 'Price', 'Seats Left'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {shows.map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.1)', color: '#cbd5e1' }}>
                        <td style={{ padding: '14px', color: '#f0f9ff', fontWeight: 700 }}>
                          {s.movieTitle || s.movie?.title || '—'}
                        </td>
                        <td style={{ padding: '14px' }}>{s.theatreName || s.theatre?.name || '—'}</td>
                        <td style={{ padding: '14px' }}>{s.date}</td>
                        <td style={{ padding: '14px' }}>{s.startTime}</td>
                        <td style={{ padding: '14px', fontWeight: 600 }}>${s.ticketPrice ?? '—'}</td>
                        <td style={{ padding: '14px', color: '#22c55e', fontWeight: 700 }}>
                          {s.availableSeats ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ALL BOOKINGS TAB ───────────────────────────── */}
        {activeTab === 'All Bookings' && (
          <div>
            <h5 style={{ color: '#f0f9ff', marginBottom: '20px', fontWeight: 700 }}>All Bookings ({bookings.length})</h5>

            {loadingBook ? (
              <div className="loading-spinner"><div className="spinner-border" style={{ color: '#38bdf8' }} role="status" /></div>
            ) : (
              <div className="table-responsive info-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.2)', color: '#94a3b8', fontSize: '0.85rem', background: '#171b26' }}>
                      {['Ref', 'User', 'Movie', 'Theatre', 'Date', 'Seats', 'Total', 'Status'].map(h => (
                        <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.1)', color: '#cbd5e1' }}>
                        <td style={{ padding: '14px', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>
                          {b.bookingReference ?? b.id}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 600 }}>{b.userName || b.user?.name || '—'}</td>
                        <td style={{ padding: '14px', color: '#f0f9ff', fontWeight: 700 }}>
                          {b.movieTitle || b.show?.movie?.title || '—'}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {b.theatreName || b.show?.theatre?.name || '—'}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {b.showDate || b.show?.date || '—'}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {(b.seats || []).map(s => s.label).join(', ') || '—'}
                        </td>
                        <td style={{ padding: '14px', color: '#38bdf8', fontWeight: 800 }}>
                          ${Number(b.totalAmount ?? 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '14px' }}>{badge(b.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Movie Add/Edit Modal ─────────────────────────── */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1050, padding: '20px', overflowY: 'auto',
        }}>
          <div style={{
            background: '#11141c', borderRadius: '16px', padding: '32px',
            maxWidth: '560px', width: '100%', border: '1px solid rgba(56, 189, 248, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h5 style={{ color: '#f0f9ff', margin: 0, fontWeight: 800 }}>
                {editingMovie ? '✏️ Edit Movie' : '➕ Add New Movie'}
              </h5>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
              >✕</button>
            </div>

            <form onSubmit={handleSaveMovie}>
              {field('Title *',       'title',       'text',     'e.g. Inception')}
              {field('Description',   'description', 'textarea', 'Movie synopsis…')}
              {field('Genre (comma-separated)', 'genre', 'text', 'e.g. Action, Sci-Fi')}
              {field('Language',      'language',    'text',     'e.g. English')}
              {field('Duration (min)','duration',    'number',   '148')}
              {field('Rating (0–10)', 'rating',      'number',   '8.5')}
              {field('Director',      'director',    'text',     'Christopher Nolan')}
              {field('Cast (comma-separated)', 'cast', 'text',  'Leonardo DiCaprio, …')}
              {field('Poster URL',    'posterUrl',   'url',      'https://…')}

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ flex: 1, background: '#171b26', border: '1px solid #1e2638', color: '#94a3b8', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ flex: 2, background: '#38bdf8', border: 'none', color: '#041019', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)' }}
                >
                  {saving ? '⏳ Saving…' : editingMovie ? 'Update Movie' : 'Add Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
