const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(__dirname));

// Serve static files (HTML, CSS, JS, media)
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/music', (req, res) => {
  res.sendFile(path.join(__dirname, 'music.html'));
});

// Serve audio files
app.get('/song1.mpeg', (req, res) => {
  res.sendFile(path.join(__dirname, 'song1.mpeg'));
});

app.get('/song2.mpeg', (req, res) => {
  res.sendFile(path.join(__dirname, 'song2.mpeg'));
});

app.get('/song3.mpeg', (req, res) => {
  res.sendFile(path.join(__dirname, 'song3.mpeg'));
});

app.get('/song4.mpeg', (req, res) => {
  res.sendFile(path.join(__dirname, 'song4.mpeg'));
});

app.get('/song5.mp4', (req, res) => {
  res.sendFile(path.join(__dirname, 'song5.mp4'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Server Error');
});

app.listen(PORT, () => {
  console.log(`🎵 Desi Swag Tunes Music AI running on http://localhost:${PORT}`);
  console.log(`🎧 Home: http://localhost:${PORT}/`);
  console.log(`🎼 Music: http://localhost:${PORT}/music.html`);
});
