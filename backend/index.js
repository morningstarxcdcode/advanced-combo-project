const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

module.exports = app;

require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Use env variable in production

app.use(cors());
app.use(bodyParser.json());

// Simple in-memory user store for demo
const bcrypt = require('bcrypt');

const users = [
  { id: 1, username: 'admin', password: '$2b$10$7Q9v1Q6XQ6Q6Q6Q6Q6Q6QOQ6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6', role: 'admin' }, // password: password
  { id: 2, username: 'user', password: '$2b$10$7Q9v1Q6XQ6Q6Q6Q6Q6Q6QOQ6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6', role: 'user' }, // password: password
];

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const bcrypt = require('bcrypt');

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '7d' });

  // Store refresh token in memory (for demo purposes)
  user.refreshToken = refreshToken;

  res.json({ accessToken, refreshToken });
});

// Refresh token endpoint
app.post('/api/token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  const user = users.find(u => u.refreshToken === token);
  if (!user) return res.sendStatus(403);

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '15m' });
    res.json({ accessToken });
  });
});

// Logout endpoint
app.post('/api/logout', authenticateToken, (req, res) => {
  const user = users.find(u => u.username === req.user.username);
  if (user) {
    user.refreshToken = null;
  }
  res.sendStatus(204);
});

// Protected route example
app.get('/api/data', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected data.', user: req.user });
});

// Profile endpoint to return user info from JWT
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  ws.send(JSON.stringify({ message: 'Welcome to WebSocket server' }));

  ws.on('message', (message) => {
    console.log('Received:', message);
    // Echo message back
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
