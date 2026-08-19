# CarVerse
# 🚗 CarVerse - Car Rental Management Platform

![CarVerse Banner](https://via.placeholder.com/1200x400?text=CarVerse+Car+Rental+Platform)

## 📌 Overview

**CarVerse** is a modern full-stack car rental management platform designed to simplify vehicle booking, fleet management, customer interactions, and rental operations.

The platform provides a seamless experience for users to explore available cars, create bookings, manage accounts, and for administrators to manage vehicles, users, payments, and rental activities.

Built with a scalable architecture using the **MERN Stack** and deployed using modern cloud platforms.

---

## ✨ Features

### 👤 User Features

- User registration and authentication
- Secure JWT-based login system
- Browse available cars
- Search and filter vehicles
- View car details
- Book rental vehicles
- Manage bookings
- View booking history
- User profile management
- Wishlist functionality
- Contact and enquiry system

---

### 🔐 Admin Features

- Admin dashboard
- User management
- Vehicle/fleet management
- Booking management
- Payment tracking
- Review management
- Category management
- Brand management
- Service management
- Website settings management
- Analytics overview

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript (ES6+)
- React Router
- Axios
- Tailwind CSS / CSS
- Responsive UI Design

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST API Architecture
- Multer (File Upload)
- Nodemailer

### Database

- MongoDB Atlas

### Deployment

Frontend:
- Vercel

Backend:
- Render

Database:
- MongoDB Atlas

---

# 🏗️ Project Architecture

```
                User
                 |
                 |
          React Frontend
              (Vercel)
                 |
                 |
          REST API Requests
                 |
                 |
        Node.js + Express Backend
              (Render)
                 |
                 |
          MongoDB Atlas Database
```

---

# 📂 Project Structure

```
CarVerse
│
├── client
│   ├── src
│   │   ├── Components
│   │   ├── Pages
│   │   ├── Redux
│   │   ├── Services
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server
│   ├── src
│   │   ├── Controllers
│   │   ├── Models
│   │   ├── Routes
│   │   ├── Middleware
│   │   └── Config
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/Nikhil-beep25/CarVerse.git
```

Navigate into project:

```bash
cd CarVerse
```

---

# Frontend Setup

Go to frontend folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
VITE_APP_BACKEND_SERVER=http://localhost:8000/api
VITE_APP_IMAGE_SERVER=http://localhost:8000/
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Backend Setup

Go to backend folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

NODE_ENV=development
```

Start backend:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:8000
```

---

# 🔑 Authentication

CarVerse uses JWT authentication.

Flow:

```
User Login
     |
     |
Backend validates credentials
     |
     |
JWT Token Generated
     |
     |
Token stored on client
     |
     |
Protected Routes Access
```

---

# 🌐 Deployment

## Frontend Deployment

Platform:

```
Vercel
```

Build command:

```
npm run build
```

Output:

```
dist
```

Environment:

```
VITE_APP_BACKEND_SERVER=https://your-render-api-url.com/api
```

---

## Backend Deployment

Platform:

```
Render
```

Start command:

```
npm start
```

Environment variables:

```
PORT
MONGODB_URI
JWT_SECRET
NODE_ENV
```

---

# 🔒 Security Features

- JWT authentication
- Password hashing
- Protected admin routes
- Environment variable protection
- API validation
- Secure database connection

---

# 📸 Screenshots

(Add your project screenshots here)

---

# 🚀 Future Improvements

- Online payment gateway integration
- Real-time booking notifications
- Advanced analytics dashboard
- Mobile application
- AI-based vehicle recommendations
- GPS vehicle tracking

---

# 👨‍💻 Developer

**Nikhil Bhadauriya**

Full Stack Developer

GitHub:
https://github.com/Nikhil-beep25

LinkedIn:
https://www.linkedin.com/in/nikhil-bhadauriya-308414321

YouTube:
https://www.youtube.com/@ItsNikhilTech

Instagram:
https://www.instagram.com/itsnikhil_tech

---

# 📄 License

This project is developed for learning, portfolio, and demonstration purposes.
