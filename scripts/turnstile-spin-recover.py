#!/usr/bin/env python3
"""Deploy Turnstile Spin siteverify Worker using existing widget keys from .env."""

from __future__ import annotations

import json
import os
import re
import shlex
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env"
SCRIPTS = ROOT / ".tmp" / "turnstile-spin-scripts"
DOMAINS = ["localhost", "127.0.0.1", "d2nwxiin456b6k.cloudfront.net"]
WORKER_NAME = "turnstile-siteverify-cyberd-portfolio"


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


def set_env_var(path: Path, key: str, value: str) -> None:
    text = path.read_text(encoding="utf-8") if path.exists() else ""
    pattern = rf"^{re.escape(key)}=.*$"
    replacement = f"{key}={value}"
    if re.search(pattern, text, flags=re.M):
        text = re.sub(pattern, replacement, text, count=1, flags=re.M)
    else:
        text = text.rstrip() + f"\n{replacement}\n"
    path.write_text(text, encoding="utf-8")


def to_bash_path(path: Path) -> str:
    resolved = path.resolve()
    drive = resolved.drive.rstrip(":").lower()
    if drive:
        return f"/mnt/{drive}{resolved.as_posix()[2:]}"
    return resolved.as_posix()


def run_bash(script: Path, *args: str, extra_env: dict[str, str] | None = None) -> tuple[int, str, str]:
    env = os.environ.copy()
    if extra_env:
        env.update(extra_env)
    bash_script = to_bash_path(script)
    bash_root = to_bash_path(ROOT)
    exports = " ".join(f"export {key}={shlex.quote(value)};" for key, value in (extra_env or {}).items())
    arg_str = " ".join(shlex.quote(a) for a in args)
    command = f"{exports} cd {bash_root} && {bash_script} {arg_str}".strip()
    proc = subprocess.run(
        ["bash", "-lc", command],
        cwd=ROOT,
        env=env,
        capture_output=True,
        text=True,
    )
    return proc.returncode, proc.stdout.strip(), proc.stderr.strip()


def curl_json(url: str, token: str, method: str = "GET", body: dict | None = None) -> dict:
    data = None
    headers = {"Authorization": f"Bearer {token}"}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def ensure_widget_domains(account_id: str, sitekey: str, token: str) -> None:
    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/challenges/widgets/{sitekey}"
    try:
        widget = curl_json(url, token)
    except urllib.error.HTTPError as err:
        print(f"Could not read widget metadata (HTTP {err.code}). Continuing.", file=sys.stderr)
        return

    result = widget.get("result") or {}
    registered = set(result.get("domains") or [])
    missing = [d for d in DOMAINS if d not in registered]
    if not missing:
        return

    name = result.get("name") or "cyberd-portfolio (Spin)"
    mode = result.get("mode") or "managed"
    updated_domains = sorted(registered.union(DOMAINS))
    put_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/challenges/widgets/{sitekey}"
    payload = {"name": name, "mode": mode, "domains": updated_domains}
    try:
        response = curl_json(put_url, token, method="PUT", body=payload)
    except urllib.error.HTTPError as err:
        print(f"Could not update widget domains (HTTP {err.code}).", file=sys.stderr)
        return

    if not response.get("success"):
        print("Widget domain update failed.", file=sys.stderr)
        return

    print(f"Updated widget domains: added {', '.join(missing)}")


def main() -> int:
    env = load_env(ENV_FILE)
    sitekey = env.get("PUBLIC_TURNSTILE_SITE_KEY", "")
    widget_secret = env.get("TURNSTILE_SECRET_KEY", "")
    api_token = env.get("TURNSTILE_API_KEY") or env.get("CLOUDFLARE_API_TOKEN", "")

    if not sitekey.startswith("0x"):
        print("PUBLIC_TURNSTILE_SITE_KEY is missing or invalid.", file=sys.stderr)
        return 1
    if not widget_secret.startswith("0x"):
        print("TURNSTILE_SECRET_KEY is missing or invalid.", file=sys.stderr)
        return 1
    if not api_token.startswith("cfat_"):
        print("TURNSTILE_API_KEY (Cloudflare API token) is missing or invalid.", file=sys.stderr)
        return 1

    code, probe_out, probe_err = run_bash(SCRIPTS / "auth-probe.sh", extra_env={"CLOUDFLARE_API_TOKEN": api_token})
    if probe_err:
        print(probe_err, file=sys.stderr)
    if code != 0 and not probe_out:
        print("Auth probe failed.", file=sys.stderr)
        return 1

    probe = json.loads(probe_out)
    if probe.get("status") != "ok":
        print(f"Auth probe status: {probe.get('status')}", file=sys.stderr)
        print(probe_out)
        return 1

    account_id = probe["account_id"]
    ensure_widget_domains(account_id, sitekey, api_token)

    code, deploy_out, deploy_err = run_bash(
        SCRIPTS / "worker-deploy.sh",
        "--name",
        WORKER_NAME,
        extra_env={
            "CLOUDFLARE_API_TOKEN": api_token,
            "WIDGET_SECRET": widget_secret,
        },
    )
    if deploy_err:
        print(deploy_err, file=sys.stderr)
    if not deploy_out:
        print("Worker deploy produced no output.", file=sys.stderr)
        return 1

    deploy = json.loads(deploy_out)
    if deploy.get("status") != "ok":
        print(f"Worker deploy failed: {deploy}", file=sys.stderr)
        return 1

    worker_url = deploy["worker_url"].rstrip("/")
    time.sleep(2)

    code, validate_out, validate_err = run_bash(
        SCRIPTS / "validate.sh",
        "--worker-url",
        worker_url,
        "--account-id",
        account_id,
        "--sitekey",
        sitekey,
        "--expected-domains",
        ",".join(DOMAINS),
        extra_env={"CLOUDFLARE_API_TOKEN": api_token},
    )
    if validate_err:
        print(validate_err, file=sys.stderr)
    if not validate_out:
        print("Validation produced no output.", file=sys.stderr)
        return 1

    validate = json.loads(validate_out)
    if validate.get("status") != "ok":
        print(f"Validation failed: {validate}", file=sys.stderr)
        return 1

    set_env_var(ENV_FILE, "PUBLIC_TURNSTILE_SITE_KEY", sitekey)
    set_env_var(ENV_FILE, "PUBLIC_TURNSTILE_WORKER_URL", worker_url)
    set_env_var(ENV_FILE, "TURNSTILE_SITEVERIFY_URL", worker_url)

    print(json.dumps({"status": "ok", "sitekey": sitekey, "worker_url": worker_url, "account_id": account_id}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
