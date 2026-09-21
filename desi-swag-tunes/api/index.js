import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    let filePath;
    const requestPath = req.url.split('?')[0];

    // Route handling
    if (requestPath === '/' || requestPath === '') {
      filePath = path.join(process.cwd(), 'index.html');
    } else if (requestPath === '/music' || requestPath === '/music.html') {
      filePath = path.join(process.cwd(), 'music.html');
    } else if (requestPath.match(/\.(mpeg|mp4)$/)) {
      // Handle audio/video file requests
      filePath = path.join(process.cwd(), requestPath);

      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        const contentType = requestPath.endsWith('.mp4') ? 'video/mp4' : 'audio/mpeg';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=86400');

        const stream = fs.createReadStream(filePath);
        return stream.pipe(res);
      }

      return res.status(404).json({ error: 'Audio file not found' });
    } else {
      // Try to serve as static file
      filePath = path.join(process.cwd(), requestPath);
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // If it's an HTML request, serve index.html
      if (requestPath.endsWith('.html') || !requestPath.includes('.')) {
        filePath = path.join(process.cwd(), 'index.html');
      } else {
        return res.status(404).json({ error: 'Not found' });
      }
    }

    // Read and serve the file
    const content = fs.readFileSync(filePath, 'utf-8');
    const contentType = filePath.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain';

    res.setHeader('Content-Type', contentType);
    res.status(200).send(content);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
