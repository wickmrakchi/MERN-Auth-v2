# Mrakchi.dev | MERN Auth ✅

A modern MERN authentication application with email verification and password reset using OTPs. Authentication is implemented with **JWT stored in an HttpOnly cookie**.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](#tech-stack)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg)](#tech-stack)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg)](#tech-stack)
[![JWT](https://img.shields.io/badge/JWT-Cookies-success.svg)](#authentication)

---

## Preview

A simple web app that lets users:
- Register / Login
- Verify their email using a 6-digit OTP
- Reset their password using an email OTP
- Stay authenticated via `/api/auth/is-auth` and `/api/user/data`

---

## Features

- 🧾 **User registration** (name, email, password)
- 🔐 **Login** with JWT cookie
- 🚪 **Logout** (clears cookie)
- 📧 **Email verification OTP** (24h expiry)
- 🗝️ **Password reset OTP** (15m expiry)
- 👤 **Authenticated user profile endpoint**
- ✉️ **SMTP email sending** via Nodemailer (Brevo relay)

---

## Tech Stack

- **Frontend**: React (Vite), React Router, TailwindCSS, Axios, React Toastify
- **Backend**: Node.js, Express, Mongoose, JWT, bcryptjs, Nodemailer
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT in **HttpOnly cookies**
- **Email delivery**: Nodemailer SMTP (hosted on Brevo)

---

## Project Structure

```txt
.
├── client/                          # React frontend
│   ├── src/
│   │   ├── assets/                # SVG/PNG assets used across the UI
│   │   ├── components/            # Navbar, Header
│   │   ├── context/               # AppContext (auth state + API client)
│   │   └── pages/                # Home, Login, EmailVerify, ResetPassword
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
│
└── server/                          # Express backend
    ├── config/
    │   ├── emailTemplates.js        # HTML templates for OTP emails
    │   ├── mongodb.js               # MongoDB connection
    │   └── nodemailer.js            # SMTP transporter (Brevo relay)
    ├── controllers/
    │   ├── authController.js       # register/login/logout + OTP flows
    │   └── userController.js       # getUserData
    ├── middleware/
    │   └── userAuth.js             # JWT cookie verification
    ├── models/
    │   └── userModel.js           # Mongoose user schema (OTP fields)
    └── routes/
        ├── authRoutes.js           # /api/auth endpoints
        └── userRoutes.js           # /api/user endpoints
```

---

## Installation

### 1) Backend

```bash
cd server
npm install
npm run start
```

### 2) Frontend

```bash
cd client
npm install
npm run dev
```

> Frontend is configured to talk to the backend using an environment variable (`VITE_BACKEND_URL`).

---

## Environment Variables

This project expects environment variables in both `server` and `client`.

### Server: `server/.env`

Used throughout the backend:

- `PORT` - Server port (default: `4000`)
- `NODE_ENV` - Determines cookie `secure` and `sameSite` behavior
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key used to sign/verify JWT tokens
- `SENDER_EMAIL` - Email address used as the SMTP “from” and for template values
- `SMTP_USER` - SMTP username (Brevo)
- `SMTP_PASS` - SMTP password (Brevo)

### Client: `client/.env`

Used in `AppContext.jsx`:

- `VITE_BACKEND_URL` - Base backend URL, e.g. `http://localhost:4000`

---

## Backend Setup

Backend entry:
- `server/server.js`

Run:

```bash
cd server
npm run start
```

Backend routes:
- `app.use("/api/auth", authRoutes)`
- `app.use("/api/user", userRoutes)`

---

## Frontend Setup

Run:

```bash
cd client
npm run dev
```

The app uses `axios` with credentials enabled (`axios.defaults.withCredentials = true`) to ensure cookies are sent.

---

## Database Setup

Uses MongoDB via Mongoose:
- Connection: `server/config/mongodb.js`
- Model: `server/models/userModel.js`

### User Model Fields

- `name` (string, required)
- `email` (string, required, unique)
- `password` (string, required; stored as bcrypt hash)
- `verifyOtp` (string)
- `verifyOtpExpireAT` (number timestamp)
- `isAccountVerified` (boolean)
- `resetOtp` (string)
- `resetOtpExpireAt` (number timestamp)

---

## API Documentation

Base URL prefixes:
- `POST /api/auth/*`
- `GET /api/user/*`

> **Auth method:** JWT stored in an **HttpOnly cookie named `token`**.

### Auth Routes (`server/routes/authRoutes.js`)

#### 1) Register
- **Method**: `POST`
- **Route**: `/api/auth/register`
- **Description**: Creates a user, hashes password, sets JWT cookie, sends welcome email.
- **Auth**: Public
- **Request Body**:
  - `name: string`
  - `email: string`
  - `password: string`

#### 2) Login
- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Description**: Validates email/password, sets JWT cookie.
- **Auth**: Public
- **Request Body**:
  - `email: string`
  - `password: string`

#### 3) Logout
- **Method**: `POST`
- **Route**: `/api/auth/logout`
- **Description**: Clears the `token` cookie.
- **Auth**: Public (cookie cleared regardless)

#### 4) Send Verify OTP
- **Method**: `POST`
- **Route**: `/api/auth/send-verify-otp`
- **Description**: Generates a 6-digit OTP and emails it if account isn’t verified.
- **Auth**: ✅ Required (`userAuth` middleware)
- **Request Body**: none (userId comes from JWT cookie)

#### 5) Verify Account (OTP)
- **Method**: `POST`
- **Route**: `/api/auth/verify-account`
- **Description**: Verifies submitted OTP and marks account as verified.
- **Auth**: ✅ Required (`userAuth` middleware)
- **Request Body**:
  - `otp: string`

#### 6) Check Auth State
- **Method**: `GET`
- **Route**: `/api/auth/is-auth`
- **Description**: Middleware-protected endpoint to confirm JWT cookie validity.
- **Auth**: ✅ Required (`userAuth` middleware)

#### 7) Send Password Reset OTP
- **Method**: `POST`
- **Route**: `/api/auth/send-reset-otp`
- **Description**: Generates a 6-digit OTP and emails it (valid for 15 minutes).
- **Auth**: Public
- **Request Body**:
  - `email: string`

#### 8) Reset Password
- **Method**: `POST`
- **Route**: `/api/auth/reset-password`
- **Description**: Validates OTP, hashes new password, clears OTP fields.
- **Auth**: Public
- **Request Body**:
  - `email: string`
  - `otp: string`
  - `newPassword: string`

### User Routes (`server/routes/userRoutes.js`)

#### Get Current User Data
- **Method**: `GET`
- **Route**: `/api/user/data`
- **Description**: Returns `{name, isAccountVerified}` for the authenticated user.
- **Auth**: ✅ Required (`userAuth` middleware)

---

## Authentication

### How it works (from code)

- On successful **register/login**, the backend signs a JWT:
  - payload: `{ id: user._id }`
  - secret: `JWT_SECRET`
  - expiry: `7d`
- The JWT is stored in a cookie named **`token`**:
  - `httpOnly: true`
  - `secure` and `sameSite` depend on `NODE_ENV`

### Middleware

- `server/middleware/userAuth.js`
  - Reads `req.cookies.token`
  - Verifies JWT via `jwt.verify(token, process.env.JWT_SECRET)`
  - Sets `req.user = { userId: tokenDecode.id }`

---

## Usage

1. Open the frontend (Vite dev server).
2. Register a new account.
3. Login.
4. From the navbar dropdown, choose **verify Email** (only shown when `!userData.isAccountVerified`).
5. Enter the 6-digit OTP.
6. Use **Forgot password?** to trigger the reset OTP flow.

---

## Scripts

### Server (`server/package.json`)

- `npm run start` → `nodemon server.js`

### Client (`client/package.json`)

- `npm run dev` → `vite`
- `npm run build` → `vite build`
- `npm run preview` → `vite preview`
- `npm run lint` → `eslint .`

---

## Dependencies (highlights)

### Backend
- `express` (server)
- `mongoose` (MongoDB ODM)
- `jsonwebtoken` (JWT signing/verification)
- `bcryptjs` (password hashing)
- `cookie-parser` (read cookies)
- `cors` (cross-origin requests with credentials)
- `nodemailer` (SMTP)
- `dotenv` (env loading)

### Frontend
- `react`, `react-dom`
- `react-router-dom`
- `axios` (API calls)
- `react-toastify` (toasts)
- `tailwindcss` (styling)

---

## Screenshots

Add your screenshots here:

- 📸 Auth flow (Register/Login)
- 📸 Email verification OTP screen
- 📸 Password reset OTP screen
- 📸 Navbar dropdown (Verify Email / Logout)

---

## Deployment

1. Deploy MongoDB (MongoDB Atlas or self-hosted).
2. Deploy backend (Render/Railway/Fly.io/VPS) and set:
   - `MONGO_URI`, `JWT_SECRET`, SMTP credentials, `SENDER_EMAIL`
3. Deploy frontend (Netlify/Vercel/etc.) and set:
   - `VITE_BACKEND_URL`
4. Ensure HTTPS in production so cookie `secure` works correctly.

---

## Security Notes

- ✅ JWT cookie is `httpOnly`, reducing risk from XSS.
- ✅ Passwords are hashed with bcrypt.
- ✅ OTPs have expiration checks (24 hours for verify OTP, 15 minutes for reset OTP).
- ⚠️ CORS is limited to `http://localhost:5173` in `server/server.js`.

---

## Future Improvements

Based on current code paths:

- Add rate limiting for OTP generation endpoints (`send-verify-otp`, `send-reset-otp`).
- Store and reuse email templates (`EMAIL_VERIFY_TEMPLATE`, `PASSWORD_RESET_TEMPLATE`) instead of sending plain text OTPs (templates currently exist but are not wired in `authController.js`).
- Return consistent HTTP status codes (currently responses mostly use `res.json(...)` with success flags).
- Improve OTP handling for security (e.g., OTP hashing at rest).

---

## Contributing

PRs are welcome.

---

## License

ISC

---

## Author

Mrakchi.dev (based on the frontend title: `Mrakchi.dev | MERN Auth`).

