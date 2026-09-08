## API & Integration

- REST API integration using Axios
- Production frontend and backend integration
- MongoDB Atlas integration through Mongoose
- JWT-protected project and task routes

## Project Status

- Development complete
- Deployment complete
- Live testing complete
- README complete
- Ready for final submission

NOVA is deployed on Render with the React frontend, Express backend, and MongoDB Atlas database connected for production use.
# NOVA — Team Productivity Platform

> **Plan. Collaborate. Deliver.**

NOVA is a full-stack project management application that helps teams organize projects, manage tasks, collaborate with team members, and track project progress from a single workspace.

---

## 🚀 Live Demo

### Frontend
https://nova-frontend-i8d4.onrender.com

### Backend API
https://nova-backend-n2ez.onrender.com

### GitHub Repository
https://github.com/perfectcse/nova

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- Secure password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Persistent authentication using browser storage
- Logout functionality

### 📁 Project Management

- Create projects
- View projects
- Edit project information
- Delete projects
- Set project status
- Set project start date
- Set project due date
- Assign project members
- Track project progress
- Project ownership and authorization

### ✅ Task Management

- Create tasks
- View tasks by project
- Edit tasks
- Delete tasks
- Update task status
- Set task priority
- Assign tasks to team members
- Set task due dates
- Track completed and pending tasks

### 👥 Team Collaboration

- View available users
- Add members to projects
- Remove project members
- Display project members
- Prevent duplicate members
- Prevent project owners from adding themselves as members

### 📊 Dashboard

- Total projects
- Total tasks
- Completed tasks
- Team member count
- Project progress indicators
- Project overview cards
- Project status visibility

### 🎨 User Experience

- Clean and modern UI
- Responsive design
- Loading states
- Error handling
- Form validation
- Empty states
- Mobile-friendly layouts
- Desktop-friendly layouts

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript (ES6+)
- CSS3
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Database

- MongoDB Atlas

### Development & Deployment

- Git
- GitHub
- GitHub Desktop
- Render

---

## 🏗️ Project Structure

```text
nova/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── service/
│   │   │   └── api.js
│   │   ├── styles/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md