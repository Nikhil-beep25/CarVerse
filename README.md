# 🚗 CarVerse - Car Rental Management System

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React.js-blue" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-black" />
  <img src="https://img.shields.io/badge/Deployment-Render-purple" />
</p>

<h3 align="center">
A Full-Stack Car Rental Management Platform built with MERN Stack
</h3>

---

# 🌐 Live Demo

🚀 **Frontend Application**

🔗 https://carverse-india.vercel.app/


---

# 📌 About CarVerse

CarVerse is a full-stack car rental management system designed to provide a complete digital platform for vehicle rental operations.

The system allows customers to explore vehicles, manage bookings, maintain profiles, and interact with rental services.

Administrators can manage fleet vehicles, customers, bookings, categories, brands, reviews, and other rental operations through a dedicated management dashboard.

The project follows a modern MERN stack architecture with cloud deployment.


---

# 🚀 Deployment Architecture


```
                Users

                  |

                  |

          React + Vite Frontend

                Vercel

                  |

                  |

             REST API Calls

                  |

                  |

        Node.js + Express Backend

                Render

                  |

                  |

            MongoDB Atlas

              Database

```

---

# ✨ Features


## 👤 Customer Features

- User Registration
- User Login
- JWT Authentication
- Browse Cars
- Search Vehicles
- Filter Cars
- View Car Details
- Create Rental Booking
- Booking History
- Wishlist Management
- User Profile
- Reviews & Ratings


---

## 🔐 Admin Features

- Admin Authentication
- Dashboard Overview
- User Management
- Car/Fleet Management
- Brand Management
- Category Management
- Booking Management
- Payment Tracking
- Review Management
- Service Management
- Website Settings


---

# 🛠️ Technology Stack


## Frontend

- React.js
- Vite
- JavaScript ES6+
- React Router
- Axios
- Tailwind CSS
- Responsive UI Design


## Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- Mongoose
- Middleware Architecture
- Nodemailer


## Database

- MongoDB Atlas


## Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |


---

# 📂 Project Structure


```
CarVerse

│
├── Client
│
│   ├── src
│   │
│   ├── components
│   ├── pages
│   ├── services
│   ├── hooks
│   └── App.jsx
│
│
├── Server
│
│   ├── src
│   │
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── database
│
│   ├── server.js
│   └── package.json
│
│
└── README.md

```

---

# ⚙️ Installation Guide


## 1. Clone Repository


```bash
git clone https://github.com/Nikhil-beep25/CarVerse.git
```


Move into project:

```bash
cd CarVerse
```

---

# 💻 Frontend Setup


Navigate:

```bash
cd Client
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


Frontend URL:

```
http://localhost:5173
```


---

# ⚙️ Backend Setup


Navigate:

```bash
cd Server
```


Install dependencies:

```bash
npm install
```


Create `.env`:


```env
PORT=8000

MONGODB_URI=your_mongodb_atlas_connection

JWT_SECRET=your_secret_key

JWT_EXPIRE=30d

NODE_ENV=development
```


Run backend:


```bash
npm run dev
```


Backend URL:

```
http://localhost:8000
```


---

# 🔐 Authentication Flow


```
User Login

      |

      ↓

Backend verifies credentials

      |

      ↓

JWT Token Generated

      |

      ↓

Token Stored

      |

      ↓

Protected API Access

```

---

# 🗄️ Database Collections


MongoDB Database:

```
carverse
```


Collections:


```
users

cars

bookings

payments

reviews

wishlists

brands

categories

services

settings

faqs

features

```

---

# 🚀 Production Deployment


## Frontend Deployment (Vercel)


Live URL:

```
https://carverse-india.vercel.app/
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


```env
VITE_APP_BACKEND_SERVER=https://carverse-backend.onrender.com/api

VITE_APP_IMAGE_SERVER=https://carverse-backend.onrender.com/
```


---

# Backend Deployment (Render)


Backend URL:

```
https://carverse-backend.onrender.com
```


Start Command:


```
npm start
```


Environment Variables:


```env
PORT=8000

MONGODB_URI=mongodb_atlas_connection

JWT_SECRET=your_secret

NODE_ENV=production

CLIENT_URL=https://carverse-india.vercel.app
```


---

# 🔒 Security Implementation


Implemented:

- JWT Authentication
- Password Hashing
- Protected Routes
- Role Based Authorization
- Environment Variables
- Secure Database Connection
- API Validation


---

# 📈 Future Enhancements


- Online Payment Gateway
- Real-Time Booking Notifications
- Advanced Analytics Dashboard
- AI Car Recommendation
- Mobile Application
- GPS Vehicle Tracking


---

# 👨‍💻 Developer


## Nikhil Bhadauriya

Full Stack Developer


### Social Links

GitHub:

https://github.com/Nikhil-beep25


LinkedIn:

https://www.linkedin.com/in/nikhil-bhadauriya-308414321


YouTube:

https://www.youtube.com/@ItsNikhilTech


Instagram:

https://www.instagram.com/itsnikhil_tech


---

# ⭐ Project Status


```
Frontend       ✅ Deployed on Vercel

Backend        ✅ Deployed on Render

Database       ✅ MongoDB Atlas Connected

Authentication ✅ JWT Implemented

Booking System ✅ Implemented

```

---

⭐ If you like this project, consider giving it a star on GitHub.
