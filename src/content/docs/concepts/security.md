---
title: Security & Risk
description: AuthN vs AuthZ, OAuth2/OIDC, mTLS and zero-trust, encryption and tokenization, multi-tenant isolation, fraud, and abuse prevention.
sidebar:
  order: 9
---

In a regulated/payments context, security isn't a section at the end — it's a lens on every box. Lead with **deny-by-default** and **defense in depth**.

:::note[Who you are vs what you can do]
Identity and access control — **authN, authZ, OAuth2/OIDC, sessions vs JWT, RBAC/ABAC, and mTLS** — have their own page: [Authentication & Authorization](../../design/auth/). This page covers the rest of the security surface: encryption, tokenization, multi-tenant isolation, fraud, and abuse.
:::

## Encryption

Encrypt **in transit** (TLS), **at rest** (disk/DB), and **field-level** for the most sensitive data. Manage keys in a **<abbr title="KMS — Key Management Service: a managed service that stores and controls encryption keys. HSM — Hardware Security Module: a tamper-resistant device that guards keys in hardware.">KMS/HSM</abbr>** with **rotation**.

## Tokenization

:::tip[Principal Move]
It's good to wield compliance as an architecture force at principal level — but for a senior, you should at least know that **tokenizing card data cuts <abbr title="PCI-DSS — Payment Card Industry Data Security Standard: the security rules every system that touches card data must follow. The fewer systems touch it, the smaller (and cheaper) the audit.">PCI-DSS</abbr> scope.** Replace the real card number (PAN) with a token at the edge; downstream systems only ever see the token. Now those systems are **out of PCI scope** — a big reduction in audit surface and risk.
:::

:::note[Go deeper · Tech Unpack]
[What's Actually Living Inside Your Apple Wallet and Google Pay? →](https://technunpack.substack.com/p/whats-actually-living-inside-your) — card tokenization end to end, from the 16-digit PAN to the device token.
:::

## Multi-tenant isolation

- **`tenantId` everywhere** + **row-level security** so a query can never cross tenants.
- Scale isolation up as needed: **shared-schema → schema-per-tenant → db-per-tenant**.
- **Per-tenant keys** for the highest isolation. See [Multi-Tenancy](../../deep-dives/multi-tenancy/).

## Fraud

A layered control, not a single check:

- **Rules** (velocity, geo, amount thresholds) — fast, synchronous.
- **ML score** — risk model, often async.
- **Step-up** — challenge (MFA, <abbr title="3DS — 3-D Secure: the extra 'verify with your bank' step on online card payments (e.g. a one-time code).">3DS</abbr>) when risk is elevated.
- **<abbr title="KYC — Know Your Customer: verifying who a customer is. AML — Anti-Money-Laundering: rules and checks to stop illegal money flows. Sanctions screening: checking customers against banned-party lists.">KYC / AML / sanctions</abbr>** screening.

> Every fraud control trades **false positives** (block a good customer) against **false negatives** (let fraud through). Name the trade — there's no free lunch.

## Abuse prevention

- **Rate-limit** with a **token bucket** (allows bursts, caps sustained rate).
- **<abbr title="WAF — Web Application Firewall: a filter at the edge that blocks malicious requests (SQL injection, scripting attacks) before they reach your app.">WAF</abbr>** at the edge, **<abbr title="DDoS — Distributed Denial of Service: a flood of traffic from many sources aimed at knocking your service offline.">DDoS</abbr>** protection, **bot** detection.

:::note[Key Idea]
Principles to repeat: **secure-by-default, deny-by-default, defense in depth, STRIDE** (a threat-modelling lens: Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation). And for data: **minimise <abbr title="PII — Personally Identifiable Information: data that identifies a person (name, email, card number, address). Collect as little as possible.">PII</abbr>, enforce retention & erasure, respect residency, keep an immutable audit log.**
:::
