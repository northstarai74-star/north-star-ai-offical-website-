// Booking handler used by BOTH the Vercel serverless function (in production)
// and the local Express dev server (server.js). Same (req, res) signature works
// in both because Vercel's Node runtime and Express share res.status().json()
// and populate req.body from a JSON request body.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const AIRTABLE_API_KEY = (process.env.AIRTABLE_API_KEY || '').trim();
  // Strip surrounding whitespace and stray slashes so a value pasted as
  // e.g. "tblXXXX/" still produces a valid Airtable URL.
  const AIRTABLE_BASE_ID = (process.env.AIRTABLE_BASE_ID || '').trim().replace(/\/+$/, '');
  const AIRTABLE_TABLE_ID = (process.env.AIRTABLE_TABLE_ID || '').trim().replace(/^\/+|\/+$/g, '');

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    return res.status(503).json({ error: 'Booking storage is not configured' });
  }

  const fieldClinicName = process.env.AIRTABLE_FIELD_CLINIC_NAME || 'Clinic Name';
  const fieldContactPerson = process.env.AIRTABLE_FIELD_CONTACT_PERSON || 'Contact Person';
  const fieldEmail = process.env.AIRTABLE_FIELD_EMAIL || 'Email';
  const fieldPhone = process.env.AIRTABLE_FIELD_PHONE || 'Phone Number';
  const fieldLocation = process.env.AIRTABLE_FIELD_LOCATION || 'Clinic Location';

  // Vercel usually parses JSON bodies, but guard against a raw string body.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const { clinic_name, contact_person, email, phone, location } = body;

  if (!clinic_name || !contact_person || !email || !phone || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (phone.replace(/\D/g, '').length < 7) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const airtableData = {
    records: [{
      fields: {
        [fieldClinicName]: clinic_name,
        [fieldContactPerson]: contact_person,
        [fieldEmail]: email,
        [fieldPhone]: phone,
        [fieldLocation]: location
      }
    }]
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        },
        body: JSON.stringify(airtableData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable error:', errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const result = await response.json();
    console.log('Booking saved to Airtable:', result.records[0].id);

    return res.json({ success: true, recordId: result.records[0].id });
  } catch (error) {
    console.error('Server error saving booking:', error);
    return res.status(500).json({ error: 'Failed to save booking' });
  }
};
