# Recomm App Boilerplate

## Backend (Express + MongoDB)

1. `cd backend`
2. Copy `.env` and set your MongoDB URI if needed
3. Run `npm install`
4. Start server: `npm run dev`

## Frontend (Angular + TypeScript)

1. `cd frontend`
2. Run `npm install`
3. Start app: `npm start` (or `ng serve`)

## Notes
- The Angular app expects the backend to be running on the same host (proxy setup may be needed for development).
- Update MongoDB connection string in `backend/.env` as needed. 