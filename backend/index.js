require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`);
    console.log('Connected to SQLite database');
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
    res.json({ accessToken });
  });
});

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}`, user: req.user });
});

// Create HTTP server and Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('Client connected to Socket.io');

  socket.on('message', (message) => {
    console.log('Received:', message);
    // Echo message back for demo
    socket.emit('message', `Server received: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from Socket.io');
  });
});

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

module.exports = { app, io, db };
