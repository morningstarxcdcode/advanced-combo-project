#!/bin/bash

# Install dependencies and start backend, frontend, and data processor script

echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Starting backend server..."
cd ../backend
npm run dev &
BACKEND_PID=$!

echo "Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "Starting data processor script..."
cd ../scripts
node dataProcessor.js &
SCRIPT_PID=$!

echo "All services started."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Script PID: $SCRIPT_PID"

wait $BACKEND_PID
wait $FRONTEND_PID
wait $SCRIPT_PID
