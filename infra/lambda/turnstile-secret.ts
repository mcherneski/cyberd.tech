import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

const parameterName = process.env.TURNSTILE_SECRET_PARAMETER ?? "";
const envSecret = process.env.TURNSTILE_SECRET_KEY ?? "";

let cachedSecret: string | undefined;

/** True when a Turnstile secret is available from SSM or the environment. */
export const turnstileSecretConfigured = Boolean(parameterName || envSecret);

/**
 * Resolve the Turnstile secret, preferring SSM SecureString (fetched once per
 * container and cached) over a plaintext environment variable fallback.
 */
export async function getTurnstileSecret(): Promise<string> {
  if (cachedSecret !== undefined) return cachedSecret;

  if (parameterName) {
    const ssm = new SSMClient({});
    const result = await ssm.send(
      new GetParameterCommand({ Name: parameterName, WithDecryption: true }),
    );
    cachedSecret = result.Parameter?.Value ?? "";
    return cachedSecret;
  }

  cachedSecret = envSecret;
  return cachedSecret;
}
