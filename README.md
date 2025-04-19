# Advanced Combo Project

This project is a full-stack advanced combo application consisting of:

- **Frontend:** React web app with real-time dashboard, authentication, notifications, and data visualization.
- **Backend:** Node.js/Express service with REST API, Socket.io support, authentication, and SQLite database.
- **Scripts:** Background script for data processing or monitoring integrated with backend.

## Features

- User registration and login with JWT authentication.
- Real-time data updates via Socket.io.
- Data visualization using Recharts.
- Notifications display.
- Background script simulating data processing and sending updates to backend.
- SQLite database for persistent user storage.
- Automated startup script to run backend, frontend, and data processor simultaneously.

## Setup Instructions

### Prerequisites

- Node.js and npm installed.

### Running the Project

1. From the project root, run the startup script:
   ```bash
   chmod +x start-all.sh
   ./start-all.sh
   ```

This will install dependencies and start backend, frontend, and data processor script automatically.

### Manual Setup

If you prefer manual setup:

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd advanced-combo-project/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   JWT_SECRET=your_jwt_secret_key_here
   PORT=4000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd advanced-combo-project/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend app:
   ```bash
   npm start
   ```

#### Background Script

1. In a new terminal, run the background data processing script:
   ```bash
   node advanced-combo-project/scripts/dataProcessor.js
   ```

## GitHub Upload Instructions

To upload this project to your GitHub account `morningstarxcdcode`, follow these steps:

1. Initialize a git repository in the project root (if not already):
   ```bash
   git init
   ```

2. Add all files and commit:
   ```bash
   git add .
   git commit -m "Initial commit of advanced combo project"
   ```

3. Create a new repository on GitHub named `advanced-combo-project`.

4. Add the remote repository:
   ```bash
   git remote add origin https://github.com/morningstarxcdcode/advanced-combo-project.git
   ```

5. Push the code to GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Notes

- Adjust the Socket.io URL in the frontend and script if backend runs on a different host or port.
- This project is designed to be a showcase of a full-stack real-time application with authentication, data visualization, and automation.

---

Created by morningstarxcdcode
   git push -u origin main
   git remote add origin https://github.com/morningstarxcdcode/advanced-combo-project.git
   git commit -m "Initial commit of advanced combo project"
   node advanced-combo-project/scripts/dataProcessor.js
   npm start
   cd advanced-combo-project/frontend
   npm run dev
   PORT=4000
   npm install
