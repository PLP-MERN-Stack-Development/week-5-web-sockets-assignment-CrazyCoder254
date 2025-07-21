# Real-Time Chat Application

![Chat Application Screenshot](./screenshot.png) <!-- Add your screenshot path here -->

A full-stack real-time chat application built with React, Socket.io, Express, and MongoDB. This application features real-time messaging, user authentication, multiple chat rooms, private messaging, typing indicators, and more.

## Features

- **User Authentication**: Sign up and log in with JWT-based authentication
- **Real-Time Messaging**: Instant message delivery using Socket.io
- **Multiple Chat Rooms**: Join existing rooms or create new ones
- **Private Messaging**: One-on-one conversations with other users
- **Typing Indicators**: See when others are typing
- **Online Status**: Real-time user presence tracking
- **Message Read Receipts**: See when your messages are read
- **Notifications**: Browser and sound notifications for new messages
- **Responsive Design**: Works on both desktop and mobile devices

## Technologies Used

### Frontend
- React (Vite)
- Tailwind CSS
- Socket.io Client
- React Router
- React Context API

### Backend
- Node.js
- Express
- Socket.io
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT)
- Bcrypt.js

## Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (running locally or connection string)
- Git

### Setup Instructions

1. **Clone the repository:**
git clone https://github.com/your-username/real-time-chat.git
cd real-time-chat

Set up the backend:
cd server
npm install
Create a .env file in the server directory:

env
MONGO_URI=mongodb://localhost:27017/chatdb
JWT_SECRET=your_secure_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:5173

Set up the frontend:
cd ../client
cd /web-sockets
npm install
Create a .env file in the client directory:

env
VITE_SOCKET_URL=http://localhost:5000

Start the application:


# Start MongoDB (in a separate terminal)
mongod

# Start backend server
cd ../server
npm start

# Start frontend
cd ../client
cd /web-sckets
npm run dev
Access the application:
Open your browser and go to http://localhost:5173

Project Structure
text
real-time-chat/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Room.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── messageRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── socketService.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── .env
│   └── server.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ChatLayout.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── UserList.jsx
│   │   │   └── RoomList.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Chat.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
API Endpoints
Authentication
POST /api/auth/signup - Register a new user

POST /api/auth/login - Log in an existing user

POST /api/auth/logout - Log out the current user

Users
GET /api/users - Get all users

GET /api/users/:id - Get a specific user

Messages
GET /api/messages - Get messages for a room

GET /api/messages/private/:userId1/:userId2 - Get private messages between two users

Deployment
Backend Deployment
Create an account on a cloud provider (Render, Railway, Heroku)

Set environment variables in your deployment platform:

MONGO_URI - Your MongoDB connection string

JWT_SECRET - Your secure JWT secret

PORT - Port to run the server (usually 5000)

CLIENT_URL - URL of your deployed frontend

Connect your GitHub repository

Deploy!

Frontend Deployment
Create an account on a static hosting provider (Vercel, Netlify, GitHub Pages)

Connect your GitHub repository

Set environment variables:

VITE_SOCKET_URL - URL of your deployed backend

Deploy!

Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a new branch (git checkout -b feature/your-feature)

Commit your changes (git commit -am 'Add some feature')

Push to the branch (git push origin feature/your-feature)

Create a new Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
Socket.io for real-time communication

MongoDB for data storage

Vite for fast frontend development

Tailwind CSS for styling
