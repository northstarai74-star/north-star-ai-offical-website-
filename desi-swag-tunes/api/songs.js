import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const songFile = req.query.file || 'song1.mpeg';
    const songPath = path.join(process.cwd(), songFile);

    // Security check - prevent path traversal
    if (!songPath.startsWith(process.cwd())) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!fs.existsSync(songPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const stat = fs.statSync(songPath);
    const contentType = songFile.endsWith('.mp4') ? 'video/mp4' : 'audio/mpeg';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const stream = fs.createReadStream(songPath);
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
