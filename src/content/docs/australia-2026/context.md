---
title: Regulatory & Market Context
description: The Australian 2026 backdrop — APRA prudential standards, scams and conduct regulation, and the payments rails NPP/PayTo, BECS, CDR.
sidebar:
  order: 1
---

If you're interviewing for a bank, fintech, or payments role in Australia, this context turns a generic design into one that sounds like you've worked here. Drop these in where relevant — don't recite them.

## APRA — operational resilience & security

The Australian Prudential Regulation Authority sets binding standards for banks and insurers:

- **CPS 230 — Operational Risk Management** (in force from **1 July 2025**). Requires regulated entities to identify **critical operations**, set **tolerance levels** for disruption, manage **material service-provider** risk, and test their ability to keep operating through severe-but-plausible disruption.
  - *Maps to:* your **RTO/RPO**, **DR strategy**, **chaos/game days**, and **third-party (PSP/cloud) risk** all become regulatory obligations, not just good practice.
- **CPS 234 — Information Security.** Requires maintaining information-security capability commensurate with threats, clear roles, control testing, and **notifying APRA of material incidents** (within ~72 hours).
  - *Maps to:* your **encryption, least-privilege, audit-log, and incident-response** design.

:::tip[Principal Move]
When you mention DR or third-party risk in a design, name **CPS 230**: *"Because the rail is a material service provider under CPS 230, I'd need a defined tolerance for its disruption and a tested fallback."* It shows you design within the regulatory envelope, not around it.
:::

## Scams, fraud & conduct

- **Scams Prevention Framework** — Australian legislation imposing obligations on banks, telcos, and digital platforms to **prevent, detect, disrupt, and respond** to scams, with mandatory reporting and potential liability for failures.
- **AFCA** — the Australian Financial Complaints Authority handles disputes; outcomes increasingly hold institutions accountable for scam losses where controls were inadequate.
- *Maps to:* your **fraud layer** (rules + ML + step-up), **confirmation-of-payee**, customer warnings, and the **failure-comms** path are conduct and liability questions, not just engineering.

## Payments rails

Know the Australian rails by name and property:

| Rail | What it is | Properties |
| --- | --- | --- |
| **NPP** (New Payments Platform) | Real-time account-to-account rail | 24/7, near-instant, data-rich, **PayID** addressing |
| **PayTo** | NPP-based digital mandates | Customer-authorised recurring/one-off debits; replacing legacy direct debit |
| **Osko** | Overlay service on NPP | Fast P2P payments + messaging |
| **BECS** | Bulk Electronic Clearing System | Legacy **batch** direct entry/debit; being modernised/retired this decade |
| **CDR / Open Banking** | Consumer Data Right | Customer-consented data sharing via accredited recipients & APIs |

:::note[Key Idea]
The rail's properties drive the design. **NPP/PayTo** is **real-time and irrevocable** — so fraud checks must be **synchronous and fast** (you can't claw it back), and your idempotency/reconciliation has to be airtight. **BECS** is **batch**, so it's eventually consistent by nature with a settlement window. Choosing the rail *is* choosing your consistency and fraud-timing model.
:::

## Putting it together

A strong Australian answer weaves these in naturally: *"This is on NPP, so settlement is real-time and irrevocable — fraud is synchronous on the critical path. The PSP is a material service provider under CPS 230, so I need a tested fallback and a defined disruption tolerance. And under the Scams Prevention Framework, confirmation-of-payee and clear customer warnings are part of the design, not an afterthought."*
