---
title: Consistency & Data
description: CAP and PACELC, ACID vs BASE, saga vs 2PC, CDC and WAL, and the double-entry ledger as system of record.
sidebar:
  order: 5
---

The consistency model is the most consequential decision in a data-heavy system, because it's the hardest to change later. Choose it from the requirement, not habit.

## CAP and PACELC

- **CAP** — when a network **partition** happens, you must choose **C**onsistency or **A**vailability. You cannot have both during a partition. (When there's no partition, the choice doesn't apply.)
- **PACELC** — extends it: **P**artition → **A** or **C**; **E**lse (normal operation) → trade **L**atency vs **C**onsistency. Even with no partition, stronger consistency costs latency.

:::tip[Principal Move]
It's good to make this call per component at principal level — but for a senior, you should at least choose consistency vs availability deliberately on the money path. Make the choice **per component**, not per system:

- **Ledger = CP** — under partition, **refuse rather than be wrong**. A wrong balance is unrecoverable trust damage.
- **Notifications / analytics = AP** — stay available; eventual consistency is fine. A late notification is harmless.
:::

## ACID vs BASE

- **ACID** (classic transactional DBs) — Atomic, Consistent, Isolated, Durable. Strong guarantees, single-system.
- **BASE** (many distributed stores) — Basically Available, Soft state, Eventually consistent. Trades guarantees for scale and availability.

## Saga over 2PC

To coordinate a transaction across services, you have two models:

| | **2PC (two-phase commit)** | **Saga** |
| --- | --- | --- |
| Mechanism | Coordinator locks all parties, then commits | Local transactions + **compensations** |
| Failure | Coordinator is a **<abbr title="SPOF — Single Point Of Failure: one component whose failure takes the whole system down.">SPOF</abbr>**; locks **block** | Each step undoes via a compensating action |
| Scale | Poor — blocking, lock contention | Good — no global locks |

> **Prefer Saga.** A series of local transactions, each with a compensating action that reverses it if a later step fails. No global lock, no blocking coordinator. The cost: you implement and reason about compensations, and there's a window of inconsistency.

See the [Worked Design](../../worked-design/money-movement/) for a full saga with compensations.

## CDC and WAL

- **CDC (Change Data Capture)** — stream a database's changes out as events (often read from the WAL). Powers cache invalidation, read models, and event-driven integrations without dual writes.
- **WAL (Write-Ahead Log)** — the durability log the DB writes *before* applying a change, so it can recover after a crash. CDC often taps it.

## Double-entry ledger = system of record

:::note[Key Idea]
For money, the **double-entry ledger is the system of record**. Every movement is two equal-and-opposite entries (a debit and a credit) so the books always balance — `sum(debits) == sum(credits)` is an invariant you can continuously assert. Balances are *derived* from the ledger, never stored as the source of truth. This makes the system **auditable** and **provably consistent**.
:::
