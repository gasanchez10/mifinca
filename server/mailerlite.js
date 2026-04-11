const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

export async function addSubscriber(whatsapp, name, fields = {}) {
  if (!MAILERLITE_API_KEY) {
    console.warn('[MailerLite] No MAILERLITE_API_KEY set. Skipping subscriber addition.');
    return;
  }

  if (!MAILERLITE_GROUP_ID) {
    console.warn('[MailerLite] No MAILERLITE_GROUP_ID set. Skipping subscriber addition.');
    return;
  }

  try {
    const email = fields.email || `whatsapp_${whatsapp.replace(/\D/g, '')}@mifinca.placeholder`;

    const body = {
      email,
      fields: {
        name,
        phone: whatsapp,
        company: fields.company || undefined,
      },
      groups: [MAILERLITE_GROUP_ID],
    };

    Object.keys(body.fields).forEach(
      (key) => body.fields[key] === undefined && delete body.fields[key]
    );

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      console.warn(`[MailerLite] Error adding subscriber: ${response.status} - ${error}`);
      return;
    }

    console.log(`[MailerLite] Subscriber added: ${name} (${email})`);
  } catch (error) {
    console.warn('[MailerLite] Error adding subscriber:', error.message);
  }
}
