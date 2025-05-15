// src/routes/send.ts
import { sendEmail } from '../channels/email';

export async function handleSend(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response('Unsupported Media Type', { status: 415 });
  }

  let body: { to: string; subject: string; body: string };
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { to, subject, body: messageBody } = body;
  if (!to || !subject || !messageBody) {
    return new Response('Missing required fields', { status: 400 });
  }

  try {
    const result = await sendEmail({ to, subject, body: messageBody }, env);
    return new Response(JSON.stringify({ status: 'sent', result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to send email' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

