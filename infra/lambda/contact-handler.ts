import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { getTurnstileSecret, turnstileSecretConfigured } from "./turnstile-secret.js";

const ses = new SESClient({});

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
  token?: string;
};

const allowedOrigin = process.env.ALLOWED_ORIGIN ?? "*";
const toAddress = process.env.CONTACT_TO_ADDRESS;
const fromAddress = process.env.CONTACT_FROM_ADDRESS;
const turnstileSiteverifyUrl = process.env.TURNSTILE_SITEVERIFY_URL ?? "";
const turnstileConfigured = Boolean(turnstileSiteverifyUrl) || turnstileSecretConfigured;

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

// Strip CR/LF and other control characters so user input can never inject
// email headers or malformed content into the SES command.
function sanitizeLine(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
}

function sanitizeMessage(value: string): string {
  // Keep newlines for readability; remove all other control characters.
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ").trim();
}

async function verifyViaWorker(token: string, remoteIp?: string): Promise<boolean> {
  const verifyResponse = await fetch(turnstileSiteverifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, remoteip: remoteIp }),
  });

  if (!verifyResponse.ok) return false;

  const result = (await verifyResponse.json()) as { success?: boolean };
  return result.success === true;
}

async function verifyViaSecret(token: string, remoteIp?: string): Promise<boolean> {
  const secret = await getTurnstileSecret();
  if (!secret) return false;

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (remoteIp) form.set("remoteip", remoteIp);

  const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!verifyResponse.ok) return false;

  const result = (await verifyResponse.json()) as { success?: boolean };
  return result.success === true;
}

async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  if (turnstileSiteverifyUrl) {
    return verifyViaWorker(token, remoteIp);
  }
  if (turnstileSecretConfigured) {
    return verifyViaSecret(token, remoteIp);
  }
  return false;
}

export async function handler(event: {
  requestContext?: { http?: { method?: string; sourceIp?: string } };
  body?: string | null;
}) {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return response(204, {});
  }

  if (!toAddress || !fromAddress) {
    return response(500, { ok: false, error: "Contact endpoint is not configured." });
  }

  const payload = parseBody(event.body);
  const name = sanitizeLine(payload.name ?? "");
  const email = sanitizeLine(payload.email ?? "");
  const message = sanitizeMessage(payload.message ?? "");

  if (payload.website) {
    return response(202, { ok: true });
  }

  if (name.length < 2 || name.length > 120 || !isEmail(email) || message.length < 10 || message.length > 2000) {
    return response(400, { ok: false, error: "Invalid contact submission." });
  }

  if (turnstileConfigured) {
    const token = payload.token?.trim() ?? "";
    if (!token) {
      return response(400, { ok: false, error: "Verification required." });
    }

    const verified = await verifyTurnstile(token, event.requestContext?.http?.sourceIp);
    if (!verified) {
      return response(403, { ok: false, error: "Verification failed." });
    }
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
