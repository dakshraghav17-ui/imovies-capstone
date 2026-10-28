import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Lists all bookings for the logged-in user.
 * Allows cancellation of confirmed bookings.
 */
const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/bookings/my');
      setBookings(res.data.bookings ?? []);
    } catch (err) {
      toast.error('Failed to load your bookings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axios.patch(`/api/v1/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled.');
      fetchBookings();           // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel booking.');
    }
  };

  // Status badge colours
  const statusStyle = (status) => {
    const map = {
      confirmed: { background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' },
      cancelled:  { background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.3)' },
      pending:    { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' },
    };
    return { ...(map[status] || map.pending), padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 };
  };

  return (
    <div>
      {/* ── Header ──────────────────────────────────── */}
      <div className="page-header">
        <div className="container">
          <h2 style={{ color: '#f0f9ff', fontWeight: 900 }}>🎟️ My Bookings</h2>
          <p style={{ color: '#94a3b8' }}>View and manage your cinema ticket bookings.</p>
        </div>
      </div>

      <div className="container pb-5">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border" style={{ color: '#38bdf8' }} role="status" />
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎟️</div>
            <h4 style={{ color: '#f0f9ff', fontWeight: 700 }}>No bookings yet</h4>
            <p style={{ marginBottom: '24px' }}>Browse movies and book your first ticket!</p>
            <a href="/" style={{ background: '#38bdf8', color: '#041019', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, boxShadow: '0 4px 14px rgba(56, 189, 248, 0.3)' }}>
              Browse Movies
            </a>
          </div>
        ) : (
          <div>
            {bookings.map(booking => {
              const movieTitle  = booking.movieTitle  || booking.show?.movie?.title  || '—';
              const theatreName = booking.theatreName || booking.show?.theatre?.name || '—';
              const showDate    = booking.showDate    || booking.show?.date           || '—';
              const showTime    = booking.showTime    || booking.show?.startTime      || '—';
              const seatLabels  = (booking.seats || []).map(s => s.label).join(', ');
              const isCancelled = booking.status === 'cancelled';

              return (
                <div
                  key={booking.id}
                  className={`booking-card${isCancelled ? ' cancelled' : ''}`}
                >
                  <div className="row align-items-center">

                    {/* ── Left: Details ──────────────────── */}
                    <div className="col-12 col-md-8">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h5 style={{ color: '#f0f9ff', margin: 0, fontWeight: 700 }}>{movieTitle}</h5>
                        <span style={statusStyle(booking.status)}>{booking.status}</span>
                      </div>

                      <div style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '8px', fontWeight: 500 }}>
                        <span>🏛️ {theatreName}</span>
                        <span>📅 {showDate}</span>
                        <span>🕐 {showTime}</span>
                      </div>

                      {seatLabels && (
                        <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '8px' }}>
                          🪑 Seats: <strong style={{ color: '#f0f9ff' }}>{seatLabels}</strong>
                        </div>
                      )}

                      {booking.bookingReference && (
                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                          Ref: <strong style={{ color: '#38bdf8' }}>{booking.bookingReference}</strong>
                        </div>
                      )}
                    </div>

                    {/* ── Right: Amount + cancel ─────────── */}
                    <div className="col-12 col-md-4 mt-3 mt-md-0 text-md-end">
                      {booking.totalAmount != null && (
                        <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.3rem', marginBottom: '12px' }}>
                          ${Number(booking.totalAmount).toFixed(2)}
                        </div>
                      )}

                      {!isCancelled && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="btn btn-sm"
                          style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', borderRadius: '8px', fontWeight: 600 }}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
