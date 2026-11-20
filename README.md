# Smart Productivity Manager (Full-Stack MERN)

A modern, SaaS-grade productivity and task management platform inspired by **Linear**, **Todoist**, **Things 3**, and **Notion**. Built on the **MERN stack** (MongoDB, Express, React, Node.js) with Tailwind CSS, Lucide icons, and Recharts.

---

## Architecture & Technology Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Linear/Things 3 design system, responsive layouts, optimistic UI |
| **State & Auth** | Context API (`AuthContext`, `TaskContext`) | Synchronized real-time task CRUD, HTTP-only session management |
| **Data Viz** | Recharts | Weekly throughput activity bars, priority distribution breakdown |
| **Backend API** | Node.js + Express.js | Clean MVC pattern, rate limiting, error middleware |
| **Database** | MongoDB Atlas + Mongoose | Compound indexing, strict schema validation, task ownership |
| **Security** | bcryptjs + jsonwebtoken + cookie-parser | Salting/hashing (10 rounds), HTTP-only cookies (SameSite/Secure), rate-limiting |

---

## Project Directory Structure

```
Smart To-Do & Productivity Manager/
├── client/                               # Frontend React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                     # AuthModal (Sign In / Register / Demo Login)
│   │   │   ├── common/                   # Button, Badge, Modal, StatCard, ProgressBar, EmptyState, Toast
│   │   │   ├── layout/                   # Sidebar, TopNavbar, MobileNav, NotificationDropdown, Layout
│   │   │   ├── dashboard/                # WelcomeSection, DashboardStats, ProductivityCharts, TaskSections
│   │   │   └── tasks/                    # TaskItem, TaskList, TaskFilters, TaskModal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # Session management & user state
│   │   │   └── TaskContext.jsx           # Live backend sync, optimistic CRUD, and filtering
│   │   ├── services/
│   │   │   ├── api.js                    # Centralized API service with HTTP-only cookie support
│   │   │   └── mockData.js               # Initial demonstration backlog
│   │   ├── pages/                        # Dashboard, MyTasks, Today, Upcoming, Categories, Analytics, Settings
│   │   └── App.jsx                       # Provider hierarchy & React Router tree
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js                    # API proxy and chunk splitting
├── server/                               # Backend Express & MongoDB Application
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # MongoDB Atlas connection with in-memory fallback
│   │   ├── controllers/
│   │   │   ├── authController.js         # Register, Login, Logout, GetCurrentUser
│   │   │   ├── taskController.js         # CRUD operations, status toggling, ownership checks
│   │   │   └── analyticsController.js    # Live overview, 7-day throughput, priority breakdown
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js         # JWT cookie / Bearer token protector
│   │   │   ├── errorMiddleware.js        # Centralized 404 & Mongoose error handling
│   │   │   └── rateLimiter.js            # Auth endpoint rate limiter
│   │   ├── models/
│   │   │   ├── User.js                   # Name, email, hashed password, timestamps
│   │   │   └── Task.js                   # Compound-indexed task schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js             # /api/auth/*
│   │   │   ├── taskRoutes.js             # /api/tasks/*
│   │   │   └── analyticsRoutes.js        # /api/analytics/*
│   │   └── server.js                     # Express bootstrap, CORS, cookie parser, route mounting
│   ├── .env.example
│   ├── package.json
│   └── test-api.js                       # Comprehensive automated integration test suite
├── package.json                          # Monorepo workspace configuration
└── README.md
```

---

## API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account with hashed password | Public (Rate-limited) |
| `POST` | `/api/auth/login` | Sign in user & issue secure HTTP-only cookie | Public (Rate-limited) |
| `POST` | `/api/auth/logout` | Clear authentication cookie | Private |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get user tasks (supports `status`, `priority`, `category`, `search`, `sortBy`) | Private |
| `POST` | `/api/tasks` | Create task assigned to user | Private |
| `GET` | `/api/tasks/:id` | Get single task (enforces ownership) | Private |
| `PUT` | `/api/tasks/:id` | Update task details (enforces ownership) | Private |
| `DELETE` | `/api/tasks/:id` | Delete task (enforces ownership) | Private |
| `PATCH` | `/api/tasks/:id/status` | Toggle or set task completion status | Private |

### Analytics (`/api/analytics`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/overview` | Total, completed, pending, overdue counts & completion rate | Private |
| `GET` | `/api/analytics/weekly` | Actual completed tasks per day over past 7 days | Private |
| `GET` | `/api/analytics/priority` | Task counts by priority (High, Medium, Low) | Private |

---

## Database Schemas & Indexes

### User Schema (`User.js`)
- `name`: String, required, trim, max 50 chars
- `email`: String, required, unique, lowercase, regex validated
- `password`: String, required, min 6 chars, `select: false` (hashed via bcrypt with salt factor 10)
- Timestamps: `createdAt`, `updatedAt`

### Task Schema (`Task.js`)
- `title`: String, required, trim, max 160 chars
- `description`: String, trim
- `priority`: Enum `['Low', 'Medium', 'High']` (default: `'Medium'`)
- `category`: String (default: `'Work'`)
- `status`: Enum `['pending', 'completed']` (default: `'pending'`)
- `completed`: Boolean (kept in sync with status)
- `dueDate`: String (`YYYY-MM-DD`, regex validated)
- `userId`: ObjectId, ref: `'User'`, required, indexed
- Timestamps: `createdAt`, `updatedAt`
- **Compound Indexes**:
  - `{ userId: 1, dueDate: 1, status: 1 }` — for rapid calendar horizon filtering
  - `{ userId: 1, createdAt: -1 }` — for reverse chronological task backlogs

---

## Getting Started

### 1. Environment Configuration
Copy `.env.example` in `server/` to `server/.env` and update your connection string:
```env
PORT=5000
NODE_ENV=development
# Set your MongoDB Atlas cluster URI:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_productivity?retryWrites=true&w=majority
JWT_SECRET=super_secure_jwt_secret_key_minimum_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```
*(If no Atlas URI is configured, an automatic embedded in-memory MongoDB instance will start for testing).*

### 2. Install Dependencies
From the repository root:
```bash
npm install
```

### 3. Start Backend Server
```bash
npm run server
# or: cd server && npm run dev
```

### 4. Start Frontend Client
```bash
npm run client
# or: cd client && npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Automated Backend Test Suite
Run the 15-step end-to-end integration test suite:
```bash
npm run test:server
```

### 6. Production Frontend Build
```bash
npm run build:client
```
