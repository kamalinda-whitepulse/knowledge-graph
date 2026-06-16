# Personal Knowledge Graph Builder

A full-stack web application where users can create notes, link them together, and visualize the connections as an interactive knowledge graph.

---

## Tech Stack

**Frontend**
- React (Vite)
- React Flow — graph visualization
- Zustand — state management
- Axios — API calls
- Tailwind CSS — styling

**Backend**
- NestJS
- MongoDB + Mongoose
- JWT + Passport — authentication
- bcryptjs — password hashing

---

## Project Structure

```
knowledge-graph/
├── backend/                  # NestJS backend
│   └── src/
│       ├── auth/             # Register, login, JWT
│       ├── notes/            # Notes CRUD
│       ├── graph/            # Note relationships
│       ├── schemas/          # MongoDB schemas
│       └── common/           # JWT guard
│
└── frontend/                 # React frontend
    └── src/
        ├── pages/            # Dashboard, GraphView, NoteDetail, Login
        ├── components/       # GraphCanvas, NoteCard, NoteEditor, etc.
        ├── hooks/            # useAuth, useNotes, useGraph
        ├── api/              # Axios API calls
        └── store/            # Zustand global state
```

---

## Prerequisites

Make sure you have these installed before running the project:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) (optional — to view data)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kamalinda-whitepulse/knowledge-graph.git
cd knowledge-graph
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```
MONGO_URI=mongodb://localhost:27017/knowledge-graph
JWT_SECRET=your_secret_key_here
PORT=3000
```

Start the backend:

```bash
npm run start:dev
```

Backend runs on → http://localhost:3000

### 3. Setup the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on → http://localhost:5173

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and get JWT token |

### Notes
| Method | Endpoint | Description |
|---|---|---|
| GET | /notes | Get all notes |
| GET | /notes/:id | Get one note |
| POST | /notes | Create a note |
| PUT | /notes/:id | Update a note |
| DELETE | /notes/:id | Delete a note |

### Graph
| Method | Endpoint | Description |
|---|---|---|
| POST | /graph/link | Link two notes |
| GET | /graph/:noteId | Get note connections |
| DELETE | /graph/link/:id | Remove a link |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | /dashboard | Get stats (total notes, connections, most connected, recent) |

---

## Database Collections

**users**
- email, passwordHash, timestamps

**notes**
- title, content, tags[], userId, timestamps

**relationships**
- fromNoteId, toNoteId, type, userId, timestamps

Relationship types: `Related To` · `Depends On` · `References` · `Parent Of`

---

## Features

- User registration and login with JWT authentication
- Create, edit, delete, and search notes with tags
- Link notes together with typed relationships
- Interactive graph visualization using React Flow
- Dashboard showing total notes, connections, most connected notes, and recently created notes
- Knowledge explorer showing incoming and outgoing links for each note

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/knowledge-graph |
| JWT_SECRET | Secret key for JWT signing | your_secret_key |
| PORT | Backend server port | 3000 |

---

## Running Both Servers

You need two terminals running at the same time:

```bash
# Terminal 1 — Backend
cd knowledge-graph/backend
npm run start:dev

# Terminal 2 — Frontend
cd knowledge-graph/frontend
npm run dev
```