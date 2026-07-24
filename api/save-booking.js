// Booking handler used by BOTH the Vercel serverless function (in production)
// and the local Express dev server (server.js). Same (req, res) signature works
// in both because Vercel's Node runtime and Express share res.status().json()
// and populate req.body from a JSON request body.

// Each logical form field maps to an Airtable column. Resolution order:
//   1. An explicit AIRTABLE_FIELD_* env var (exact override), else
//   2. Auto-detected from the target table's real column names (aliases below),
//      so this keeps working when a base uses "Name" / "Contact Person" / "Name ",
//      else
//   3. The first alias as a sensible default.
const FIELD_SPECS = {
  clinic_name:    { env: 'AIRTABLE_FIELD_CLINIC_NAME',    aliases: ['Clinic Name', 'Clinic', 'Practice Name', 'Practice'] },
  contact_person: { env: 'AIRTABLE_FIELD_CONTACT_PERSON', aliases: ['Contact Person', 'Contact Name', 'Contact', 'Full Name', 'Name'] },
  email:          { env: 'AIRTABLE_FIELD_EMAIL',          aliases: ['Email', 'Email Address', 'E-mail', 'Mail'] },
  phone:          { env: 'AIRTABLE_FIELD_PHONE',          aliases: ['Phone Number', 'Phone', 'Phone No', 'Contact Number', 'Mobile', 'Telephone'] },
  location:       { env: 'AIRTABLE_FIELD_LOCATION',       aliases: ['Clinic Location', 'Location', 'Address', 'City', 'Postcode', 'Post Code'] }
};

// Airtable field types that are computed/read-only and cannot be written to.
const READ_ONLY_TYPES = new Set([
  'formula', 'rollup', 'count', 'lookup', 'multipleLookupValues',
  'createdTime', 'createdBy', 'lastModifiedTime', 'lastModifiedBy',
  'autoNumber', 'aiText', 'button'
]);

const normalize = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').trim();

// Cache the resolved column map per base+table so we don't hit the schema API
// on every request (only on a cold start or after the TTL).
const schemaCache = new Map();
const SCHEMA_TTL_MS = 5 * 60 * 1000;

async function fetchWritableColumnNames(apiKey, baseId, tableId) {
  const res = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  if (!res.ok) return null; // e.g. token lacks schema.bases:read scope
  const data = await res.json();
  const table = (data.tables || []).find((t) => t.id === tableId || t.name === tableId);
  if (!table) return null;
  return table.fields.filter((f) => !READ_ONLY_TYPES.has(f.type)).map((f) => f.name);
}

async function resolveColumnMap(apiKey, baseId, tableId) {
  const cacheKey = `${baseId}/${tableId}`;
  const cached = schemaCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < SCHEMA_TTL_MS) return cached.map;

  let actualNames = null;
  try {
    actualNames = await fetchWritableColumnNames(apiKey, baseId, tableId);
  } catch {
    actualNames = null;
  }

  const byNormalized = new Map();
  if (actualNames) {
    for (const name of actualNames) byNormalized.set(normalize(name), name);
  }

  const map = {};
  for (const [key, spec] of Object.entries(FIELD_SPECS)) {
    const override = (process.env[spec.env] || '').trim();
    if (override) {
      map[key] = override;
      continue;
    }
    let resolved = null;
    if (actualNames) {
      for (const alias of spec.aliases) {
        const hit = byNormalized.get(normalize(alias));
        if (hit) { resolved = hit; break; }
      }
    }
    map[key] = resolved || spec.aliases[0];
  }

  // Only cache when we actually read the schema, so a transient failure
  // (or a token missing schema scope) is retried on the next request.
  if (actualNames) schemaCache.set(cacheKey, { map, ts: Date.now() });
  return map;
}

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

  const col = await resolveColumnMap(AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID);

  const airtableData = {
    // typecast lets Airtable coerce values (e.g. text -> single select) instead
    // of rejecting the whole record.
    typecast: true,
    records: [{
      fields: {
        [col.clinic_name]: clinic_name,
        [col.contact_person]: contact_person,
        [col.email]: email,
        [col.phone]: phone,
        [col.location]: location
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
