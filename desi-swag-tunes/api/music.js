import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const musicPath = path.join(process.cwd(), 'music.html');
    const content = fs.readFileSync(musicPath, 'utf-8');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
