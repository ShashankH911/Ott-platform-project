const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // 🔁 your MySQL username
  password: 'root1',      // 🔁 your MySQL password
  database: 'ott_platform'
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to MySQL database: ott_platform');
  }
});

// ✅ SIGNUP route
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const checkUserQuery = 'SELECT * FROM app WHERE email = ?';
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const insertUser = 'INSERT INTO app (name, email, password) VALUES (?, ?, ?)';
    db.query(insertUser, [name, email, password], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Insert failed' });

      return res.status(201).json({ success: true, message: 'User created successfully' });
    });
  });
});

// ✅ LOGIN route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const loginQuery = 'SELECT * FROM app WHERE email = ? AND password = ?';
  db.query(loginQuery, [email, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });

    if (results.length > 0) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});