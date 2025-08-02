# Testing Guide for QR Code Recommendation App

## Quick Setup

1. **Start the backend server:**
   ```bash
   ./start-backend.sh
   ```
   This will create the .env file and start the server on port 5000.

2. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Open the app in your browser:**
   ```
   http://localhost:4200
   ```

## Testing Steps

### 1. Register a New User
1. Go to `http://localhost:4200/register`
2. Fill out the registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Register"
4. You should be redirected to the dashboard

### 2. Test QR Code Generation
1. In the dashboard, click on the "QR Code" tab
2. Click "Generate QR Code"
3. You should see a QR code image appear
4. The QR code should contain a recommendation URL

### 3. Test Recommendation Form
1. Copy the recommendation URL from the QR code
2. Open it in a new browser tab or incognito window
3. You should see a form asking for:
   - Name of recommendation
   - Link to recommendation
   - Optional description
4. Fill out the form and submit
5. You should see a success message

### 4. Test Viewing Recommendations
1. Go back to the dashboard
2. Click on the "Recommendations" tab
3. Click "View Recommendations"
4. You should see the recommendation you just submitted

## Troubleshooting

### If you get 403 Forbidden errors:
- Make sure you're logged in first
- Check that the backend server is running on port 5000
- Check the browser console for detailed error messages

### If you get CORS errors:
- Make sure the backend server is running
- Check that the frontend is making requests to `localhost:5000`
- Verify the .env file exists in the backend directory

### If QR codes don't generate:
- Make sure you're authenticated (logged in)
- Check the browser console for error messages
- Try refreshing the page and logging in again

## Common Issues

1. **Backend not running**: Start with `./start-backend.sh`
2. **Not logged in**: Register or login first
3. **MongoDB not running**: Install and start MongoDB locally, or use MongoDB Atlas
4. **Port conflicts**: Make sure ports 5000 and 4200 are available

## Debug Information

The app now includes:
- Health checks for backend connectivity
- Authentication checks before QR code operations
- Better error messages
- Retry buttons for connection issues
- Console logging for debugging

Check the browser console (F12) for detailed error messages and debugging information. 