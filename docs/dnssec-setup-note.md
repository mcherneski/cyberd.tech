# DNSSEC for cyberd.tech — setup note (deferred)

Status: **not enabled**. This is the last remaining item from the July 2026 security
audit. Everything else (server-side Turnstile verification, API throttling, SSM
secret storage, SHA-pinned Actions, scoped OIDC deploy role) is done.

## What it protects against

DNSSEC cryptographically signs DNS responses so resolvers can detect forged or
poisoned answers for `cyberd.tech`. Without it, a successful cache-poisoning attack
could redirect visitors to an attacker's server. Low likelihood for a personal site,
but it is the one gap that no amount of application hardening covers.

## Cost

- ~$1.00/month for the KMS asymmetric key (`ECC_NIST_P256`) that Route 53 uses as
  the key-signing key. No per-query charge.

## Setup steps (30–45 min, do when unhurried — mistakes can take the domain offline)

1. **Create the KSK key in KMS** (must be in `us-east-1`):

   ```powershell
   aws kms create-key --key-spec ECC_NIST_P256 --key-usage SIGN_VERIFY `
     --description "DNSSEC KSK for cyberd.tech" --region us-east-1
   ```

2. **Create the key-signing key and enable signing** on the hosted zone
   (`Z10428902VF4QPEH0A6`):

   ```powershell
   aws route53 create-key-signing-key --hosted-zone-id Z10428902VF4QPEH0A6 `
     --key-management-service-arn <kms-key-arn> --name cyberd-ksk `
     --status ACTIVE --caller-reference (Get-Date -Format o)

   aws route53 enable-hosted-zone-dnssec-signing --hosted-zone-id Z10428902VF4QPEH0A6
   ```

3. **Wait for signing to propagate** (check with
   `aws route53 get-dnssec --hosted-zone-id Z10428902VF4QPEH0A6` — zone status
   should be `SIGNING`). Wait at least the maximum zone TTL before step 4.

4. **Publish the DS record at the registrar.** Get the DS value from the
   `get-dnssec` output above. If the domain is registered with Route 53 Domains:

   ```powershell
   aws route53domains associate-delegation-signer-to-domain --region us-east-1 `
     --domain-name cyberd.tech --signing-attributes Algorithm=13,Flags=257,PublicKey=<public-key>
   ```

   If registered elsewhere (e.g. Namecheap/GoDaddy), paste the DS record into the
   registrar's DNSSEC panel instead.

5. **Verify** after propagation: <https://dnsviz.net/d/cyberd.tech/dnssec/> should
   show a full chain of trust with no errors, and `dig cyberd.tech +dnssec` should
   return `ad` (authenticated data) via a validating resolver like `1.1.1.1`.

## Cautions

- **Order matters.** Enable zone signing *before* publishing the DS record. If the
  DS record exists while the zone is unsigned, validating resolvers will refuse to
  resolve the domain (site appears down for most of the internet).
- **Undo path:** remove the DS record at the registrar first, wait the DS TTL, then
  disable signing and deactivate the KSK. Never disable signing while the DS record
  is still published.
- After enabling, avoid changing name servers without first tearing DNSSEC down.
