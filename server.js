const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = 3000;

app.use(express.static('public'));

app.get('/search', (req, res) => {
  const query = req.query.query?.toLowerCase() || '';
  const channel = req.query.channel || 'all';

  const filePath = path.join(__dirname, 'messages.json');
  const rawData = fs.readFileSync(filePath);
  const messages = JSON.parse(rawData);

  const filtered = messages.filter(msg => {
    const matchesQuery = query === '' || msg.message.toLowerCase().includes(query);
    const matchesChannel = channel === 'all' || msg.channelId === channel;
    return matchesQuery && matchesChannel;
  });

  res.json(filtered);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
