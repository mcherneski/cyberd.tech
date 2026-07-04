// Shared controller for a single, invisible Turnstile widget in the contact
// section. Turnstile tokens are single-use, so each consumer (social-links
// reveal, contact-form submit) must obtain its own token. This mints a fresh
// token on demand from one widget instead of rendering a widget per action.

declare global {
  interface Window {
    turnstile?: {
      render: (el: string | HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      execute?: (id?: string) => void;
    };
    __cyberdTurnstileId?: string;
    onloadCyberdTurnstile?: () => void;
  }
}

type Waiter = { resolve: (token: string) => void; reject: (error: Error) => void };

const waiters: Waiter[] = [];
let bound = false;
let gatePresent = false;
let busy = false;
let readyTries = 0;

export function bindTurnstileGate(): void {
  gatePresent = Boolean(document.querySelector("[data-turnstile-gate]"));
  if (bound) return;
  bound = true;
  window.addEventListener("cyberd-turnstile-token", onToken as EventListener);
  window.addEventListener("cyberd-turnstile-error", onError as EventListener);
}

export function gateActive(): boolean {
  return gatePresent;
}

function onToken(event: Event): void {
  const token = (event as CustomEvent<{ token: string }>).detail?.token ?? "";
  busy = false;
  waiters.shift()?.resolve(token);
  runNext();
}

function onError(): void {
  busy = false;
  waiters.shift()?.reject(new Error("turnstile-error"));
  runNext();
}

function runNext(): void {
  if (busy || waiters.length === 0) return;

  const id = window.__cyberdTurnstileId;
  if (!id || !window.turnstile || !window.turnstile.execute) {
    // The widget script may still be loading; retry briefly before giving up.
    if (readyTries++ > 80) {
      readyTries = 0;
      waiters.shift()?.reject(new Error("turnstile-unavailable"));
      runNext();
      return;
    }
    setTimeout(runNext, 150);
    return;
  }

  readyTries = 0;
  busy = true;
  try {
    window.turnstile.reset(id);
  } catch {
    // Widget was freshly rendered and has no token to clear yet.
  }
  try {
    window.turnstile.execute(id);
  } catch {
    busy = false;
    setTimeout(runNext, 150);
  }
}

/** Resolve with a fresh single-use Turnstile token, or reject if unavailable. */
export function requestToken(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!gatePresent) {
      reject(new Error("turnstile-inactive"));
      return;
    }
    waiters.push({ resolve, reject });
    runNext();
  });
}
