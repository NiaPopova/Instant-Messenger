const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const USERS_FILE = path.join(__dirname, '../users.json');

function getUsers() {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, '[]');
    }
  
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

const { v4: uuidv4 } = require('uuid');

router.post('/register', (req, res) => {
  const { username, password, email, name } = req.body;
  
  if (!username || username.length < 4) {
    return res.status(400).json({ message: "Username must be at least 4 characters." });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: "Invalid email address." });
  }
  if (!name || name.length < 3) {
    return res.status(400).json({ message: "Name must be at least 3 characters." });
  }

  const users = getUsers();

  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const newUser = {
    id: uuidv4(),         
    username: username,
    password: password,
    email: email,
    name: name,
    lastActivity: new Date().toISOString(),
    profilePicture: "uploads/default.png"
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: 'User registered', user: newUser });
});

router.get('/profile/:username', (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.username === req.params.username);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;