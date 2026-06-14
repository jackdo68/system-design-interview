---
title: Trade-off Axes
description: The axes every design decision trades along — latency, cost, consistency, availability, blast radius, ops toil, time-to-market, maintainability.
sidebar:
  order: 3
---

Every design choice is a move along one or more axes. Naming the axis you're trading on is what makes an answer sound senior.

## The axes

For each one: what it asks, **when it dominates** the decision, and the concrete trade you're making.

### Latency — "how fast?"
- **Trades against:** cost and consistency.
- **Dominates when:** the user *feels* the wait — checkout, search, a feed render.
- **Example:** a read replica cuts read latency, but it lags the primary — so you can't read an authoritative balance for a debit from it. You bought speed with staleness.

### Cost — "how much $?"
- **Trades against:** latency and redundancy.
- **Dominates when:** you're at scale (a tiny per-request cost × billions = real money) or under a hard budget.
- **Example:** active-active across regions gives ~zero RTO but roughly doubles infra spend. You pick it only when the cost of downtime exceeds the cost of the second region.

### Consistency — "how correct / fresh?"
- **Trades against:** availability (refuse under partition) and latency (coordination costs time).
- **Dominates when:** a wrong answer is unrecoverable — the money path.
- **Example:** the **ledger is CP** — refuse a write during a partition rather than risk a wrong balance. **Analytics is AP** — serve slightly stale numbers and stay up. → [Consistency](../../concepts/consistency/)

### Availability — "how often up?"
- **Trades against:** consistency and cost (each nine costs exponentially more).
- **Dominates when:** the path is revenue-critical and user-facing.
- **Example:** moving 99.9% → 99.99% cuts downtime from ~8.7 h to ~52 min/year — but usually means a second region and the cost/complexity that brings. Justify the jump with the cost of an outage. → [SLI/SLO/SLA](../../concepts/slo/)

### Blast radius — "how much breaks together?"
- **Trades against:** cost and simplicity.
- **Dominates when:** multi-tenant or regulated, where one bad change can't be allowed to take everyone down.
- **Example:** cell-based architecture caps a bad deploy or poison tenant to ~1/N of users — but now you operate and deploy N cells instead of one fleet. → [Blast Radius](../../deep-dives/blast-radius/)

### Ops toil — "how much human upkeep?"
- **Trades against:** build-time and control.
- **Dominates when:** the team is small and on-call burnout is a real risk.
- **Example:** managed Postgres (RDS) removes backup/patching/failover toil but cedes deep tuning and costs more than self-hosting. You're buying back human hours.

### Time-to-market — "how soon?"
- **Trades against:** robustness — but with a **floor** (never cut correctness, security, or segregation of duties).
- **Dominates when:** early-stage or a competitive launch window.
- **Example:** ship a coarse monolith now vs the "right" microservices later — the monolith wins time-to-market, and you split seams only when they genuinely hurt.

### Maintainability — "how easy to change?"
- **Trades against:** short-term speed — a clever shortcut today taxes every future change.
- **Dominates when:** the system is long-lived and core.
- **Example:** a denormalized read model is fast to ship and read, but every write path must now keep it in sync forever. → [CQRS / Scalability](../../concepts/scalability/)

## Build vs buy

:::tip[Principal Move]
**Buy the undifferentiated; build the core.** Buy auth, email, observability tooling, queues. Build the things that *are* your competitive edge or your correctness boundary — the **ledger** and the **fraud** engine in a payments business. Don't build a worse Stripe; don't outsource your source of truth.
:::

## Speed vs robustness

Move fast — but there's a floor. **Never cut correctness, security, or segregation of duties** to ship sooner. These are the things that are catastrophic and unrecoverable when wrong. Everything else is negotiable against time-to-market.

## "Good enough" is anchored, not vibes

A design is good enough when it **meets the SLO / error budget with headroom** — not when it feels done. If you can't name the target it's measured against, you can't call it good enough.

## End with reversibility

Every decision is made with *today's* information. **Reversibility just means: how hard is it to undo this if we later find out it was wrong?** That one question does two useful things — it tells you how careful to be now, and (said out loud at the end) it shows the interviewer you know your decision isn't forever.

### Two kinds of decision

- **Easy to undo → decide fast.** A **feature flag** is the classic example: if the new behaviour is bad, you flip it off in seconds. No need to agonise — ship it behind the flag and watch.
- **Hard to undo → decide carefully.** **Sharding a database** is the opposite: once data is split across nodes, putting it back together is a painful migration. Spend real time here, because a wrong call is expensive to walk back.

> Rule of thumb: **match how long you deliberate to the cost of being wrong.**

### Name the tripwire

Don't end with a vague "it depends." End with the **exact condition** that would make you change your mind — a real number or signal:

- *"A single Postgres primary handles this fine up to ~5,000 writes/sec. Above that I'd shard — so I'd put an alert at 4,000 and revisit then."*
- *"I'll cache the feed with a 30-second TTL. If users complain it's stale, I'd drop it to 5 seconds or switch to update-on-write."*

That's a much stronger close than "it depends" — you've handed over the precise tripwire that flips the trade-off, which is exactly what a senior engineer does.
