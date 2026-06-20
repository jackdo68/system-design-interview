---
title: Load Shedding & Bottlenecks
description: Finding the real bottleneck, Little's Law, the difference between load and stress, and shedding load to protect the critical path.
sidebar:
  order: 8
---

When a system is overloaded, the instinct is to scale everything. The principal move is to **find the one bottleneck** and protect it — adding capacity elsewhere just feeds the queue in front of it.

## Find the bottleneck first

A system goes only as fast as its slowest resource. Use **USE** (Utilisation, Saturation, Errors) per resource to locate it:

- **Smoke** (rising p99/latency) tells you something is **saturating**.
- **Spike** (sudden load) vs **stress** (sustained beyond capacity) — different responses.
- **Breakpoint** — the load at which it falls over. Find it in a load test, not in production.

> Adding app servers in front of a saturated database just makes a longer queue at the database. Scale the bottleneck, or reduce what reaches it.

## Little's Law

:::tip[Principal Move]
**L = λ × W** — concurrent requests in the system (L) = arrival rate (λ) × time each spends (W).

This is the lens for capacity:

- If each request holds a connection for `W = 200 ms` and you get `λ = 5,000 req/s`, you have `L = 1,000` concurrent in flight — so you need a connection pool / thread budget that can hold 1,000, or you'll queue and tip over.
- Cut **W** (make requests faster) and **L** drops for the same throughput — often cheaper than adding capacity.
:::

## Load vs stress vs the critical path

- **Load** = normal expected demand.
- **Stress** = demand *beyond* designed capacity. The question isn't *if* you hit it but *how you behave* when you do.

The answer is **never** "fall over." It's **shed the non-critical load to protect the critical path.**

:::note[Go deeper · Tech Unpack]
[Why Your System Crashes Under Load — and How Kafka and SQS Push Back →](https://technunpack.substack.com/p/why-your-system-crashes-under-load) — queues and backpressure absorbing overload, in detail.
:::

## Shedding load gracefully

:::caution[Trap to avoid]
Under overload, **reject early and cheaply** — don't accept work you can't finish:

- **Prioritise** — drop low-value traffic (a background report) before high-value (a payment). Tier your endpoints.
- **Reject fast** — a quick `429 Too Many Requests` is far cheaper than accepting a request, holding resources, and timing out. The expensive failure is the one you accept and can't complete.
- **Backpressure** — signal upstream to slow down rather than silently buffering until you OOM.

The worst outcome is accepting everything and collapsing — then **nobody** gets served, including the payments.
:::

:::note[Key Idea]
Capacity planning is **Little's Law + the bottleneck**: find the constraining resource, compute the concurrency it must hold, and decide whether to add capacity, cut W, or shed load. Scaling blindly just relocates the queue.
:::
