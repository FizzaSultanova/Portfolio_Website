// Vercel serverless function: POST /api/contact
// The browser talks only to this endpoint. The function validates the form and
// sends the message by email through Resend (https://resend.com) from the server.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY  (required)  your Resend API key, never put it in the browser code
//   CONTACT_EMAIL   (optional)  where messages go; defaults to the address below

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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ success: false, message: 'The message could not be delivered.' });
  }

  const recipient = process.env.CONTACT_EMAIL || DEFAULT_RECIPIENT;

  try {
    const upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [recipient],
        reply_to: email, // hitting "Reply" in your inbox answers the visitor
        subject: `New message from your portfolio — ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      console.error('Resend error:', upstream.status, data);
      return res.status(502).json({ success: false, message: 'The message could not be delivered.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(502).json({ success: false, message: 'The message could not be delivered.' });
  }
};