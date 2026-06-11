# Aegis Auth | MERN Stack User Authentication System

A secure, production-ready, full-stack User Authentication System built using the MERN (MongoDB, Express, React, Node.js) stack. The project features a backend API with password hashing and JSON Web Token (JWT) verification, coupled with a frontend dashboard built in React + Vite, styled using a custom glassmorphism dark-theme CSS design system.

---

## Key Features

- **Secure Registration**: Form validations, checking for duplicate email registry, and hashing passwords using `bcryptjs` before storage.
- **JWT Authentication**: User logins issue signed JSON Web Tokens with a 7-day expiration time.
- **Protected Endpoints**: A dedicated authorization middleware verifies the JWT sent inside the `Authorization` request headers.
- **Vite-powered React Frontend**: Swift Client-Side Routing with `react-router-dom` and route-level protection.
- **Modern Responsive UI**: Built with custom Vanilla CSS featuring dark-mode gradients, interactive inputs, floating action animations, skeleton loaders, and a responsive layout.
- **Toast Feedbacks**: Custom auto-dismissing toast alerts for form validations, logins, and API failures.

---

## Directory Structure

```text
auth-task1/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   └── authController.js     # Auth handler logic (Register / Login)
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Verification middleware
│   ├── models/
│   │   └── User.js               # Mongoose schema (w/ pre-save bcrypt hook)
│   ├── routes/
│   │   ├── authRoutes.js         # Public auth endpoints
│   │   └── dashboardRoutes.js    # Protected dashboard route
│   ├── .env                      # Local environment configurations (ignored in git)
│   ├── .env.example              # Environment template configurations
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express application entrypoint
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx# Route guardian component
│   │   │   └── Toast.jsx         # Custom alert notification banner
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Protected panel (fetches from API)
│   │   │   ├── Login.jsx         # Login screen with validations
│   │   │   └── Register.jsx      # Registration screen with validations
│   │   ├── App.css               # Cleared fallback file
│   │   ├── App.jsx               # Router mapping file
│   │   ├── index.css             # Main theme design system (Vanilla CSS)
│   │   └── main.jsx              # React DOM mounting file
│   ├── index.html                # Entry HTML (with Outfit/Inter fonts)
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configurations
│
└── README.md                     # Documentation
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.x or above recommended)
- **npm** (v9.x or above)
- **MongoDB** (Running locally on `mongodb://127.0.0.1:27017` or a cloud-based cluster instance like MongoDB Atlas)

---

### Step 1: Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file:
   - Note that a template `.env.example` has been provided. Create a new file named `.env` and configure your credentials.
   - Example contents of `.env`:
     ```env
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/mern_auth_db
     JWT_SECRET=super_secret_key_12345
     JWT_EXPIRES_IN=7d
     ```

4. Run the backend server:
   - **Development Mode** (Runs with `nodemon` for hot-reloading):
     ```bash
     npm run dev
     ```
   - **Production Mode**:
     ```bash
     npm start
     ```

*The server should run on port `5000` with the log: `Server running on port 5000` and `MongoDB Connected`.*

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

*The local server should boot on `http://localhost:5173`. Open this URL in your web browser.*

---

## API Documentation

### Public Endpoints

#### 1. Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully"
  }
  ```

#### 2. Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "647f5263d917830f5bca9e1a",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

---

### Protected Endpoints

#### Get Dashboard Details
- **URL**: `/api/dashboard`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "message": "Welcome to the secure dashboard! This data is fetched from a protected API endpoint.",
    "user": {
      "id": "647f5263d917830f5bca9e1a",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-06-11T07:00:00.000Z"
    }
  }
  ```
- **Response (401 Unauthorized - Missing Token)**:
  ```json
  {
    "message": "Access Denied"
  }
  ```
- **Response (401 Unauthorized - Incorrect/Expired Token)**:
  ```json
  {
    "message": "Invalid Token"
  }
  ```

---

## Key Coding Standards & Implementations

### Backend
1. **User Model (`backend/models/User.js`)**: Uses Mongoose middleware hooks (`pre('save')`) to hash passwords. This ensures that passwords are never stored as plaintext in the database.
2. **Auth Controller (`backend/controllers/authController.js`)**: Handlers validate credentials and use `jsonwebtoken` to sign payloads, mapping payload ID for token-based tracking.
3. **Auth Middleware (`backend/middleware/authMiddleware.js`)**: Evaluates headers for presence of `Bearer` token prefixes, decrypts and parses variables, and sets `req.user` payload before permitting controller access.

### Frontend
1. **ProtectedRoute Wrapper (`frontend/src/components/ProtectedRoute.jsx`)**: Enforces validation before mapping child routes. Auto-redirects to `/login` if storage credentials are null.
2. **Dashboard Logic (`frontend/src/pages/Dashboard.jsx`)**: Fetches data dynamically during mounting, transmits active keys in requests, logs failures, handles session resets, and triggers clean user-session clears during logout commands.
