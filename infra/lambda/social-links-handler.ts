import { getTurnstileSecret, turnstileSecretConfigured } from "./turnstile-secret.js";

type SocialPayload = {
  token?: string;
  trap?: string;
};

const allowedOrigin = process.env.ALLOWED_ORIGIN ?? "*";
const turnstileSiteverifyUrl = process.env.TURNSTILE_SITEVERIFY_URL ?? "";
const linkedinUrl = process.env.SOCIAL_LINKEDIN_URL ?? "";
const xUrl = process.env.SOCIAL_X_URL ?? "";
const telegramUrl = process.env.SOCIAL_TELEGRAM_URL ?? "";

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

function parseBody(body: string | null | undefined): SocialPayload {
  if (!body) return {};

  try {
    return JSON.parse(body) as SocialPayload;
  } catch {
    return {};
  }
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

  const payload = parseBody(event.body);

  if (payload.trap) {
    return response(403, { ok: false, error: "Forbidden." });
  }

  const token = payload.token?.trim() ?? "";
  if (!token) {
    return response(400, { ok: false, error: "Verification required." });
  }

  const verified = await verifyTurnstile(token, event.requestContext?.http?.sourceIp);
  if (!verified) {
    return response(403, { ok: false, error: "Verification failed." });
  }

  const links: Record<string, string> = {};
  if (linkedinUrl) links.linkedin = linkedinUrl;
  if (xUrl) links.x = xUrl;
  if (telegramUrl) links.telegram = telegramUrl;

  if (Object.keys(links).length === 0) {
    return response(503, { ok: false, error: "Social links are not configured." });
  }

  return response(200, { ok: true, links });
}
