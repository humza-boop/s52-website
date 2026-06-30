const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_TO = ['humza@schema52.com', 'kim@schema52.com'];
const FROM_ADDRESS = process.env.RESEND_FROM || 'Schema 52 Website <notifications@schema52.com>';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: 'Invalid JSON' });
      return;
    }
  }

  const name = (body?.name || '').toString().trim();
  const email = (body?.email || '').toString().trim();
  const company = (body?.company || '').toString().trim();
  const message = (body?.message || '').toString().trim();

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: NOTIFY_TO,
      reply_to: email,
      subject: `New lead: ${name}${company ? ` (${company})` : ''}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company) || '—'}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message) || '—'}</p>
      `,
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend send failed', err);
    res.status(502).json({ error: 'Failed to send notification' });
  }
};

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
