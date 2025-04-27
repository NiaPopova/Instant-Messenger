const express = require('express');
const path = require('path');
const app = express();
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Instant Messenger Backend Running');
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});