# LifeQuest Frontend Documentation

## Overview
The LifeQuest frontend is a modern, responsive Single Page Application (SPA) built with **React** and **Vite**. It provides a rich, gamified user interface for the LifeQuest productivity system. The design emphasizes "Dark Mode" aesthetics with glassmorphism effects, focusing on user engagement through visual feedback (animations, toasts, progress bars).

## Technology Stack
- **Core**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS (Utility-first CSS) + Custom Animations
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Charts**: Chart.js (via `react-chartjs-2`) for Analytics

## Project Structure
```
frontend/src/
├── api/                # API configuration
│   └── axios.js        # Axios instance with Interceptors (Auto-token refresh)
├── components/         # Reusable UI components
│   ├── modals/         # CreateTask, RenewTodoModal, etc.
│   ├── ui/             # Generic UI (Modal, Toast, Button)
│   ├── Layout.jsx      # Main application wrapper (Sidebar + Content)
│   ├── StatsBar.jsx    # Header showing HP, XP, Gold, Level
│   ├── TodoCard.jsx    # Smart "Betting" Card for Todos (Active/Overdue)
│   ├── HabitCard.jsx   # Component for Habits (+/- buttons)
│   ├── DailyCard.jsx   # Legacy Daily Tasks
│   └── TaskColumn.jsx  # Vertical list container
├── context/            # React Context for Global State
│   └── GameProvider.jsx # Global Game Data (Todos, Habits, User Stats)
│   └── AuthProvider.jsx # Login/Auth state
├── pages/              # Main Route Views
│   ├── Login.jsx       # Auth
│   ├── Dashboard.jsx   # Analytics + Quick Links
│   ├── TodosPage.jsx   # dedicated "Betting Board" for Todos
│   ├── HabitsPage.jsx  # Habit Tracker
│   └── ShopPage.jsx    # Item Store
├── App.jsx             # Router
└── main.jsx            # Entry
```

## Key Components & Logic

### 1. StatsBar (`components/StatsBar.jsx`)
- Persistent HUD showing Game Status.
- Visualizes real-time Gold/XP updates from actions.

### 2. Todo System ("Productivity Betting")
The frontend visualizes the "Bet" nature of the new backend.

- **`TodoCard.jsx`**:
    - **Active**: Shows Deadline and "Bet X Gold".
    - **Overdue**: Turns Red. Shows "Penalty Applied". Displays a **"Renew"** button.
    - **Completed**: Turns Green. Shows success state.
    - **Timezone**: All deadlines are automatically formatted to **IST (Asia/Kolkata)**.

- **`RenewTodoModal.jsx`**:
    - Pops up when clicking "Renew" on an overdue card.
    - Asks user to confirm the 10% fee and pick a new deadline.

- **`CreateTaskModal.jsx`**:
    - **Dynamic Fields**: Changes based on type (Habit vs Todo vs Daily).
    - **Gold Warning**: If a user sets a deadline, a warning appears explaining the "Loan/Bet" mechanics (Upfront Gold vs Double Penalty).

### 3. Habit System
- **`HabitsPage.jsx`**: Split view for "Build" vs "Break".
- **`HabitCard.jsx`**: Interactive +/– buttons with streak flames.

### 4. Dashboard & Analytics
- **`Dashboard.jsx`**:
    - Uses `Chart.js` to visualize Weekly Activity (Bar Chart) and Task Distribution (Doughnut).
    - Displays "Captain's Log" (Recent activity history).
    - Connects to the new Context to distinguish between Habits, Dailies, and Todos.

### 5. Global State Management (`GameProvider.jsx`)
- Centralizes all data fetching: `fetchTodos`, `fetchHabits`, `createTodo`, `renewTodo`, etc.
- Ensures distinct arrays for `todos` (New System) and `tasks` (Legacy/Dailies).
- Auto-refreshes user stats (Gold/XP) after every action to keep the HUD in sync.

## Setup & Running

1. **Environment Variables**: Create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   # Runs on http://localhost:5173
   ```
