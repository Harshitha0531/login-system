# Login System

A full-stack login system built with React and Node.js that demonstrates how access and refresh tokens work in real authentication flows.

---

## Tech Stack

**Frontend**
- React
- Axios
- Tailwind CSS

**Backend**
- Node.js + Express
- JSON Web Tokens (jsonwebtoken)
- bcryptjs
- cors

---

## Features

- User registration with hashed passwords
- Login with access + refresh token generation
- Auto token refresh using axios interceptors
- Protected route (`/profile`)
- Logout that invalidates the refresh token
- Console logs showing the full token flow in real time

---

## Project Structure

```
login-system/
├── src/
│   ├── Components/
│   │   ├── Login.jsx       # Login form
│   │   ├── Register.jsx    # Register form
│   │   └── Dashboard.jsx   # Protected dashboard
│   ├── api.js              # Axios instance with interceptors
│   ├── App.jsx             # Root component, handles routing
│   └── index.css           # Tailwind CSS import
├── backend/
│   ├── server.js           # Express server with all API routes
│   └── package.json
```

---

## Getting Started

### 1. Start the backend

```bash
cd backend
npm install
node server.js
```

Server runs on `http://localhost:5000`

### 2. Start the frontend

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173`

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/register` | Create a new user |
| POST | `/login` | Login and receive tokens |
| POST | `/refresh` | Get a new access token |
| POST | `/logout` | Invalidate refresh token |
| GET | `/profile` | Protected — requires access token |

---

## Token Flow

1. On login, server returns an **access token** (15 min) and a **refresh token** (7 days)
2. Every request automatically attaches the access token via axios interceptor
3. When the access token expires, the interceptor catches the 403, calls `/refresh`, gets a new token and retries the request silently
4. On logout, the refresh token is invalidated on the server and both tokens are cleared from localStorage

---

## Demo

Open browser DevTools console and you will see color-coded logs for every step:

- 🔵 Request being made
- 🟢 Success response
- 🟠 Token refresh triggered
- 🔴 Logout or token expired

To simulate token expiry, corrupt the access token in DevTools → Application → Local Storage, then click **Get Profile**.
