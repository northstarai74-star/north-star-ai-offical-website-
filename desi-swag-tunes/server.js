const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.header('Accept-Ranges', 'bytes');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve static files from current directory
app.use(express.static(path.join(__dirname), {
  dotfiles: 'ignore',
  maxAge: '1d'
}));

// Root route
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(filePath);
  } else {
    res.status(404).send('index.html not found');
  }
});

// Music route
app.get('/music', (req, res) => {
  const filePath = path.join(__dirname, 'music.html');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(filePath);
  } else {
    res.status(404).send('music.html not found');
  }
});

// Serve music.html
app.get('/music.html', (req, res) => {
  const filePath = path.join(__dirname, 'music.html');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(filePath);
  } else {
    res.status(404).send('music.html not found');
  }
});

// Serve audio files with streaming support
['song1.mpeg', 'song2.mpeg', 'song3.mpeg', 'song4.mpeg'].forEach(file => {
  app.get(`/${file}`, (req, res) => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Accept-Ranges', 'bytes');
      res.sendFile(filePath);
    } else {
      res.status(404).send(`${file} not found`);
    }
  });
});

// Serve video file
app.get('/song5.mp4', (req, res) => {
  const filePath = path.join(__dirname, 'song5.mp4');
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Accept-Ranges', 'bytes');
    res.sendFile(filePath);
  } else {
    res.status(404).send('song5.mp4 not found');
  }
});

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Server Error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎵 Desi Swag Tunes running on port ${PORT}`);
});

module.exports = app;
