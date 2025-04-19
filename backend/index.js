const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { registerUser, findUserByUsername, updateRefreshToken, findUserByRefreshToken } = require('./user');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

module.exports = app;

require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Use env variable in production

app.use(cors());
app.use(bodyParser.json());

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

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const newUser = await registerUser(username, password, role || 'user');
    res.status(201).json({ id: newUser.id, username: newUser.username, role: newUser.role });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '7d' });

    await updateRefreshToken(user.username, refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Refresh token endpoint
app.post('/api/token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  try {
    const user = await findUserByRefreshToken(token);
    if (!user) return res.sendStatus(403);

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const accessToken = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '15m' });
      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ message: 'Token refresh failed', error: err.message });
  }
});

// Logout endpoint
app.post('/api/logout', authenticateToken, async (req, res) => {
  try {
    await updateRefreshToken(req.user.username, null);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
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
