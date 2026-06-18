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

Encrypt **in transit** (TLS), **at rest** (disk/DB), and **field-level** for the most sensitive data. Manage keys in a **KMS/HSM** with **rotation**.

## Tokenization

:::tip[Principal Move]
**Tokenize to cut PCI-DSS scope.** Replace the real card number (PAN) with a token at the edge; downstream systems only ever see the token. Now those systems are **out of PCI scope** — a massive reduction in audit surface and risk. Naming this shows you understand compliance as an architecture force.
:::

## Multi-tenant isolation

- **`tenantId` everywhere** + **row-level security** so a query can never cross tenants.
- Scale isolation up as needed: **shared-schema → schema-per-tenant → db-per-tenant**.
- **Per-tenant keys** for the highest isolation. See [Multi-Tenancy](../../deep-dives/multi-tenancy/).

## Fraud

A layered control, not a single check:

- **Rules** (velocity, geo, amount thresholds) — fast, synchronous.
- **ML score** — risk model, often async.
- **Step-up** — challenge (MFA, 3DS) when risk is elevated.
- **KYC / AML / sanctions** screening.

> Every fraud control trades **false positives** (block a good customer) against **false negatives** (let fraud through). Name the trade — there's no free lunch.

## Abuse prevention

- **Rate-limit** with a **token bucket** (allows bursts, caps sustained rate).
- **WAF** at the edge, **DDoS** protection, **bot** detection.

:::note[Key Idea]
Principles to repeat: **secure-by-default, deny-by-default, defense in depth, STRIDE** (a threat-modelling lens: Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation). And for data: **minimise PII, enforce retention & erasure, respect residency, keep an immutable audit log.**
:::
