// Dependencies
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // PostgreSQL client

// Configuration
const app = express();
const port = process.env.PORT || 3001;
const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432, // Default PostgreSQL port
});

app.use(cors());
app.use(express.json());

// JWT Secret
const secretKey = 'your_secret_key'; // Replace with a strong secret

// Route for User Registration
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const result = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
      [username, email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Route for User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.rows[0].id }, secretKey);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Route for creating a report
app.post('/reports', async (req, res) => {
  try {
    const {
      date,
      location,
      theme,
      coordinatorName,
      phone,
      email,
      attendees,
      salvation,
      sanctification,
      baptism,
      healing,
      others,
      totalBlessings,
      campusId,
    } = req.body;

    const result = await pool.query(
      'INSERT INTO reports (date, location, theme, coordinatorName, phone, email, attendees, salvation, sanctification, baptism, healing, others, totalBlessings, campusId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
      [
        date,
        location,
        theme,
        coordinatorName,
        phone,
        email,
        attendees,
        salvation,
        sanctification,
        baptism,
        healing,
        others,
        totalBlessings,
        campusId,
      ]
    );

    res.status(201).json({ message: 'Report created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating report' });
  }
});

// Route for retrieving reports
app.get('/reports', async (req, res) => {
  try {
    const { campusId, startDate, endDate, state } = req.query; // Get filter parameters
    let query = 'SELECT * FROM reports'; // Basic query

    let queryParams = [];
    if (campusId) {
      query += ' WHERE campusId = $1';
      queryParams.push(campusId);
    }
    if (startDate && endDate) {
      query += (campusId ? ' AND' : ' WHERE') + ' date BETWEEN $2 AND $3';
      queryParams.push(startDate, endDate);
    }
    if (state) {
      query += (campusId || startDate || endDate ? ' AND' : ' WHERE') + ' campusId IN (SELECT id FROM campuses WHERE state = $4)';
      queryParams.push(state);
    }

    const result = await pool.query(query, queryParams);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving reports' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});