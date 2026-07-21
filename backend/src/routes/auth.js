const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Simulated database (replace with actual DB queries)
const users = new Map();

// Register
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;

  if (users.has(email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.set(email, {
      email,
      name,
      password: hashedPassword,
      plan: 'free',
      createdAt: new Date()
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = users.get(email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email, name: user.name, plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        email,
        name: user.name,
        plan: user.plan
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
  const user = users.get(req.user.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    email: user.email,
    name: user.name,
    plan: user.plan,
    createdAt: user.createdAt
  });
});

module.exports = router;
