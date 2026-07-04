#!/usr/bin/env bash
# Turnstile Spin: create widget, deploy siteverify Worker, validate, update .env (no secret on disk).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPTS="$ROOT/.tmp/turnstile-spin-scripts"
ENV_FILE="$ROOT/.env"

DOMAINS="localhost,127.0.0.1,d2nwxiin456b6k.cloudfront.net"
WIDGET_NAME="cyberd-portfolio (Spin)"
WORKER_NAME="turnstile-siteverify-cyberd-portfolio"

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "Set CLOUDFLARE_API_TOKEN (Account.Turnstile:Edit + Account.Workers Scripts:Edit)." >&2
  exit 1
fi

probe=$("$SCRIPTS/auth-probe.sh")
status=$(echo "$probe" | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])")
if [ "$status" != "ok" ]; then
  echo "$probe"
  exit 1
fi

account_id=$(echo "$probe" | python3 -c "import sys,json; print(json.load(sys.stdin)['account_id'])")

widget=$("$SCRIPTS/widget-create.sh" --account-id "$account_id" --name "$WIDGET_NAME" --domains "$DOMAINS" --mode managed)
widget_status=$(echo "$widget" | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])")
if [ "$widget_status" != "ok" ]; then
  echo "$widget"
  exit 1
fi

sitekey=$(echo "$widget" | python3 -c "import sys,json; print(json.load(sys.stdin)['sitekey'])")
export WIDGET_SECRET
WIDGET_SECRET=$(echo "$widget" | python3 -c "import sys,json; print(json.load(sys.stdin)['secret'])")

deploy=$("$SCRIPTS/worker-deploy.sh" --name "$WORKER_NAME")
deploy_status=$(echo "$deploy" | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])")
if [ "$deploy_status" != "ok" ]; then
  echo "$deploy"
  exit 1
fi

worker_url=$(echo "$deploy" | python3 -c "import sys,json; print(json.load(sys.stdin)['worker_url'])")

validate=$("$SCRIPTS/validate.sh" \
  --worker-url "$worker_url" \
  --account-id "$account_id" \
  --sitekey "$sitekey" \
  --expected-domains "$DOMAINS")
validate_status=$(echo "$validate" | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])")
if [ "$validate_status" != "ok" ]; then
  echo "$validate"
  exit 1
fi

python3 - "$ENV_FILE" "$sitekey" "$worker_url" <<'PY'
import pathlib, re, sys
path, sitekey, worker_url = sys.argv[1:4]
text = pathlib.Path(path).read_text(encoding="utf-8") if pathlib.Path(path).exists() else pathlib.Path(path.with_suffix(".example")).read_text(encoding="utf-8")

def set_var(name, value):
    global text
    pattern = rf"^{re.escape(name)}=.*$"
    replacement = f"{name}={value}"
    if re.search(pattern, text, flags=re.M):
        text = re.sub(pattern, replacement, text, count=1, flags=re.M)
    else:
        text += f"\n{replacement}\n"

set_var("PUBLIC_TURNSTILE_SITE_KEY", sitekey)
set_var("PUBLIC_TURNSTILE_WORKER_URL", worker_url)
set_var("TURNSTILE_SITEVERIFY_URL", worker_url)
pathlib.Path(path).write_text(text, encoding="utf-8")
PY

echo "{\"status\":\"ok\",\"sitekey\":\"$sitekey\",\"worker_url\":\"$worker_url\",\"account_id\":\"$account_id\"}"
