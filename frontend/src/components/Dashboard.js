import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

function Dashboard({ user, onLogout, socket }) {
  const [dataPoints, setDataPoints] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const message = event.data;
      try {
        const parsed = JSON.parse(message);
        if (parsed.value !== undefined) {
          setDataPoints((prev) => [...prev.slice(-19), { timestamp: new Date(parsed.timestamp).toLocaleTimeString(), value: parsed.value }]);
        } else {
          setNotifications((prev) => [...prev, message]);
        }
      } catch {
        setNotifications((prev) => [...prev, message]);
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket]);

  return (
    <div className="container">
      <h1>Welcome, {user?.username}</h1>
      <button onClick={onLogout}>Logout</button>

      <h2>Real-time Data Visualization</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataPoints}>
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h2>Notifications</h2>
      <ul className="notification-list">
        {notifications.map((note, idx) => (
          <li key={idx}>{note}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
