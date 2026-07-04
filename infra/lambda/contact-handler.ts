import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({});

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
};

const allowedOrigin = process.env.ALLOWED_ORIGIN ?? "*";
const toAddress = process.env.CONTACT_TO_ADDRESS;
const fromAddress = process.env.CONTACT_FROM_ADDRESS;

function response(statusCode: number, body: Record<string, unknown>) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function parseBody(body: string | null | undefined): ContactPayload {
  if (!body) return {};

  try {
    return JSON.parse(body) as ContactPayload;
  } catch {
    const params = new URLSearchParams(body);
    return Object.fromEntries(params.entries()) as ContactPayload;
  }
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function handler(event: { requestContext?: { http?: { method?: string } }; body?: string | null }) {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return response(204, {});
  }

  if (!toAddress || !fromAddress) {
    return response(500, { ok: false, error: "Contact endpoint is not configured." });
  }

  const payload = parseBody(event.body);
  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (payload.website) {
    return response(202, { ok: true });
  }

  if (name.length < 2 || name.length > 120 || !isEmail(email) || message.length < 10 || message.length > 2000) {
    return response(400, { ok: false, error: "Invalid contact submission." });
  }

  await ses.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: [toAddress],
      },
      Source: fromAddress,
      ReplyToAddresses: [email],
      Message: {
        Subject: {
          Data: `Portfolio inquiry from ${name}`,
        },
        Body: {
          Text: {
            Data: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
          },
        },
      },
    }),
  );

  return response(202, { ok: true });
}
