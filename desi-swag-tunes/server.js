const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// CORS and headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.header('Accept-Ranges', 'bytes');
  res.header('Cache-Control', 'public, max-age=3600');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Static files middleware - serve everything in the directory
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.mpeg')) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Accept-Ranges', 'bytes');
    } else if (filepath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
    } else if (filepath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    baseDir: __dirname
  });
});

// File check endpoint
app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync(__dirname);
    const audioFiles = files.filter(f => f.match(/\.(mpeg|mp4|html)$/));
    const fileInfo = {};

    audioFiles.forEach(file => {
      const stat = fs.statSync(path.join(__dirname, file));
      fileInfo[file] = {
        size: stat.size,
        sizeInMB: (stat.size / (1024 * 1024)).toFixed(2),
        exists: true
      };
    });

    res.json({ files: fileInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Music route
app.get('/music', (req, res) => {
  res.sendFile(path.join(__dirname, 'music.html'));
});

app.get('/music.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'music.html'));
});

// Audio files - explicit routes with streaming
const audioFiles = [
  { name: 'song1.mpeg', type: 'audio/mpeg' },
  { name: 'song2.mpeg', type: 'audio/mpeg' },
  { name: 'song3.mpeg', type: 'audio/mpeg' },
  { name: 'song4.mpeg', type: 'audio/mpeg' },
  { name: 'song5.mp4', type: 'video/mp4' }
];

audioFiles.forEach(({ name, type }) => {
  app.get(`/${name}`, (req, res) => {
    const filePath = path.join(__dirname, name);

    try {
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return res.status(404).json({ error: `${name} not found` });
      }

      const stat = fs.statSync(filePath);
      const fileSize = stat.size;

      // Handle range requests for streaming
      const range = req.headers.range;

      res.setHeader('Content-Type', type);
      res.setHeader('Content-Length', fileSize);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=86400');

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;

        res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        res.setHeader('Content-Length', chunksize);
        res.status(206);

        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);
      } else {
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
      }
    } catch (error) {
      console.error(`Error serving ${name}:`, error);
      res.status(500).json({ error: error.message });
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    message: 'Endpoint does not exist'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Server Error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎵 Desi Swag Tunes running on port ${PORT}`);
  console.log(`📁 Base directory: ${__dirname}`);

  // Log available files
  try {
    const files = fs.readdirSync(__dirname);
    const audioFiles = files.filter(f => f.match(/\.(mpeg|mp4)$/));
    console.log(`🎧 Audio files available: ${audioFiles.join(', ')}`);
  } catch (e) {
    console.error('Error listing files:', e.message);
  }
});

module.exports = app;
