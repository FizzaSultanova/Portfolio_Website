// Vercel serverless function: POST /api/contact
// The browser talks only to this endpoint (same origin, so no CORS problem).
// The function then forwards the message to FormSubmit from the server.
//
// Recipient: set CONTACT_EMAIL in Vercel → Project → Settings → Environment Variables
// (optional). If it is not set, the address below is used.

const DEFAULT_RECIPIENT = 'sultanovafizza@gmail.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 100, email: 200, message: 5000 };

// Remove line breaks from values that end up in the email subject / headers
const oneLine = (s) => String(s).replace(/[\r\n]+/g, ' ').trim();

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Body is parsed automatically for application/json, but handle a raw string just in case
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot: bots fill the hidden field. Pretend success and send nothing.
  if (body._honey) {
    return res.status(200).json({ success: true });
  }

  const name = oneLine(body.name || '');
  const email = oneLine(body.email || '');
  const message = String(body.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }
  if (name.length > MAX.name || email.length > MAX.email || message.length > MAX.message) {
    return res.status(400).json({ success: false, message: 'One of the fields is too long.' });
  }

  const recipient = process.env.CONTACT_EMAIL || DEFAULT_RECIPIENT;

  // Tell FormSubmit which site the request comes from (it uses this for its activation mail)
  const origin = req.headers.origin || (req.headers.host ? `https://${req.headers.host}` : '');

  try {
    const upstream = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(origin ? { Origin: origin, Referer: `${origin}/` } : {}),
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `New message from your portfolio — ${name}`,
        _replyto: email,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok || String(data.success) !== 'true') {
      console.error('FormSubmit error:', upstream.status, data);
      return res.status(502).json({
        success: false,
        message: data.message || 'The message could not be delivered.',
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(502).json({ success: false, message: 'The message could not be delivered.' });
  }
};