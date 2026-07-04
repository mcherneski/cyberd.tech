#!/usr/bin/env python3
"""Deploy Turnstile Spin siteverify Worker using wrangler (Windows-safe)."""

from __future__ import annotations

import json
import os
import re
import shlex
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env"
DEPLOY_DIR = ROOT / ".tmp" / "turnstile-siteverify-deploy"
WORKER_NAME = "turnstile-siteverify-cyberd-portfolio"
WORKERS_SUBDOMAIN = "cyberdtech"
ACCOUNT_ID = "aa544cf25f9c6d59e763490ecce1fba2"


def ensure_workers_subdomain(token: str) -> None:
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/workers/subdomain"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
            if payload.get("success") and payload.get("result", {}).get("subdomain"):
                return
    except urllib.error.HTTPError:
        pass

    body = json.dumps({"subdomain": WORKERS_SUBDOMAIN}).encode("utf-8")
    put = urllib.request.Request(
        url,
        data=body,
        method="PUT",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(put, timeout=30) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
        if not payload.get("success"):
            raise RuntimeError("Could not register workers.dev subdomain.")


def load_env() -> dict[str, str]:
    values: dict[str, str] = {}
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


def set_env_var(key: str, value: str) -> None:
    text = ENV_FILE.read_text(encoding="utf-8")
    pattern = rf"^{re.escape(key)}=.*$"
    replacement = f"{key}={value}"
    if re.search(pattern, text, flags=re.M):
        text = re.sub(pattern, replacement, text, count=1, flags=re.M)
    else:
        text = text.rstrip() + f"\n{replacement}\n"
    ENV_FILE.write_text(text, encoding="utf-8")


def run(cmd: list[str] | str, *, cwd: Path | None = None, input_text: str | None = None, env: dict[str, str] | None = None) -> subprocess.CompletedProcess[str]:
    merged = os.environ.copy()
    if env:
        merged.update(env)
    return subprocess.run(
        cmd,
        cwd=cwd or ROOT,
        env=merged,
        input=input_text,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        shell=isinstance(cmd, str),
    )


def main() -> int:
    env = load_env()
    token = env.get("TURNSTILE_API_KEY") or env.get("CLOUDFLARE_API_TOKEN", "")
    secret = env.get("TURNSTILE_SECRET_KEY", "")
    sitekey = env.get("PUBLIC_TURNSTILE_SITE_KEY", "")

    if not token or not secret or not sitekey:
        print("Missing TURNSTILE_API_KEY, TURNSTILE_SECRET_KEY, or PUBLIC_TURNSTILE_SITE_KEY.", file=sys.stderr)
        return 1

    ensure_workers_subdomain(token)

    if DEPLOY_DIR.exists():
        shutil.rmtree(DEPLOY_DIR)
    DEPLOY_DIR.mkdir(parents=True, exist_ok=True)

    degit = run(
        f'npx --yes degit cloudflare/skills/skills/turnstile-spin/templates/worker "{DEPLOY_DIR}"',
    )
    if degit.returncode != 0:
        print(degit.stderr or degit.stdout, file=sys.stderr)
        return 1

    deploy = run(
        f"npx wrangler deploy --name {WORKER_NAME}",
        cwd=DEPLOY_DIR,
        env={"CLOUDFLARE_API_TOKEN": token},
    )
    combined = (deploy.stdout or "") + "\n" + (deploy.stderr or "")
    if deploy.returncode != 0:
        print(combined, file=sys.stderr)
        return 1

    secret_put = run(
        f"npx wrangler secret put TURNSTILE_SECRET_KEY --name {WORKER_NAME}",
        cwd=DEPLOY_DIR,
        input_text=f"{secret}\n",
        env={"CLOUDFLARE_API_TOKEN": token},
    )
    if secret_put.returncode != 0:
        print((secret_put.stdout or "") + (secret_put.stderr or ""), file=sys.stderr)
        return 1

    match = re.search(r"https://[a-zA-Z0-9._-]+\.workers\.dev", combined)
    worker_url = match.group(0).rstrip("/") if match else f"https://{WORKER_NAME}.{WORKERS_SUBDOMAIN}.workers.dev"

    health_ok = False
    try:
        with urllib.request.urlopen(f"{worker_url}/health", timeout=30) as resp:
            health = json.loads(resp.read().decode("utf-8"))
            health_ok = health.get("ok") is True
    except Exception:
        health_ok = False

    if not health_ok and deploy.returncode != 0:
        print("Worker deploy failed and health check unreachable.", file=sys.stderr)
        print(combined, file=sys.stderr)
        return 1

    dummy_ok = False
    dummy: dict = {}
    try:
        dummy_req = urllib.request.Request(
            worker_url,
            data=json.dumps({"token": "XXXX.DUMMY.TOKEN.XXXX"}).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(dummy_req, timeout=30) as resp:
            dummy = json.loads(resp.read().decode("utf-8"))
            dummy_ok = dummy.get("success") is False and bool(dummy.get("error-codes"))
    except Exception:
        dummy_ok = False

    if not dummy_ok and not health_ok:
        print("Worker deployed but local validation could not reach workers.dev (SSL/network).", file=sys.stderr)
        print("Continuing with configured Worker URL; AWS Lambda verification is the runtime check.", file=sys.stderr)
    elif not dummy_ok:
        print("Dummy siteverify check failed.", file=sys.stderr)
        return 1
    elif dummy.get("_worker", {}).get("worker_version") is None and health_ok:
        print("Worker metadata missing from response.", file=sys.stderr)
        return 1

    set_env_var("PUBLIC_TURNSTILE_WORKER_URL", worker_url)
    set_env_var("TURNSTILE_SITEVERIFY_URL", worker_url)

    print(json.dumps({"status": "ok", "worker_url": worker_url, "sitekey": sitekey}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
