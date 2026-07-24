// Local development server only.
// In production on Vercel, the static files are served directly by Vercel's
// CDN and api/save-booking.js runs as a serverless function — this file is
// not used there. It just reproduces that setup locally for `npm run dev`.
require('dotenv').config();
const express = require('express');
const path = require('path');
const saveBooking = require('./api/save-booking');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.all('/api/save-booking', (req, res) => saveBooking(req, res));

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
