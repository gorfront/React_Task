# Product App

A full-stack product management application with a React/Next.js frontend and an Express/TypeScript backend.

---

## Table of Contents

- [Setup](#setup)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Running the Project](#running-the-project)
- [Notes](#notes)

---

## Setup

### Frontend

1. Navigate to the frontend folder:

   ```bash
   cd client

2. Copy the example environment file and update the API URL if needed:

```bash
cp .env.example .env.local
```

3. Edit .env.local to set your backend API URL:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Replace http://localhost:5000/api with the backend URL if different.

4. Install dependencies:

```bash
npm install
```

### Backend
1. Navigate to the backend folder:

```bash
cd server
```

2. Create a .env file in the server directory (do not commit this file) with the following variables:
```bash
.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/product-app
JWT_SECRET=your_secret_key
```
Adjust values as needed for your environment.

3. Install dependencies:

```bash
npm install
```

4. Build the TypeScript code:

```bash
npm run build
```

### Environment Variables
Variable	                       Description	                              Example

NEXT_PUBLIC_API_URL	Frontend:      Base URL for backend API	                  http://localhost:5000/api
PORT	                           Backend: Port number server listens on	  5000
MONGO_URI	                       Backend: MongoDB connection string	      mongodb://localhost:27017/product-app
JWT_SECRET	                       Backend: Secret key for JWT tokens	      super_secret_jwt_key

### Scripts
### Frontend

1. npm run dev — Run frontend in development mode
2. npm run build — Build frontend for production
3. npm start — Start frontend production server
4. npm run lint — Run linter

### Backend

1. npm run dev — Run backend in development mode with nodemon
2. npm run build — Compile TypeScript to JavaScript
3. npm start — Run backend production server (compiled JS)
4. npm run seed — Seed database (if applicable)

### Running the Project

1. Start MongoDB server locally or use a cloud MongoDB instance.

2. Start backend server:

```bash
cd server
npm install
npm run build
npm start
```
3. Start frontend server:

```bash
cd client
npm install
npm run dev
```

4. Open your browser at http://localhost:3000

### Notes
1. Do not commit your .env or .env.local files to version control; they contain sensitive information.
2. Adjust API URLs in the frontend .env.local depending on your backend server address.
3. Use a process manager like pm2 to keep your backend running in production.
4. For production deployment, configure reverse proxy (e.g., nginx) and HTTPS.

If you have any questions or need help with deployment, feel free to open an issue!