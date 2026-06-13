---
title: Quick-Reference Cheat Sheet
description: The numbers to memorise, decision heuristics, and in-room reflexes — the one page to skim the morning of the interview.
sidebar:
  order: 2
---

The condensed version of the whole manual. Skim this the morning of the interview.

## Numbers to memorise

| Quantity | Value |
| --- | --- |
| `99.9%` uptime | ≈ **8.7 hours/year** down |
| `99.95%` | ≈ 4.4 h/year |
| `99.99%` | ≈ **52 min/year** |
| `99.999%` | ≈ 5 min/year |
| L1 cache ref | ~1 ns |
| Main memory ref | ~100 ns |
| SSD random read | ~100 µs |
| Network round-trip (same region) | ~0.5 ms |
| Cross-region round-trip | ~50–150 ms |
| Disk seek (HDD) | ~10 ms |

> **Latency budget intuition:** if p99 must be < 300 ms and a cross-region hop is ~100 ms, you can't afford two of them on the critical path. Keep the sync path same-region.

## Decision heuristics

- **Queue vs log** → need replay or multiple consumers? **Log**. Fire-and-forget work distribution? **Queue**.
- **SQL vs NoSQL** → need transactions / relations / ad-hoc queries? **SQL**. Known access pattern, massive scale, simple lookups? **NoSQL**.
- **Sync vs async** → user needs the result now and deps are fast/reliable? **Sync**. Can accept-now-process-later? **Async** (+ status + failure notify).
- **CP vs AP** → wrong answer is unrecoverable (money)? **CP**. Stale answer is harmless (feed, analytics)? **AP**.
- **Vertical vs horizontal** → quick headroom, simple? **Vertical**. Need HA or past the ceiling? **Horizontal** (make it stateless first).
- **Cache strategy** → read-heavy, tolerate staleness? **Cache-aside + TTL**. Fresh reads after write? **Write-through**.
- **Build vs buy** → core/differentiating (ledger, fraud)? **Build**. Undifferentiated (auth, email, queues)? **Buy**.
- **DR strategy** → match RTO/RPO: hours→**backup**, ~10min→**pilot light**, minutes→**warm standby**, ~zero→**active-active**.

## In-room reflexes

The loop: **Scope → Estimate → High level → Deep dive → Failure → Wrap.**

- ☐ Clarified functional **and** non-functional requirements (TPS, p99, durability)?
- ☐ Stated assumptions on the board?
- ☐ Picked the **risky 1–2** components to deep-dive (not equal time everywhere)?
- ☐ Named, for each choice: **why / rejected alt / trade-off / how it fails / how it evolves**?
- ☐ Covered the **failure path**, not just the happy path?
- ☐ Raised **async failure UX** (status + notify on failure) before being asked?
- ☐ Ended with the **condition I'd revisit** (reversibility)?

## One-liners to deploy

- *"Reasoning > tech — let me name the trade-off."*
- *"Core ledger is CP; I'd rather refuse than be wrong. Notifications are AP."*
- *"Saga over 2PC for scale — every step idempotent with a compensating action."*
- *"Idempotency key is client-minted and keyed on the domain ID, not the MessageId."*
- *"Alert on the p99 tail, not the average; saturation is the leading indicator."*
- *"Error budget = 1 − SLO. Burn it fast and we freeze and stabilise."*
- *"Buy the undifferentiated, build the core."*
- *"I'd revisit this once write throughput nears the primary's ceiling."*
- *"Maximise org output, not my keyboard."*

## SQS quick facts

- **At-least-once**; no delete on receive.
- Message isn't deleted until **after the visibility timeout** → set VT **> max processing time** or you'll get duplicates while still working.
- `maxReceiveCount` → **DLQ**; no DLQ means it loops until retention (max **14 days**).
- Handler must be **idempotent**; key on the **domain ID**, not `MessageId`.
