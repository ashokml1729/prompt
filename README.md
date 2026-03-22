# ⌨️ Prompt — Typing Speed Web App

> A fast, modern typing speed application built for typists who love to compete and improve. Race against others, track your progress, and master your keyboard — all in one place.

![Prompt Banner](https://via.placeholder.com/1200x400/7C3AED/ffffff?text=Prompt+%E2%80%94+Type+Faster%2C+Think+Sharper)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [Feedback](#-feedback)
- [License](#-license)

---

## ✨ Features

### 🎯 Typing Test

- Multiple modes: **time-based** (15s, 30s, 60s, 120s) and **word-count-based**
- Real-time **WPM**, **accuracy**, and **error** display
- Live character highlighting — correct in green, incorrect in red
- Detailed results screen after every test

### 🏎️ Street Race Mode

- Race your car against others in real-time
- Car speed driven by your typing speed and accuracy
- Live race progress bar for all participants

### 🌐 Multiplayer

- Real-time rooms powered by **Socket.io**
- Public rooms and private rooms with room codes
- Compete with friends or strangers globally

### 🏆 Leaderboard

- Global leaderboard with top WPM scores
- Filter by: Daily / Weekly / All-time and test mode
- Displays rank, username, WPM, and accuracy

### 👤 User Profile

- Personal stats dashboard: avg WPM, best WPM, total tests, accuracy
- Full test history with recent results
- Avatar and username customization

### ✍️ Practice & Custom Text Mode

- Enter your own text to practice specific content
- Random famous quotes mode for variety

### 💬 Feedback

- Built-in feedback form — send your thoughts directly to the developer
- Powered by **Resend API** for reliable email delivery

### 🌗 Dark & Light Mode

- Toggle between dark and light themes
- Preference saved in `localStorage`
- Purple-accented design in both modes

### 🔐 Authentication

- Email + Password signup/login with **bcrypt** password hashing
- **OAuth** login (Google)
- Email format validation + MX record DNS check
- **JWT**-based session management

---

## 🛠️ Tech Stack

| Layer     | Technology                                 |
| --------- | ------------------------------------------ |
| Frontend  | React (with lazy loading & code splitting) |
| Backend   | Node.js + Express                          |
| Database  | PostgreSQL                                 |
| Real-time | Socket.io                                  |
| Auth      | JWT + bcrypt + Google OAuth                |
| Email     | Resend API                                 |
| Styling   | CSS Variables + Purple theme               |

---

## 🏁 Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- A [Resend](https://resend.com) account (for feedback emails)
- A [Google Cloud](https://console.cloud.google.com) project (for OAuth)

### 1. Clone the repository

```bash
git clone https://github.com/ashokml1729/prompt.git
cd prompt-typing-app
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Set up environment variables

```bash
# In /server
cp .env.example .env
# Fill in your values (see Environment Variables section below)
```

### 4. Set up the database

```bash
# Create database
createdb prompt_db

# Run migrations
cd server
npm run migrate
```

### 5. Start the development servers

```bash
# Start backend (from /server)
npm run dev

# Start frontend (from /client)
npm run dev
```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend).

---

## 🔑 Environment Variables

Create a `.env` file inside the `/server` directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/prompt_db

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Resend (for feedback emails)
RESEND_API_KEY=your_resend_api_key
FEEDBACK_RECIPIENT_EMAIL=ashokbd369@gmail.com

# Server
PORT=3000
NODE_ENV=development
```

---

## 📁 Project Structure

```
prompt-typing-app/
├── client/                     # React frontend
│   ├── public/
│   │   └── favicon.ico         # Mini keyboard icon
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar/
│   │   │   ├── TypingBox/
│   │   │   ├── RaceTrack/
│   │   │   ├── Leaderboard/
│   │   │   └── ThemeToggle/
│   │   ├── pages/              # Route-level pages (lazy loaded)
│   │   │   ├── Home/
│   │   │   ├── Race/
│   │   │   ├── Profile/
│   │   │   ├── Leaderboard/
│   │   │   ├── Practice/
│   │   │   ├── Feedback/
│   │   │   ├── Login/
│   │   │   └── Signup/
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # Auth & Theme context
│   │   ├── utils/              # Helpers (email validator, WPM calc)
│   │   └── App.jsx
│   └── package.json
│
├── server/                     # Node.js + Express backend
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tests.js
│   │   ├── race.js
│   │   ├── leaderboard.js
│   │   ├── profile.js
│   │   └── feedback.js
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   └── validate.js         # Input validation
│   ├── sockets/                # Socket.io handlers
│   ├── db/
│   │   └── migrations/
│   ├── .env.example
│   └── index.js
│
├── shared/                     # Shared constants/types
└── README.md
```

---

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Test Results
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wpm INTEGER NOT NULL,
  raw_wpm INTEGER NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  errors INTEGER DEFAULT 0,
  duration INTEGER NOT NULL,  -- in seconds
  mode VARCHAR(50) NOT NULL,  -- 'time' | 'words' | 'quote' | 'custom'
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_test_results_wpm ON test_results(wpm DESC);

-- Race Rooms
CREATE TABLE race_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code VARCHAR(10) UNIQUE NOT NULL,
  host_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'waiting',  -- 'waiting' | 'racing' | 'finished'
  mode VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Race Participants
CREATE TABLE race_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES race_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  wpm INTEGER,
  accuracy DECIMAL(5,2),
  position INTEGER,
  finished_at TIMESTAMP
);

-- Feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| POST   | `/api/auth/signup`          | Register with email + password |
| POST   | `/api/auth/login`           | Login with email + password    |
| GET    | `/api/auth/google`          | Initiate Google OAuth          |
| GET    | `/api/auth/google/callback` | Google OAuth callback          |
| POST   | `/api/auth/logout`          | Logout                         |

### Tests

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/tests`         | Save a test result      |
| GET    | `/api/tests/history` | Get user's test history |

### Leaderboard

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| GET    | `/api/leaderboard` | Get global leaderboard |

### Profile

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/api/profile/:username` | Get user profile & stats |
| PUT    | `/api/profile`           | Update username/avatar   |

### Feedback

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| POST   | `/api/feedback` | Send feedback email |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 💬 Feedback

Found a bug or have a suggestion? Use the in-app **Feedback** section or open a [GitHub Issue](https://github.com/yourusername/prompt-typing-app/issues).

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with 💜 by <a href="https://github.com/ashokml1729">Ashok</a></p>
  <p>⌨️ Type faster. Think sharper. <strong>Prompt.</strong></p>
</div>
