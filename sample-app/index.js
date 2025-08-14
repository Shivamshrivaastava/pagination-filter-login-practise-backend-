const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Mock "database"
let users = [];
const items = [
  'Apple',
  'Banana',
  'Grapes',
  'Mango',
  'Orange',
  'Pineapple',
  'Papaya',
  'Berry',
  'Kiwi',
  'Lemon',
  'Watermelon',
  'Lychee',
];

// ---------------- AUTH ENDPOINTS ----------------

// Signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  users.push({ username, password }); // NOTE: In real life, use password hashing
  res.json({ message: 'Signup successful!' });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({ message: 'Login successful!' });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// ---------------- PAGINATION + SEARCH ----------------

// GET items with optional search & pagination
app.get('/items', (req, res) => {
  let { search = '', page = 1, limit = 5 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  // Search filter
  let filtered = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  res.json({
    totalItems: filtered.length,
    page,
    limit,
    data: paginated,
  });
});
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
