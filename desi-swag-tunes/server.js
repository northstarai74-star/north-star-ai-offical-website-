const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use((req, res, next) => {
  // Add headers for audio/video streaming
  res.setHeader('Accept-Ranges', 'bytes');
  if (req.path.endsWith('.mpeg')) {
    res.setHeader('Content-Type', 'audio/mpeg');
  } else if (req.path.endsWith('.mp4')) {
    res.setHeader('Content-Type', 'video/mp4');
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname), {
  maxAge: '1h'
}));

// Route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/music', (req, res) => {
  res.sendFile(path.join(__dirname, 'music.html'));
});

app.get('/music.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'music.html'));
});

// Catch-all for serving HTML files
app.get('*', (req, res, next) => {
  if (req.path.endsWith('.html')) {
    return res.sendFile(path.join(__dirname, req.path));
  }
  next();
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server Error', message: err.message });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎵 Desi Swag Tunes Music AI running on http://localhost:${PORT}`);
});

module.exports = app;
