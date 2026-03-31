# Mentoring Call Scheduling System — Mentorque

A full-stack mentoring call scheduling platform with Role-Based Access Control (RBAC) for Users, Mentors, and Admins. Built as an internship assignment for Mentorque.

---

## 🚀 Live Demo

- **Frontend**: (Add Vercel URL after deployment)
- **Backend**: (Add Render URL after deployment)

---

## 📋 Overview

This system allows:
- **Users** — Add their availability and update their profile description
- **Mentors** — Add their availability
- **Admin** — View user requirements, get mentor recommendations, check availability overlap, and book calls

---

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL (NeonDB)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React + Vite
- Tailwind CSS
- React Router DOM

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL (or NeonDB connection string)

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL="your_neon_or_postgres_connection_string"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="30d"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin User"
```

Run migrations and seed:

```bash
npx prisma migrate deploy
node src/scripts/seed.js
```

Start backend:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

---

## 🔑 Login Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@example.com | admin123 |
| Mentor | mentor1@example.com | mentor123 |
| Mentor | mentor2@example.com | mentor123 |
| Mentor | mentor3@example.com | mentor123 |
| Mentor | mentor4@example.com | mentor123 |
| Mentor | mentor5@example.com | mentor123 |
| User | user1@example.com | user123 |
| User | user2@example.com | user123 |
| ... | user3-10@example.com | user123 |

---

## 🗂️ Project Structure

```
mentorque/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── mentors.js
│   │   │   ├── availability.js
│   │   │   ├── calls.js
│   │   │   └── callTypes.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── lib/
│   │   │   └── prisma.js
│   │   └── scripts/
│   │       └── seed.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Welcome.jsx         # Login page
    │   │   ├── UserAvailability.jsx
    │   │   ├── MentorAvailability.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── components/
    │   │   ├── AvailabilityDashboard.jsx
    │   │   └── Layout.jsx
    │   ├── api/
    │   │   ├── auth.js
    │   │   ├── users.js
    │   │   ├── mentors.js
    │   │   ├── availability.js
    │   │   ├── calls.js
    │   │   ├── callTypes.js
    │   │   └── client.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   └── App.jsx
    └── package.json
```

---

## ✅ Features Implemented

### Authentication
- Simple JWT-based login (no OAuth)
- Role-based access control (USER, MENTOR, ADMIN)
- Separate dashboards per role
- Auto-redirect based on role after login

### User Dashboard
- View and edit profile description
- View profile tags
- Add availability with timezone (IST/GMT)
- View all availability slots
- Delete availability slots

### Mentor Dashboard
- Same as User Dashboard
- Availability managed separately as mentor

### Admin Dashboard
- **Searchable user selection** (search by name or email)
- **Call type selection** with associated tags displayed
- **Mentor recommendation engine** (vectorless RAG):
  - Scores mentors based on tag overlap with user
  - Scores based on call type tag matching
  - Scores based on description keyword matching
  - Scores based on availability count
- **Edit mentor metadata** (tags + description) directly from dashboard
- **Availability overlap detection** — shows common slots between selected user and mentor
- **Timezone-aware booking** — all times displayed and stored in selected timezone (IST/GMT)
- **Book calls** — creates scheduled call with user, mentor, call type, time, and notes
- **Scheduled calls table** — view all booked calls with status
- **Delete calls**

### Timezone Support
- Full IST (GMT+5:30) and GMT (GMT+0) support
- Timezone stored on each availability slot
- All times correctly converted for display
- Admin timezone selector affects all time displays and bookings

---

## 🧠 Recommendation Engine (Vectorless RAG)

Mentors are scored when admin clicks "Get Recommendations":

| Criteria | Points |
|----------|--------|
| Tag overlap between user and mentor | 10 pts per matching tag |
| Call type tag matching with mentor tags | 15 pts per matching tag |
| Description keyword matching | Up to 20 pts |
| Mentor has upcoming availability | 20 pts |

Top 5 mentors sorted by score are shown.

---

## 📞 Call Types

| Call Type | Recommended Mentor Profile |
|-----------|---------------------------|
| Resume Revamp | Big tech, career coaching |
| Job Market Guidance | Communication, industry insight |
| Mock Interview (Technical) | Same domain as user, technical |
| Mock Interview (Behavioral) | Communication, leadership |

---

## 🗄️ Database Schema

### User
- id, email, password, name, role (ADMIN/MENTOR/USER)
- tags (String[]), description, timezone

### Availability
- id, userId?, mentorId?, role, date, startTime, endTime, timezone

### CallType
- id, name, description, defaultTags (String[])

### Call
- id, userId, mentorId, callTypeId, scheduledTime, status, notes

---

## 🚀 Deployment

### Backend → Render.com
1. Push backend to GitHub
2. New Web Service on Render
3. Set environment variables (same as `.env`)
4. Build: `npm install`
5. Start: `npm start`

### Frontend → Vercel
1. Push frontend to GitHub
2. New Project on Vercel
3. Set `VITE_API_URL` to your Render backend URL
4. Deploy

### Database → NeonDB (already configured)
- Connection string already set in backend `.env`
- Migrations already applied
- Data already seeded

---

## 🔧 API Endpoints

### Auth
- `POST /api/auth/login` — Login with email/password
- `GET /api/auth/me` — Get current user

### Users
- `GET /api/users` — List all users (admin only)
- `GET /api/users/:id` — Get user by ID
- `PATCH /api/users/:id` — Update user description

### Mentors
- `GET /api/mentors` — List all mentors
- `GET /api/mentors/:userId/recommend?callTypeId=` — Get recommended mentors
- `GET /api/mentors/:id` — Get mentor by ID
- `PATCH /api/mentors/:id` — Update mentor tags/description (admin only)

### Availability
- `GET /api/availability` — Get availability (filter by userId/mentorId)
- `POST /api/availability` — Add availability slot
- `DELETE /api/availability/:id` — Delete availability slot

### Calls
- `GET /api/calls` — List all calls
- `POST /api/calls` — Create call (admin only)
- `PATCH /api/calls/:id` — Update call status (admin only)
- `DELETE /api/calls/:id` — Delete call (admin only)

### Call Types
- `GET /api/call-types` — List all call types

---

## ⏳ Remaining Before Submission

- [ ] Deploy backend to Render.com
- [ ] Deploy frontend to Vercel
- [ ] Update README with live URLs
- [ ] Record Loom video (5-7 min walkthrough)

---

## 🎥 Loom Video Should Cover

1. Problem understanding
2. Architecture decisions (JWT, vectorless RAG, NeonDB)
3. Full walkthrough:
   - Login as User → add availability + update description
   - Login as Mentor → add availability
   - Login as Admin → search user, select call type, get recommendations, edit mentor, view overlap, book call
4. Timezone switching demonstration (IST ↔ GMT)
