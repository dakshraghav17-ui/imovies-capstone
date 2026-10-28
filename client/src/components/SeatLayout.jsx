import React from 'react';

/**
 * Interactive visual seat picker.
 *
 * Props:
 *   seats         – array of seat objects from /api/v1/seats/:showId
 *   selectedSeats – array of currently selected seat IDs
 *   onSeatClick   – callback(seat) called when an available seat is clicked
 */
const SeatLayout = ({ seats, selectedSeats, onSeatClick }) => {
  // Group seats by row letter (e.g. 'A', 'B', …)
  const rows = {};
  seats.forEach(seat => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });

  const getSeatClass = (seat) => {
    if (seat.isBooked)                    return 'seat booked';
    if (selectedSeats.includes(seat.id))  return 'seat selected';
    return 'seat available';
  };

  const getTitle = (seat) => {
    if (seat.isBooked)                    return `${seat.label} – Booked`;
    if (selectedSeats.includes(seat.id))  return `${seat.label} – Selected (click to deselect)`;
    return `${seat.label} – Available ($${seat.price})`;
  };

  return (
    <div className="seat-grid-container">
      {/* Screen */}
      <div className="screen-indicator" />
      <div className="screen-label">◀ SCREEN ▶</div>

      {/* Rows */}
      {Object.keys(rows).sort().map(row => (
        <div key={row} className="seat-row">
          <div className="row-label">{row}</div>

          {rows[row]
            .sort((a, b) => a.seatNumber - b.seatNumber)
            .map((seat, idx) => (
              <React.Fragment key={seat.id}>
                {/* Aisle gap after seat index 4 (between col 5 & 6) */}
                {idx === 5 && <div className="seat-aisle" />}
                <div
                  className={getSeatClass(seat)}
                  title={getTitle(seat)}
                  onClick={() => !seat.isBooked && onSeatClick(seat)}
                >
                  {seat.seatNumber}
                </div>
              </React.Fragment>
            ))}

          <div className="row-label">{row}</div>
        </div>
      ))}

      {/* Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#22c55e' }} />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#f59e0b' }} />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#0284c7' }} />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
