# ⚡ AthleteIQ — Athlete Performance Tracker

A modern full-stack web application built with **React.js** and **Node.js** for the TECHNO VANAM Internship Technical Assessment.

---

## 🚀 Features

### Core
- **JWT Authentication** — Register & Login with form validation
- **Role-Based Access** — Admin and Coach roles
- **Athlete Management** — Add, Edit, Delete, Search, Filter by sport
- **Statistics Dashboard** — Total Athletes, Active Sessions, Completed Workouts, Performance Score
- **Pagination & Sorting** — Server-side pagination (8 per page)
- **Export CSV** — Download athlete data as CSV

### Bonus
- ✅ **Dark Mode** — Toggle with system preference support
- ✅ **Charts & Analytics** — Sport distribution, Performance score range, Status overview
- ✅ **Role-Based Authentication** — Admin vs Coach
- ✅ **Pagination** — Server-side with query params
- ✅ **Sorting** — By createdAt (extensible)
- ✅ **Export CSV** — Frontend export of current page

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Axios, React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Styling | Custom CSS with CSS Variables (no UI lib) |

---

## 📁 Project Structure

```
athlete-tracker/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Athlete.js          # Athlete schema
│   ├── routes/
│   │   ├── auth.js             # /api/auth/register, /api/auth/login
│   │   └── athletes.js         # CRUD /api/athletes
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js        # Axios instance with auth interceptor
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Auth state management
    │   │   └── ThemeContext.jsx # Dark mode state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── components/
    │   │   ├── Layout/
    │   │   │   └── Sidebar.jsx
    │   │   ├── Dashboard/
    │   │   │   ├── StatsCard.jsx
    │   │   │   └── PerformanceChart.jsx
    │   │   └── Athletes/
    │   │       ├── AthleteTable.jsx
    │   │       └── AthleteModal.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd athlete-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```env
MONGO_URI=mongodb://localhost:27017/athleteiq
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

Start the backend:
```bash
npm run dev
# or
node server.js
```
Server runs on **http://localhost:5000**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/athletes` | ✅ | Get athletes (search, filter, paginate) |
| POST | `/api/athletes` | ✅ | Add new athlete |
| PUT | `/api/athletes/:id` | ✅ | Update athlete |
| DELETE | `/api/athletes/:id` | ✅ | Delete athlete |

### Query Parameters for GET /api/athletes
- `search` — Search by name
- `sport` — Filter by sport
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)
- `sort` — Sort field (default: createdAt)

---

## 🗄️ Database Schema

### User
```js
{ name, email, password (hashed), role: ['admin', 'coach'], createdAt }
```

### Athlete
```js
{ name, sport, age, status: ['Active', 'Injured', 'Resting'],
  performanceScore (0-100), completedWorkouts, imageUrl, createdBy, createdAt }
```

---

## 🎨 UI/UX Highlights
- Modern SaaS-style design with clean color palette
- Fully responsive — sidebar collapses on mobile
- Dark/Light mode toggle with CSS variables
- Loading skeletons for table data
- Empty state illustrations
- Smooth modal animations
- Toast notifications for all actions
- Performance score bar indicator in table
- Sport-colored bar charts, column charts, status progress bars

---

## 👨‍💻 Author - pragadeeshwaran

Built for TECHNO VANAM Internship Technical Assessment — June 2026
