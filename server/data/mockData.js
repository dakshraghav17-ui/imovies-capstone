/**
 * mockData.js
 * Central in-memory "database" for IMovies API.
 * Contains 21 curated cinematic masterpieces with local Letterboxd poster artwork.
 */

const bcrypt = require("bcryptjs");

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Returns a date string (YYYY-MM-DD) offset by `days` from today */
function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

/** Calculates end time string given a start-time string and duration in minutes */
function calcEndTime(startTime, durationMinutes) {
  const [time, meridiem] = startTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const totalMinutes = hours * 60 + minutes + durationMinutes;
  let endHours = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;
  const endMeridiem = endHours >= 12 ? "PM" : "AM";
  if (endHours > 12) endHours -= 12;
  if (endHours === 0) endHours = 12;
  return `${endHours}:${String(endMins).padStart(2, "0")} ${endMeridiem}`;
}

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────
const users = [
  {
    id: "user-001",
    name: "John Doe",
    email: "john@example.com",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "user",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "user-002",
    name: "Jane Smith",
    email: "jane@example.com",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "user",
    createdAt: "2024-02-20T09:30:00Z",
  },
  {
    id: "admin-001",
    name: "Admin User",
    email: "admin@imovies.com",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// ─────────────────────────────────────────────
// MOVIES (21 Letterboxd Favorites)
// ─────────────────────────────────────────────
const movies = [
  {
    id: "movie-001",
    title: "Hereditary",
    year: 2018,
    genre: ["Horror", "Mystery", "Drama"],
    language: "English",
    duration: 127,
    rating: 9.8,
    description:
      "When Ellen, the matriarch of the Graham family, passes away, her daughter's family begins to unravel cryptic and increasingly terrifying secrets about their ancestry. The more they discover, the more they find themselves trying to outrun the sinister fate they seem to have inherited.",
    posterUrl: "/posters/hereditary-2018.jpg",
    releaseDate: "2018-06-08",
    cast: ["Toni Collette", "Alex Wolff", "Milly Shapiro", "Gabriel Byrne"],
    director: "Ari Aster",
    price: 18,
  },
  {
    id: "movie-002",
    title: "The Ritual",
    year: 2017,
    genre: ["Horror", "Mystery"],
    language: "English",
    duration: 94,
    rating: 8.0,
    description:
      "Reuniting after the tragic death of their friend, four college pals set out on a hike through the Scandinavian wilderness. A wrong turn leads them into the mysterious forests of Norse legend, where an ancient evil stalks their every move.",
    posterUrl: "/posters/the-ritual-2017.jpg",
    releaseDate: "2017-10-13",
    cast: ["Rafe Spall", "Arsher Ali", "Robert James-Collier", "Sam Troughton"],
    director: "David Bruckner",
    price: 15,
  },
  {
    id: "movie-003",
    title: "The Wailing",
    year: 2016,
    genre: ["Horror", "Mystery", "Thriller"],
    language: "Korean",
    duration: 156,
    rating: 9.8,
    description:
      "In the quiet mountain village of Gokseong, a mysterious sickness and brutal murders start spreading following the arrival of an enigmatic Japanese stranger. A bumbling police officer is thrust into a waking nightmare to save his possessed daughter.",
    posterUrl: "/posters/the-wailing-2016.jpg",
    releaseDate: "2016-05-12",
    cast: ["Kwak Do-won", "Hwang Jung-min", "Jun Kunimura", "Chun Woo-hee"],
    director: "Na Hong-jin",
    price: 17,
  },
  {
    id: "movie-004",
    title: "The Witch",
    year: 2015,
    genre: ["Horror", "Mystery"],
    language: "English",
    duration: 92,
    rating: 9.6,
    description:
      "New England, 1630: Upon threat of banishment by church elders, a deeply religious family leaves their Puritan settlement and establishes a secluded farmstead on the edge of a vast, desolate wilderness where a malevolent supernatural presence lurks in the shadows.",
    posterUrl: "/posters/the-witch-2015.jpg",
    releaseDate: "2015-01-27",
    cast: ["Anya Taylor-Joy", "Ralph Ineson", "Kate Dickie", "Harvey Scrimshaw"],
    director: "Robert Eggers",
    price: 16,
  },
  {
    id: "movie-005",
    title: "Enemy",
    year: 2013,
    genre: ["Mystery", "Thriller"],
    language: "English",
    duration: 91,
    rating: 9.5,
    description:
      "Adam Bell, a morose college history professor in Toronto, rents a film on a whim and spots an actor who looks identical to him. Driven by obsession, Adam tracks down his exact double, setting off a paranoid psychological chain of events.",
    posterUrl: "/posters/enemy-2013.jpg",
    releaseDate: "2013-09-08",
    cast: ["Jake Gyllenhaal", "Mélanie Laurent", "Sarah Gadon", "Isabella Rossellini"],
    director: "Denis Villeneuve",
    price: 16,
  },
  {
    id: "movie-006",
    title: "Oldboy",
    year: 2003,
    genre: ["Action", "Drama", "Mystery", "Thriller"],
    language: "Korean",
    duration: 120,
    rating: 9.9,
    description:
      "Oh Dae-su is abruptly kidnapped and imprisoned in a nondescript room for fifteen years with only a television for company, never knowing his captor's identity. When he is suddenly released with money and a cell phone, he is given five days to discover the reason for his torment.",
    posterUrl: "/posters/oldboy-2003.jpg",
    releaseDate: "2003-11-21",
    cast: ["Choi Min-sik", "Yoo Ji-tae", "Kang Hye-jung", "Kim Byeong-ok"],
    director: "Park Chan-wook",
    price: 18,
  },
  {
    id: "movie-007",
    title: "Lost in Translation",
    year: 2003,
    genre: ["Drama", "Romance", "Comedy"],
    language: "English",
    duration: 102,
    rating: 9.7,
    description:
      "An aging American movie star named Bob Harris and a conflicted young college graduate named Charlotte cross paths in a luxury Tokyo hotel. United by insomnia and foreign alienation, they form a heartfelt, transcendent bond amidst the neon glow of Japan.",
    posterUrl: "/posters/lost-in-translation-2003.jpg",
    releaseDate: "2003-09-12",
    cast: ["Bill Murray", "Scarlett Johansson", "Giovanni Ribisi", "Anna Faris"],
    director: "Sofia Coppola",
    price: 16,
  },
  {
    id: "movie-008",
    title: "Pulse",
    year: 2001,
    genre: ["Horror", "Sci-Fi", "Mystery"],
    language: "Japanese",
    duration: 119,
    rating: 9.5,
    description:
      "In Tokyo, college students and tech workers begin experiencing bizarre internet pop-ups asking if they want to meet ghosts. As shadowy apparitions manifest through computer screens, people begin disappearing into thin air, leaving behind only black ash stains.",
    posterUrl: "/posters/pulse-2001.jpg",
    releaseDate: "2001-02-10",
    cast: ["Kumiko Aso", "Haruhiko Kato", "Kou Shibasaki", "Masatoshi Matsuo"],
    director: "Kiyoshi Kurosawa",
    price: 15,
  },
  {
    id: "movie-009",
    title: "Eyes Wide Shut",
    year: 1999,
    genre: ["Drama", "Mystery", "Thriller"],
    language: "English",
    duration: 159,
    rating: 9.7,
    description:
      "After his wife Alice confesses to having harbored sexual fantasies about another man, Manhattan physician Dr. Bill Harford embarks on a surreal, nocturnal odyssey through New York City, infiltrating an ultra-exclusive masked secret society.",
    posterUrl: "/posters/eyes-wide-shut-1999.jpg",
    releaseDate: "1999-07-16",
    cast: ["Tom Cruise", "Nicole Kidman", "Sydney Pollack", "Marie Richardson"],
    director: "Stanley Kubrick",
    price: 18,
  },
  {
    id: "movie-010",
    title: "Cure",
    year: 1997,
    genre: ["Crime", "Horror", "Mystery", "Thriller"],
    language: "Japanese",
    duration: 111,
    rating: 9.8,
    description:
      "Detective Takabe investigates a series of gruesome murders in Tokyo, each victim carved with a distinct X on their neck by ordinary perpetrators who have no recollection of committing the crime. The case leads him to a strange, amnesiac vagrant who wields hypnotic influence.",
    posterUrl: "/posters/cure-1997.jpg",
    releaseDate: "1997-11-06",
    cast: ["Koji Yakusho", "Masato Hagiwara", "Tsuyoshi Ujiki", "Anna Nakagawa"],
    director: "Kiyoshi Kurosawa",
    price: 16,
  },
  {
    id: "movie-011",
    title: "Lost Highway",
    year: 1997,
    genre: ["Drama", "Mystery", "Thriller"],
    language: "English",
    duration: 134,
    rating: 9.6,
    description:
      "Jazz saxophonist Fred Madison begins receiving surveillance videotapes of his modern Los Angeles home. Soon after, he is accused of violently murdering his wife Renee, only to undergo an impossible metamorphosis on death row into a young mechanic named Pete Dayton.",
    posterUrl: "/posters/lost-highway-1997.jpg",
    releaseDate: "1997-02-21",
    cast: ["Bill Pullman", "Patricia Arquette", "Balthazar Getty", "Robert Blake"],
    director: "David Lynch",
    price: 16,
  },
  {
    id: "movie-012",
    title: "Chungking Express",
    year: 1994,
    genre: ["Drama", "Romance", "Comedy"],
    language: "Cantonese",
    duration: 102,
    rating: 9.8,
    description:
      "Two melancholic Hong Kong policemen navigate heartbreak and fleeting romantic encounters: one falls for a mysterious blonde-wigged underworld smuggler, while the other catches the attention of a daydreaming snack-bar waitress who secretly revitalizes his apartment.",
    posterUrl: "/posters/chungking-express-1994.jpg",
    releaseDate: "1994-07-14",
    cast: ["Takeshi Kaneshiro", "Brigitte Lin", "Tony Leung Chiu-wai", "Faye Wong"],
    director: "Wong Kar-wai",
    price: 17,
  },
  {
    id: "movie-013",
    title: "Angel Heart",
    year: 1987,
    genre: ["Horror", "Mystery", "Thriller"],
    language: "English",
    duration: 113,
    rating: 9.0,
    description:
      "Down-on-his-luck Brooklyn private eye Harry Angel is hired by the mysterious aristocrat Louis Cyphre to track down a former big-band crooner named Johnny Favorite. His investigation pulls him deep into the voodoo underworld of New Orleans, where everyone he interrogates is viciously slaughtered.",
    posterUrl: "/posters/angel-heart-1987.jpg",
    releaseDate: "1987-03-06",
    cast: ["Mickey Rourke", "Robert De Niro", "Lisa Bonet", "Charlotte Rampling"],
    director: "Alan Parker",
    price: 15,
  },
  {
    id: "movie-014",
    title: "Blue Velvet",
    year: 1986,
    genre: ["Crime", "Drama", "Mystery", "Thriller"],
    language: "English",
    duration: 120,
    rating: 9.0,
    description:
      "Returning home to his idyllic North Carolina suburb, college student Jeffrey Beaumont discovers a severed human ear in an overgrown meadow. His amateur investigation leads him into the dark orbit of a distressed lounge singer and a sadistic sociopath named Frank Booth.",
    posterUrl: "/posters/blue-velvet-1986.jpg",
    releaseDate: "1986-09-19",
    cast: ["Kyle MacLachlan", "Isabella Rossellini", "Dennis Hopper", "Laura Dern"],
    director: "David Lynch",
    price: 16,
  },
  {
    id: "movie-015",
    title: "After Hours",
    year: 1985,
    genre: ["Comedy", "Thriller", "Drama"],
    language: "English",
    duration: 97,
    rating: 9.7,
    description:
      "Mild-mannered Manhattan word processor Paul Hackett travels to SoHo for a late-night date with a woman named Marcy. What follows is an escalating, Kafkaesque black-comedy nightmare as Paul finds himself stranded with no money and pursued by paranoid locals across Lower Manhattan.",
    posterUrl: "/posters/after-hours-1985.jpg",
    releaseDate: "1985-09-13",
    cast: ["Griffin Dunne", "Rosanna Arquette", "Verna Bloom", "Tommy Chong"],
    director: "Martin Scorsese",
    price: 15,
  },
  {
    id: "movie-016",
    title: "The Shining",
    year: 1980,
    genre: ["Horror", "Mystery", "Thriller"],
    language: "English",
    duration: 146,
    rating: 9.9,
    description:
      "Aspiring writer Jack Torrance takes a job as off-season caretaker at the secluded Overlook Hotel in the Colorado Rockies, bringing his wife Wendy and gifted psychic son Danny. As winter storms trap the family, malevolent supernatural forces drive Jack toward homicidal madness.",
    posterUrl: "/posters/the-shining-1980.jpg",
    releaseDate: "1980-05-23",
    cast: ["Jack Nicholson", "Shelley Duvall", "Danny Lloyd", "Scatman Crothers"],
    director: "Stanley Kubrick",
    price: 18,
  },
  {
    id: "movie-017",
    title: "Three Days of the Condor",
    year: 1975,
    genre: ["Mystery", "Thriller"],
    language: "English",
    duration: 117,
    rating: 9.6,
    description:
      "Joe Turner, codenamed 'Condor', is a bookish CIA researcher who steps out for lunch only to return to his clandestine Manhattan office and find all his colleagues dead. Thrust into a deadly game of cat and mouse, he must uncover the conspiracy within his own agency while evading a calculating assassin.",
    posterUrl: "/posters/three-days-of-the-condor-1975.jpg",
    releaseDate: "1975-09-24",
    cast: ["Robert Redford", "Faye Dunaway", "Cliff Robertson", "Max von Sydow"],
    director: "Sydney Pollack",
    price: 15,
  },
  {
    id: "movie-018",
    title: "The Wicker Man",
    year: 1973,
    genre: ["Horror", "Mystery", "Thriller"],
    language: "English",
    duration: 88,
    rating: 7.5,
    description:
      "Devout Christian Police Sergeant Neil Howie travels by seaplane to the remote Hebridean island of Summerisle to investigate the disappearance of a young schoolgirl. He is appalled to discover the insular island community practicing ancient Celtic pagan rituals under the command of Lord Summerisle.",
    posterUrl: "/posters/the-wicker-man-1973.jpg",
    releaseDate: "1973-12-06",
    cast: ["Edward Woodward", "Christopher Lee", "Britt Ekland", "Diane Cilento"],
    director: "Robin Hardy",
    price: 15,
  },
  {
    id: "movie-019",
    title: "Solaris",
    year: 1972,
    genre: ["Drama", "Sci-Fi", "Mystery"],
    language: "Russian",
    duration: 167,
    rating: 9.7,
    description:
      "Psychologist Kris Kelvin is sent to a space station orbiting the distant oceanic planet Solaris to investigate the crew's sudden descent into hallucinations. Upon arrival, he encounters the physical manifestation of his deceased wife Hari, materialized by the sentient oceanic organism below.",
    posterUrl: "/posters/solaris-1972.jpg",
    releaseDate: "1972-03-20",
    cast: ["Donatas Banionis", "Natalya Bondarchuk", "Jüri Järvet", "Vladislav Dvorzhetsky"],
    director: "Andrei Tarkovsky",
    price: 17,
  },
  {
    id: "movie-020",
    title: "The Devils",
    year: 1971,
    genre: ["Drama", "History"],
    language: "English",
    duration: 111,
    rating: 9.0,
    description:
      "In 17th-century France, Father Urbain Grandier defends the fortified city of Loudun from Cardinal Richelieu's royalist centralisation. When Sister Jeanne, the hunchbacked prioress of an Ursuline convent, becomes consumed by erotic obsessions with Grandier, political rivals exploit mass hysteria to orchestrate his trial for witchcraft.",
    posterUrl: "/posters/the-devils-1971.jpg",
    releaseDate: "1971-07-16",
    cast: ["Oliver Reed", "Vanessa Redgrave", "Dudley Sutton", "Max Adrian"],
    director: "Ken Russell",
    price: 16,
  },
  {
    id: "movie-021",
    title: "Le Samouraï",
    year: 1967,
    genre: ["Crime", "Drama", "Thriller"],
    language: "French",
    duration: 105,
    rating: 9.8,
    description:
      "Jef Costello is a solitary, methodical hitman living in a sparse Paris apartment with only a caged bullfinch. After carrying out a contract killing at a bustling nightclub, he is caught between ruthless police investigators and the syndicate employers who double-cross him.",
    posterUrl: "/posters/le-samourai-1967.jpg",
    releaseDate: "1967-10-25",
    cast: ["Alain Delon", "François Périer", "Nathalie Delon", "Cathy Rosier"],
    director: "Jean-Pierre Melville",
    price: 17,
  },
];

// ─────────────────────────────────────────────
// THEATRES
// ─────────────────────────────────────────────
const theatres = [
  {
    id: "theatre-001",
    name: "Galaxy Cinema",
    location: "Downtown",
    address: "123 Main Street, Downtown, NY 10001",
    totalSeats: 80,
    rows: 8,
    seatsPerRow: 10,
  },
  {
    id: "theatre-002",
    name: "CityPlex",
    location: "Midtown",
    address: "456 Broadway Avenue, Midtown, NY 10036",
    totalSeats: 80,
    rows: 8,
    seatsPerRow: 10,
  },
  {
    id: "theatre-003",
    name: "StarScreen",
    location: "Uptown",
    address: "789 Park Road, Uptown, NY 10075",
    totalSeats: 80,
    rows: 8,
    seatsPerRow: 10,
  },
];

// ─────────────────────────────────────────────
// SHOWS
// ─────────────────────────────────────────────
const TIME_SLOTS = [
  { startTime: "11:00 AM", premium: 0 },
  { startTime: "2:15 PM", premium: 0 },
  { startTime: "5:30 PM", premium: 3 },
  { startTime: "8:45 PM", premium: 5 },
  { startTime: "11:15 PM", premium: 4 },
];

const shows = [];
let showCounter = 1;

// Programmatically generate 2-3 shows per movie spread across theatres and the next 7 days
movies.forEach((movie, idx) => {
  const theatreIdx1 = idx % 3;
  const theatreIdx2 = (idx + 1) % 3;
  const theatreIdx3 = (idx + 2) % 3;

  const day1 = idx % 7;
  const day2 = (idx + 2) % 7;
  const day3 = (idx + 4) % 7;

  const slot1 = (idx * 2) % 5;
  const slot2 = (idx * 2 + 1) % 5;
  const slot3 = (idx * 2 + 3) % 5;

  const configs = [
    [theatres[theatreIdx1].id, day1, slot1],
    [theatres[theatreIdx2].id, day2, slot2],
    [theatres[theatreIdx3].id, day3, slot3],
  ];

  configs.forEach(([theatreId, dayOffset, slotIdx]) => {
    const slot = TIME_SLOTS[slotIdx];
    shows.push({
      id: `show-${String(showCounter).padStart(3, "0")}`,
      movieId: movie.id,
      theatreId,
      date: futureDate(dayOffset),
      startTime: slot.startTime,
      endTime: calcEndTime(slot.startTime, movie.duration),
      price: movie.price + slot.premium,
    });
    showCounter++;
  });
});

// ─────────────────────────────────────────────
// SEATS  (80-seat layout per show)
// ─────────────────────────────────────────────
const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEATS_PER_ROW = 10;

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const seatsStore = {}; // { [showId]: Seat[] }

function getSeatsForShow(showId) {
  if (seatsStore[showId]) return seatsStore[showId];

  const rand = seededRandom(
    showId.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  );
  const seats = [];
  let seatIdx = 1;

  ROWS.forEach((row) => {
    for (let num = 1; num <= SEATS_PER_ROW; num++) {
      const isBooked = rand() < 0.22; // ~22% pre-booked
      seats.push({
        id: `${showId}-seat-${String(seatIdx).padStart(3, "0")}`,
        showId,
        row,
        seatNumber: num,
        label: `${row}${num}`,
        isBooked,
        bookingId: null,
        price: shows.find((s) => s.id === showId)?.price || 16,
      });
      seatIdx++;
    }
  });

  seatsStore[showId] = seats;
  return seats;
}

// Pre-generate seats for all shows so bookings can reference them
shows.forEach((s) => getSeatsForShow(s.id));

// ─────────────────────────────────────────────
// BOOKINGS (Pre-seeded bookings for John Doe)
// ─────────────────────────────────────────────
const bookings = [];

function makeSampleBooking(id, userId, showId, seatLabels, ref) {
  const show = shows.find((s) => s.id === showId);
  if (!show) return;

  const showSeats = seatsStore[showId];
  const bookedSeats = showSeats.filter((seat) => seatLabels.includes(seat.label));

  bookedSeats.forEach((seat) => {
    seat.isBooked = true;
    seat.bookingId = id;
  });

  const totalAmount = bookedSeats.reduce((sum, s) => sum + s.price, 0);

  bookings.push({
    id,
    userId,
    showId,
    movieId: show.movieId,
    theatreId: show.theatreId,
    seats: bookedSeats.map(s => ({ id: s.id, label: s.label, price: s.price })),
    totalAmount,
    bookingDate: new Date().toISOString(),
    status: "confirmed",
    bookingReference: ref,
  });
}

// Seed 3 sample bookings for John Doe on Hereditary, Oldboy, and The Shining
makeSampleBooking("booking-001", "user-001", "show-001", ["C4", "C5"], "IMV-HRD7X");
makeSampleBooking("booking-002", "user-001", "show-016", ["E3", "E4"], "IMV-OLD9K");
makeSampleBooking("booking-003", "user-001", "show-046", ["A5", "A6"], "IMV-SHN3R");

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────
module.exports = {
  users,
  movies,
  theatres,
  shows,
  seatsStore,
  getSeatsForShow,
  bookings,
};
