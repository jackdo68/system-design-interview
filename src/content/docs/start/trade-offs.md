---
title: Trade-off Axes
description: The axes every design decision trades along — latency, cost, consistency, availability, blast radius, ops toil, time-to-market, maintainability.
sidebar:
  order: 3
---

Every design choice is a move along one or more axes. Naming the axis you're trading on is what makes an answer sound senior.

## The axes

| Axis | The question | Tension |
| --- | --- | --- |
| **Latency** | How fast? | vs cost, vs consistency |
| **Cost** | How much $? | vs latency, vs redundancy |
| **Consistency** | How correct/fresh? | vs availability, vs latency |
| **Availability** | How often up? | vs consistency, vs cost |
| **Blast radius** | How much breaks together? | vs cost, vs simplicity |
| **Ops toil** | How much human upkeep? | vs build-time, vs control |
| **Time-to-market** | How soon? | vs robustness |
| **Maintainability** | How easy to change? | vs short-term speed |

## Build vs buy

:::tip[Principal Move]
**Buy the undifferentiated; build the core.** Buy auth, email, observability tooling, queues. Build the things that *are* your competitive edge or your correctness boundary — the **ledger** and the **fraud** engine in a payments business. Don't build a worse Stripe; don't outsource your source of truth.
:::

## Speed vs robustness

Move fast — but there's a floor. **Never cut correctness, security, or segregation of duties** to ship sooner. These are the things that are catastrophic and unrecoverable when wrong. Everything else is negotiable against time-to-market.

## "Good enough" is anchored, not vibes

A design is good enough when it **meets the SLO / error budget with headroom** — not when it feels done. If you can't name the target it's measured against, you can't call it good enough.

## End with reversibility

The most useful sentence at the end of a decision is the **condition under which you'd change your mind**:

> *"This is right up to ~X. Past that, the trade-off flips and I'd revisit."*

:::note[Key Idea]
Reversible decisions deserve speed; irreversible ones deserve deliberation. Sharding a database is hard to undo — deliberate. A feature flag is trivially reversible — just ship it behind the flag. Match your rigour to the **cost of being wrong**.
:::
