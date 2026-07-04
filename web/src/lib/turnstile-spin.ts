export type TurnstileVerifyResult = {
  success?: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileViaWorker(
  token: string,
  workerUrl: string,
): Promise<TurnstileVerifyResult> {
  const response = await fetch(workerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    return { success: false, "error-codes": ["network-error"] };
  }

  return (await response.json()) as TurnstileVerifyResult;
}

export function readTurnstileToken(form: HTMLFormElement): string {
  const input = form.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]');
  return input?.value?.trim() ?? "";
}

declare global {
  interface Window {
    turnstile?: { reset: (widget?: HTMLElement | string) => void };
  }
}

export function hideTurnstileSlot(scope: ParentNode | Document = document): void {
  scope.querySelector<HTMLElement>("[data-turnstile-slot]")?.classList.add("turnstile-slot--verified");
}

export function showTurnstileSlot(scope: ParentNode | Document = document): void {
  const slot = scope.querySelector<HTMLElement>("[data-turnstile-slot]");
  if (!slot) return;
  slot.classList.remove("turnstile-slot--verified");
  const widget = slot.querySelector<HTMLElement>(".cf-turnstile");
  if (widget && window.turnstile) {
    window.turnstile.reset(widget);
  }
}
