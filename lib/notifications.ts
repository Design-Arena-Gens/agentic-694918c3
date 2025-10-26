import nodemailer from 'nodemailer';

export async function sendEmailAlert(to: string, subject: string, body: string) {
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT;
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailHost || !emailUser || !emailPassword) {
    console.log('Email configuration not found, skipping email notification');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: parseInt(emailPort || '587'),
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    await transporter.sendMail({
      from: emailUser,
      to,
      subject,
      text: body,
      html: `<pre>${body}</pre>`,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export async function sendWhatsAppAlert(to: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !fromNumber) {
    console.log('WhatsApp configuration not found, skipping WhatsApp notification');
    return;
  }

  try {
    // Using Twilio WhatsApp API
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: `whatsapp:${to}`,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }

    console.log(`WhatsApp sent to ${to}`);
  } catch (error) {
    console.error('Failed to send WhatsApp:', error);
    throw error;
  }
}
