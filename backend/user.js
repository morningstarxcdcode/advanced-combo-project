const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database(':memory:');

// Initialize users table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    refreshToken TEXT
  )`);
});

// Register user function
function registerUser(username, password, role = 'user') {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return reject(err);
      const stmt = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
      stmt.run(username, hashedPassword, role, function(err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, username, role });
      });
      stmt.finalize();
    });
  });
}

// Find user by username
function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// Update refresh token
function updateRefreshToken(username, refreshToken) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET refreshToken = ? WHERE username = ?', [refreshToken, username], function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

// Find user by refresh token
function findUserByRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE refreshToken = ?', [refreshToken], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = {
  registerUser,
  findUserByUsername,
  updateRefreshToken,
  findUserByRefreshToken,
};
