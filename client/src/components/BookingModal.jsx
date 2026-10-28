import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Checkout modal shown after seat selection.
 *
 * Props:
 *   show          – show object (includes movie + theatre info)
 *   selectedSeats – array of seat objects the user chose
 *   onClose       – fn to dismiss the modal
 *   onSuccess     – fn(booking) called on a confirmed booking
 */
const BookingModal = ({ show, selectedSeats, onClose, onSuccess }) => {
  const [confirming, setConfirming] = useState(false);
  const { user }  = useAuth();
  const navigate  = useNavigate();

  // Price calculations
  const subtotal    = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const serviceFee  = parseFloat((subtotal * 0.1).toFixed(2));
  const grandTotal  = parseFloat((subtotal + serviceFee).toFixed(2));

  const handleConfirm = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    setConfirming(true);
    try {
      const res = await axios.post('/api/v1/bookings', {
        showId:  show.id,
        seatIds: selectedSeats.map(s => s.id),
      });
      toast.success(`Booking confirmed! Ref: ${res.data.booking.bookingReference}`);
      onSuccess(res.data.booking);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  // ── helpers to read show info regardless of data shape
  const movieTitle   = show.movieTitle   || show.movie?.title   || '—';
  const theatreName  = show.theatreName  || show.theatre?.name  || '—';
  const movieLang    = show.movieLanguage || show.movie?.language || '—';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1050, padding: '20px',
    }}>
      <div style={{
        background: '#11141c', borderRadius: '16px',
        padding: '32px', maxWidth: '500px', width: '100%',
        border: '1px solid rgba(56, 189, 248, 0.18)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h5 style={{ color: '#f0f9ff', margin: 0, fontWeight: 800 }}>🎟️ Booking Summary</h5>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
          >✕</button>
        </div>

        {/* Movie info */}
        <div style={{ background: '#171b26', borderRadius: '12px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
          <h6 style={{ color: '#38bdf8', fontWeight: 800, marginBottom: '8px' }}>{movieTitle}</h6>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <div>🏛️ {theatreName}</div>
            <div>📅 {show.date} at {show.startTime}</div>
            <div>🎭 {movieLang}</div>
          </div>
        </div>

        {/* Selected seats */}
        <div style={{ marginBottom: '20px' }}>
          <h6 style={{ color: '#f0f9ff', marginBottom: '12px', fontWeight: 700 }}>
            Selected Seats ({selectedSeats.length})
          </h6>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedSeats.map(seat => (
              <span
                key={seat.id}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '4px 12px', borderRadius: '20px',
                  fontSize: '0.85rem', fontWeight: 700,
                }}
              >
                {seat.label}
              </span>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div style={{ background: '#171b26', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
          <h6 style={{ color: '#f0f9ff', marginBottom: '12px', fontWeight: 700 }}>Price Breakdown</h6>

          {selectedSeats.map(seat => (
            <div
              key={seat.id}
              style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '6px' }}
            >
              <span>Seat {seat.label}</span>
              <span style={{ fontWeight: 600, color: '#f0f9ff' }}>${seat.price.toFixed(2)}</span>
            </div>
          ))}

          <hr style={{ borderColor: '#1e2638', margin: '12px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '4px', fontSize: '0.9rem' }}>
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span>Service Fee (10%)</span><span>${serviceFee.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f0f9ff', fontWeight: 800, fontSize: '1.15rem' }}>
            <span>Total</span>
            <span style={{ color: '#38bdf8' }}>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, background: '#171b26', border: '1px solid #1e2638', color: '#94a3b8', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirming}
            style={{ flex: 2, background: '#38bdf8', border: 'none', color: '#041019', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)' }}
          >
            {confirming ? '⏳ Confirming…' : '✓ Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
