import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import SeatLayout   from '../components/SeatLayout';
import BookingModal from '../components/BookingModal';

/**
 * Seat selection page for a given show.
 * Loads show info + seat map, lets users toggle seats,
 * then opens BookingModal for checkout.
 */
const BookingPage = () => {
  const { showId } = useParams();
  const navigate   = useNavigate();

  const [show,          setShow]          = useState(null);
  const [seats,         setSeats]         = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);   // seat IDs
  const [selectedObjs,  setSelectedObjs]  = useState([]);   // full seat objects
  const [loading,       setLoading]       = useState(true);
  const [showModal,     setShowModal]     = useState(false);

  // Load show details + seat map
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [showRes, seatsRes] = await Promise.all([
          axios.get(`/api/v1/shows/${showId}`),
          axios.get(`/api/v1/seats/${showId}`),
        ]);
        setShow(showRes.data.show);
        setSeats(seatsRes.data.seats ?? []);
      } catch (err) {
        toast.error('Could not load show details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [showId]);

  // Toggle a seat in/out of selection
  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    setSelectedSeats(prev =>
      prev.includes(seat.id)
        ? prev.filter(id => id !== seat.id)
        : [...prev, seat.id]
    );
    setSelectedObjs(prev =>
      prev.find(s => s.id === seat.id)
        ? prev.filter(s => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  // Total price of selected seats
  const totalPrice = selectedObjs.reduce((sum, s) => sum + s.price, 0);

  const handleSuccess = (booking) => {
    setShowModal(false);
    toast.success('Booking confirmed! View your bookings below.');
    navigate('/bookings');
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" style={{ color: '#38bdf8' }} role="status" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container py-5 text-center" style={{ color: '#94a3b8' }}>
        <h3 style={{ color: '#f0f9ff', fontWeight: 700 }}>Show not found.</h3>
        <button className="btn mt-3" style={{ background: '#38bdf8', color: '#041019', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '8px 20px', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)' }} onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    );
  }

  const movieTitle  = show.movieTitle  || show.movie?.title  || '—';
  const theatreName = show.theatreName || show.theatre?.name || '—';

  return (
    <div>
      {/* ── Header ──────────────────────────────────── */}
      <div className="page-header">
        <div className="container">
          <button
            className="btn btn-sm mb-3"
            style={{ background: '#171b26', color: '#94a3b8', border: '1px solid #1e2638', fontWeight: 600, borderRadius: '8px' }}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h2 style={{ color: '#f0f9ff', fontWeight: 900 }}>{movieTitle}</h2>
          <div style={{ color: '#94a3b8', display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px', fontWeight: 500 }}>
            <span>🏛️ {theatreName}</span>
            <span>📅 {show.date}</span>
            <span>🕐 {show.startTime}</span>
            {show.movieLanguage && <span>🌐 {show.movieLanguage}</span>}
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">

          {/* ── Seat map ────────────────────────────────── */}
          <div className="col-12 col-lg-8">
            <h5 style={{ color: '#f0f9ff', marginBottom: '20px', fontWeight: 800 }}>🪑 Select Your Seats</h5>
            {seats.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No seat information available.</p>
            ) : (
              <SeatLayout
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
              />
            )}
          </div>

          {/* ── Summary sidebar ─────────────────────────── */}
          <div className="col-12 col-lg-4">
            <div className="info-card sticky-top" style={{ top: '90px' }}>
              <h5 style={{ color: '#f0f9ff', marginBottom: '20px', fontWeight: 800 }}>Order Summary</h5>

              {selectedObjs.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>Select seats on the map to begin.</p>
              ) : (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    {selectedObjs.map(s => (
                      <div
                        key={s.id}
                        style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '8px', fontWeight: 500 }}
                      >
                        <span>Seat {s.label}</span>
                        <span style={{ fontWeight: 600, color: '#f0f9ff' }}>${s.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <hr style={{ borderColor: '#1e2638' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f0f9ff', fontWeight: 800, fontSize: '1.15rem', marginBottom: '20px' }}>
                    <span>Subtotal</span>
                    <span style={{ color: '#38bdf8' }}>${totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    style={{ width: '100%', background: '#38bdf8', border: 'none', color: '#041019', padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)' }}
                  >
                    Proceed to Checkout →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky bottom bar (mobile) ───────────────── */}
      {selectedObjs.length > 0 && (
        <div
          className="d-lg-none"
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: '#11141c', borderTop: '1px solid rgba(56, 189, 248, 0.18)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.7)',
            padding: '12px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            zIndex: 999,
          }}
        >
          <div>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>{selectedObjs.length} seat(s) selected</span>
            <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.1rem' }}>${totalPrice.toFixed(2)}</div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: '#38bdf8', border: 'none', color: '#041019', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)' }}
          >
            Checkout →
          </button>
        </div>
      )}

      {/* ── Booking modal ────────────────────────────── */}
      {showModal && (
        <BookingModal
          show={show}
          selectedSeats={selectedObjs}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default BookingPage;
