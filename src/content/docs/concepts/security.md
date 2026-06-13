---
title: Security & Risk
description: AuthN vs AuthZ, OAuth2/OIDC, mTLS and zero-trust, encryption and tokenization, multi-tenant isolation, fraud, and abuse prevention.
sidebar:
  order: 9
---

In a regulated/payments context, security isn't a section at the end — it's a lens on every box. Lead with **deny-by-default** and **defense in depth**.

## AuthN vs AuthZ

- **Authentication (authN)** = **who** you are. OIDC, JWT, MFA.
- **Authorization (authZ)** = **what** you may do. **RBAC** (roles) or **ABAC** (attributes/context).

Confusing the two is a classic tell. Authentication proves identity; authorization gates actions.

## Tokens & service identity

- **OAuth2 + OIDC** for delegated auth; **short token TTL + refresh/rotation** so a leaked token expires fast.
- **mTLS service-to-service** — mutual TLS so both ends prove identity. The basis of **zero-trust**: never trust the network, always verify.
- **Least privilege** and **separation of duties** — the initiator of a payment must not be its approver.

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
