# Deploy cyberd.tech to AWS (build + CDK). Run from repo root or via this script path.
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "../../../..")).Path
$EnvFile = Join-Path $RepoRoot ".env"

if (-not (Test-Path $EnvFile)) {
  Write-Error ".env not found. Copy .env.example to .env and fill in values."
}

Get-Content $EnvFile | Where-Object { $_ -match '^\s*[^#].*=' } | ForEach-Object {
  $parts = $_ -split '=', 2
  if ($parts.Count -eq 2) {
    Set-Item -Path "Env:$($parts[0].Trim())" -Value $parts[1].Trim()
  }
}

Write-Host "==> Building static site (web)..."
Push-Location $RepoRoot
npm run build -w web
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "==> Deploying CyberdPortfolioStack (CDK)..."
Push-Location (Join-Path $RepoRoot "infra")
npm run deploy -- --require-approval never
$code = $LASTEXITCODE
Pop-Location
Pop-Location

if ($code -ne 0) { exit $code }

Write-Host ""
Write-Host "Published: https://cyberd.tech"
Write-Host "CloudFront: https://d2nwxiin456b6k.cloudfront.net"
