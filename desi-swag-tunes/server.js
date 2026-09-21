const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

// Serve static files with proper headers for audio streaming
app.use(express.static(__dirname, {
  setHeaders: (res, filePath, stat) => {
    if (filePath.endsWith('.mpeg') || filePath.endsWith('.mp4')) {
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Type', filePath.endsWith('.mpeg') ? 'audio/mpeg' : 'video/mp4');
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/music.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'music.html'));
});

app.get('/music', (req, res) => {
  res.sendFile(path.join(__dirname, 'music.html'));
});

// Serve audio files with streaming support
app.get('/song1.mpeg', (req, res) => {
  const filePath = path.join(__dirname, 'song1.mpeg');
  const stat = fs.statSync(filePath);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Length', stat.size);
  res.sendFile(filePath);
});

app.get('/song2.mpeg', (req, res) => {
  const filePath = path.join(__dirname, 'song2.mpeg');
  const stat = fs.statSync(filePath);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Length', stat.size);
  res.sendFile(filePath);
});

app.get('/song3.mpeg', (req, res) => {
  const filePath = path.join(__dirname, 'song3.mpeg');
  const stat = fs.statSync(filePath);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Length', stat.size);
  res.sendFile(filePath);
});

app.get('/song4.mpeg', (req, res) => {
  const filePath = path.join(__dirname, 'song4.mpeg');
  const stat = fs.statSync(filePath);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Length', stat.size);
  res.sendFile(filePath);
});

app.get('/song5.mp4', (req, res) => {
  const filePath = path.join(__dirname, 'song5.mp4');
  const stat = fs.statSync(filePath);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Length', stat.size);
  res.sendFile(filePath);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Server Error');
});

const server = app.listen(PORT, () => {
  console.log(`🎵 Desi Swag Tunes Music AI running on http://localhost:${PORT}`);
  console.log(`🎧 Home: http://localhost:${PORT}/`);
  console.log(`🎼 Music: http://localhost:${PORT}/music.html`);
});

module.exports = app;
