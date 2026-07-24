require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || false }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
  console.error('Error: Missing Airtable credentials in .env file');
  process.exit(1);
}

const AIRTABLE_FIELD_CLINIC_NAME = process.env.AIRTABLE_FIELD_CLINIC_NAME || 'Clinic Name';
const AIRTABLE_FIELD_CONTACT_PERSON = process.env.AIRTABLE_FIELD_CONTACT_PERSON || 'Name ';
const AIRTABLE_FIELD_EMAIL = process.env.AIRTABLE_FIELD_EMAIL || 'Email';
const AIRTABLE_FIELD_PHONE = process.env.AIRTABLE_FIELD_PHONE || 'Phone number ';
const AIRTABLE_FIELD_LOCATION = process.env.AIRTABLE_FIELD_LOCATION || 'location ';

app.post('/api/save-booking', async (req, res) => {
  const { clinic_name, contact_person, email, phone, location } = req.body;

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
        [AIRTABLE_FIELD_CLINIC_NAME]: clinic_name,
        [AIRTABLE_FIELD_CONTACT_PERSON]: contact_person,
        [AIRTABLE_FIELD_EMAIL]: email,
        [AIRTABLE_FIELD_PHONE]: phone,
        [AIRTABLE_FIELD_LOCATION]: location
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

    res.json({
      success: true,
      recordId: result.records[0].id
    });
  } catch (error) {
    console.error('Server error saving booking:', error);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
