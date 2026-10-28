# 🎬 IMovies - Cinema Booking Platform (Full-Stack MERN Capstone)

A full-stack cinema booking application built with **Node.js, Express, React (Vite), and Bootstrap**, featuring a sleek dark aesthetic with deep black background and smooth light ocean blue accents, JWT authentication, real-time seat selection, reservation workflows, and an admin management dashboard.

---

## 🚀 Quick Start Guide

### Prerequisites
Node.js (v18+) is required. If Node.js is already installed on your system PATH, you can use `node` and `npm` directly.

*(Note: A portable Node.js v20.18.0 environment is located at `C:\Users\daksh\Downloads\node-v20.18.0-win-x64\` if you need it).*

---

### Step 1: Start the Backend Server

Open a terminal / PowerShell window:

```powershell
# Optional: if node is not yet in your system PATH
$env:PATH = "C:\Users\daksh\Downloads\node-v20.18.0-win-x64;$env:PATH"

cd "c:\Users\daksh\OneDrive\Desktop\imovies-capstone\server"
npm start
```
> Server runs on: **http://localhost:5000**  
> Health check: **http://localhost:5000/api/health**

---

### Step 2: Start the Frontend Client

Open a second terminal / PowerShell window:

```powershell
# Optional: if node is not yet in your system PATH
$env:PATH = "C:\Users\daksh\Downloads\node-v20.18.0-win-x64;$env:PATH"

cd "c:\Users\daksh\OneDrive\Desktop\imovies-capstone\client"
npm run dev
```
> Client runs on: **http://localhost:5173**

---

## 👥 Demo User Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@imovies.com` | `password123` | Full access: Admin Dashboard, Movie/Show CRUD, All Bookings |
| **User 1** | `john@example.com` | `password123` | Standard booking, pre-loaded with sample bookings |
| **User 2** | `jane@example.com` | `password123` | Standard booking, seat selection, cancellations |

*(You can also click the quick-fill buttons on the Login page or register a new user).*

---

## 🌟 Key Features

1. **Movie Catalog & Discovery**:
   - Filter by genre (*Horror, Mystery, Thriller, Drama, Crime, Sci-Fi, Comedy, Romance, Action, History*).
   - 21 curated cinematic classics with original Letterboxd poster artwork (*Hereditary, The Ritual, The Wailing, The Witch, Enemy, Oldboy, Lost in Translation, Pulse, Eyes Wide Shut, Cure, Lost Highway, Chungking Express, Angel Heart, Blue Velvet, After Hours, The Shining, Three Days of the Condor, The Wicker Man, Solaris, The Devils, Le Samouraï*).
   - Live search by movie title with instant filtering.
   - Comprehensive movie details with director, cast, runtime, synopsis, and year.

2. **Showtimes & Theatres**:
   - Multiple theatres: *Galaxy Cinema Downtown, CityPlex Midtown, StarScreen Uptown*.
   - Date and time slot selection.

3. **Interactive Visual Cinema Seat Selection**:
   - 80 seats per screen (Rows A through H, 10 seats per row) with center aisle layout.
   - Color coded:
     - 🟢 **Green**: Available
     - 🟡 **Yellow**: Selected
     - 🔴 **Red**: Booked (disabled)
   - Real-time price calculation with breakdown and 10% service fee.

4. **Booking & Cancellation**:
   - Modal checkout with price summary and confirmation.
   - Unique alphanumeric booking reference generator.
   - **My Bookings** page displaying active & cancelled tickets with instant cancellation capability (re-frees seats).

5. **Role-Based Security & Admin Panel**:
   - JWT authentication with protected routes.
   - Admin panel with tabs:
     - **Manage Movies**: Add, edit, or delete movies.
     - **Manage Shows**: Schedule shows across theatres and timings.
     - **All Bookings**: System-wide view of all customer bookings and statuses.

---

## 📁 Project Structure

```
imovies-capstone/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Bootstrap navigation bar with role guards
│   │   │   ├── MovieCard.jsx       # Movie poster card with details
│   │   │   ├── SeatLayout.jsx      # Visual 8x10 cinema seat grid
│   │   │   ├── BookingModal.jsx    # Checkout summary modal
│   │   │   └── ProtectedRoute.jsx  # Auth & Admin route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # JWT state & persistent login
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Movie search, genre filters & catalog
│   │   │   ├── MovieDetailPage.jsx # Movie info & available showtimes
│   │   │   ├── BookingPage.jsx     # Interactive seat booking
│   │   │   ├── MyBookingsPage.jsx  # Reservation history & cancellation
│   │   │   ├── LoginPage.jsx       # Login with demo buttons
│   │   │   ├── RegisterPage.jsx    # User signup
│   │   │   └── AdminPage.jsx       # Movie, show & booking management
│   │   ├── App.jsx                 # Routing configuration
│   │   ├── index.css               # Cinema dark theme styling
│   │   └── main.jsx
│   ├── vite.config.js              # Proxy configuration (/api -> localhost:5000)
│   └── package.json
└── server/
    ├── data/
    │   └── mockData.js             # In-memory realistic cinema dataset
    ├── middleware/
    │   ├── auth.js                 # JWT verification & admin guard
    │   └── errorHandler.js         # Centralized error handler
    ├── routes/
    │   ├── auth.js                 # Register, login, get profile
    │   ├── movies.js               # Movies CRUD & search/filter
    │   ├── theatres.js             # Theatre listings
    │   ├── shows.js                # Showtimes scheduling
    │   ├── seats.js                # Seat availability per show
    │   └── bookings.js             # Booking creation & cancellation
    ├── .env
    ├── package.json
    └── server.js                   # Express application entry point
```
