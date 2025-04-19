import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './App.css';

const socket = io('http://localhost:4000');

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('http://localhost:4000/api/profile')
        .then(res => setUser(res.data.user))
        .catch(() => {
          setUser(null);
          setToken('');
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} socket={socket} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
