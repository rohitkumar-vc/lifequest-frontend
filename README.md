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

## Project Structure
```
frontend/src/
├── api/                # API configuration
│   └── axios.js        # Axios instance with Interceptors (Auto-token refresh)
├── components/         # Reusable UI components
│   ├── modals/         # CreateTask, etc.
│   ├── ui/             # Generic UI (Modal, Toast, Button)
│   ├── Layout.jsx      # Main application wrapper (Sidebar + Content)
│   ├── StatsBar.jsx    # Header showing HP, XP, Gold, Level
│   ├── TaskCard.jsx    # Component for Todos
│   ├── HabitCard.jsx   # Component for Habits (+/- buttons)
│   ├── DailyCard.jsx   # Component for Dailies (Checkbox)
│   └── TaskColumn.jsx  # Vertical list container for tasks
├── context/            # React Context for Global State
│   └── AuthProvider.jsx # Handles Login, Registration, Token storage
├── pages/              # Main Route Views
│   ├── Login.jsx       # Authentication entry point
│   ├── Dashboard.jsx   # Overview of all active quests
│   ├── HabitsPage.jsx  # Dedicated habits management
│   ├── DailiesPage.jsx # Dedicated dailies management
│   ├── Profile.jsx     # User settings and Stats details
│   ├── ShopPage.jsx    # Item purchase interface
│   └── AdminDashboard.jsx # Admin tools (Invite users, Add items)
├── App.jsx             # Main Router configuration
└── main.jsx            # Entry point
```

## Key Components & Logic

### 1. StatsBar (`components/StatsBar.jsx`)
- **Purpose**: A persistent HUD (Heads Up Display) showing the user's game status.
- **Logic**: 
    - Displays XP as a percentage relative to the *current level's max XP*.
    - Visualizes HP and Gold.
    - Updates automatically whenever the global `user` state changes (driven by the `AuthProvider` or local updates after task completion).

### 2. Task Cards
We use specialized cards for different task types to optimize the UX:
- **`TaskCard.jsx` (Todos)**: Features a straightforward checkbox. Recently updated to act as a toggle button (Complete/Undo). Includes support for deadlines and difficulty badges.
### 2. Habit System ("Build vs Break")
The frontend implements a split-view interface for the 4-state habit logic.

- **`HabitsPage.jsx`**:
    - **Split View**: Separates "Building" (Positive) and "Resisting" (Negative) habits into distinct columns.
    - **Visuals**: Confetti celebrations for milestones, toast notifications for rewards/penalties.

- **`HabitCard.jsx`**:
    - **Dynamic Buttons**:
        - **Positive**: "Performed" (Green) vs "Skipped" (Red).
        - **Negative**: "Avoided" (Green) vs "Indulged" (Red).
    - **Stats**: Shows current streak (flame icon) and best streak.
    - **Badges**: Displays unlocked milestones (e.g., "7D").

- **`CreateTaskModal.jsx`**:
    - If "Habit" is selected, offers a toggle between "Build (+)" and "Break (-)".

### 3. Other Task Components
- **`TaskCard.jsx` (Todos)**: Features a straightforward checkbox. Recently updated to act as a toggle button (Complete/Undo). Includes support for deadlines and difficulty badges.
- **`DailyCard.jsx` (Dailies)**:
    - Designed for recurring daily tasks.
    - Large clickable area for easy completion.
    - Visual feedback for "Done" state.

### 3. Admin Dashboard (`pages/AdminDashboard.jsx`)
- Restricted access route (only for users with `role: "admin"`).
- **User Management**: Allows inviting new users by Name and Email. Triggers backend registration flow.
- **Shop Management**: Provides a form to create new items (Potions, Gear) that appear in the global shop for all users.

### 4. Interactive Feedback
- **Toasts**: Used globally (`components/ui/Toast.jsx`) to provide instant feedback for actions (e.g., "Gold Earned!", "Level Up!", "Error: Invalid Password").
- **Framer Motion**: Used for page transitions and card entry animations, making the app feel "alive" and game-like.

### 5. Authentication Flow (`context/AuthProvider.jsx`)
- On load, checks for a stored Access Token.
- **Axios Interceptor**:
    - Attaches the Access Token to every request.
    - If a request fails with 401 (Unauthorized), it automatically attempts to use the Refresh Token to get a new Access Token and retries the original request.
    - If refresh fails, it redirects the user to `/login`.

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
