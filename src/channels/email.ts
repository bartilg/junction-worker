export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail(
  { to, subject, body }: EmailPayload,
  env: Env
): Promise<Response> {
  const apiKey = env.SENDGRID_API_KEY; // Set in Wrangler secrets

  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: "bart@bartilg.dev", name: "Bart" },
    subject,
    content: [{ type: "text/plain", value: body }],
  };

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    //const errorText = await response.text();
    throw new Error(`Email failed: ${response.status} - ${errorText}`);
  }

  return response;
}
