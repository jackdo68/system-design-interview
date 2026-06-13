---
title: DevSecOps & Delivery
description: CI/CD, DORA metrics, progressive delivery, shift-left security scanning, and proving what's in production with SBOM and signed artifacts.
sidebar:
  order: 10
---

How you ship is part of the design. Small, reversible, observable changes are a reliability strategy, not just a workflow.

## CI vs CD

- **CI (Continuous Integration)** — automatically build + test on every small merge. Keeps `main` always releasable.
- **CD (Continuous Delivery/Deployment)** — automatically promote/release that build through environments.

> **Small, reversible changes → lower change-failure rate.** A tiny diff is easy to review, easy to reason about, and trivial to roll back. Big-bang releases are where outages live.

## DORA metrics

The four research-backed delivery metrics:

- **Deployment frequency** — how often you ship.
- **Lead time for changes** — commit → production.
- **Change failure rate** — % of deploys causing a problem.
- **MTTR** — time to restore service.

The first two measure speed; the last two measure stability. Elite teams are good at **both** — they're not a trade-off.

## Progressive delivery

Ship gradually so blast radius is small and rollback is automatic:

- **Blue-green** — two identical environments; **flip** traffic, flip back instantly to roll back.
- **Canary** — release to a **small %**, watch the metrics, **auto-rollback** on regression.
- **Feature flags** — **deploy ≠ release.** Code ships dark, then you flip the flag; the flag is also a **kill-switch**.

:::tip[Principal Move]
**Decouple deploy from release** with feature flags. The code can be in production for days, exercised and observed, before any user sees it — and turning it off is a config change, not a redeploy. This is how you de-risk big changes.
:::

## Shift left — scan early

Move security checks as early in the pipeline as possible:

- **SAST** — static analysis of **source**.
- **SCA** — scan **dependencies** for known CVEs.
- **DAST** — test the **running** app.
- **IAST** — instrumented, runtime analysis.
- **Secret scanning** + **IaC scanning** — catch leaked credentials and misconfigured infrastructure-as-code.

## Prove what's in prod

:::note[Key Idea]
**SBOM (Software Bill of Materials) + signed artifacts = "prove what's in production."** When a CVE drops (think Log4Shell), the SBOM answers *"are we affected?"* in seconds. Signed artifacts + **GitOps** + **separation of duties** + an **audit trail** mean every change to prod is attributable and verifiable — table stakes in a regulated shop. See [Supply-Chain Security](../../deep-dives/supply-chain/).
:::
