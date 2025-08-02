#!/bin/bash

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "Creating .env file..."
    cat > backend/.env << EOF
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGO_URI=mongodb://localhost:27017/recomm_app
PORT=5000
EOF
fi

# Start the backend server
echo "Starting backend server..."
cd backend
npm start 