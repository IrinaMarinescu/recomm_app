# Recommendation App with Authentication

A full-stack recommendation application with user authentication and signup functionality.

## Features

- **User Authentication**: Secure login and registration system
- **JWT Tokens**: Stateless authentication using JSON Web Tokens
- **Password Hashing**: Secure password storage using bcrypt
- **Modern UI**: Beautiful Angular Material design
- **Responsive Design**: Works on desktop and mobile devices
- **Protected Routes**: Secure access to authenticated content

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **Angular 20** with standalone components
- **Angular Material** for UI components
- **Angular Router** for navigation
- **Angular Forms** with reactive forms
- **HTTP Interceptors** for automatic token handling

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   MONGO_URI=mongodb://localhost:27017/recomm_app
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be running on `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Health Check
- `GET /api/health` - Server health check

### Protected Routes
- `GET /api/protected` - Example protected route

## Usage

1. **Registration**: Visit `/register` to create a new account
2. **Login**: Visit `/login` to sign in to your account
3. **Dashboard**: After authentication, you'll be redirected to `/dashboard`
4. **Logout**: Use the logout button in the dashboard

## Project Structure

```
recomm_app/
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   └── auth.js
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── dashboard/
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   └── app.ts
│   │   └── styles.css
│   └── package.json
└── README.md
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure, stateless authentication
- **Input Validation**: Server-side validation using express-validator
- **CORS**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables

## Development

### Backend Development
- The server uses nodemon for automatic restarts during development
- MongoDB connection with error handling
- Comprehensive error handling and logging

### Frontend Development
- Angular standalone components for better tree-shaking
- Reactive forms with validation
- HTTP interceptors for automatic token management
- Responsive design with Angular Material

## Production Deployment

### Backend
1. Set proper environment variables
2. Use a production MongoDB instance
3. Configure proper CORS settings
4. Use a process manager like PM2

### Frontend
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure proper API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 