---
title: Monolith vs Distributed
description: Start with a modular monolith; split into services only when a real seam hurts. The pros, cons, the distributed tax, and how to decompose.
sidebar:
  order: 4
---

"Should this be a monolith or microservices?" The senior answer is almost always: **start with a monolith, split later — and only when something specific forces it.**

## Start monolithic (but modular)

A **monolith** is one deployable app. A **modular monolith** keeps clean internal boundaries (modules with clear interfaces) inside that single deployable. Start here because:

- **One thing to deploy, test, and debug** — no network between your own components.
- **Transactions are local** — no distributed-transaction headaches.
- **You can refactor boundaries cheaply** while you're still learning where they belong.

:::caution[Trap to avoid]
**Don't start with microservices.** A dozen services on day one means you pay the entire distributed-systems tax — network failures, partial failure, distributed transactions, deployment complexity — *before* you have the scale or team size to justify it. It's the most common over-engineering mistake in interviews.
:::

## When to split into services

Split a piece out only when you hit a **real, specific pressure**:

- **Independent scaling** — one component needs far more (or less) compute than the rest. *Example: the fraud-scoring engine is CPU-hungry; the rest isn't.*
- **Independent deployment** — a team needs to ship on its own cadence without redeploying everything.
- **Team boundaries (Conway's Law)** — separate teams own separate areas and the coordination cost is hurting.
- **Fault isolation** — a flaky component shouldn't be able to take the core down. → [Blast Radius](../../deep-dives/blast-radius/)
- **Different tech needs** — one part genuinely needs a different language/runtime.

> **Decompose by business capability + data ownership**, not by technical layer. "Payments", "Fraud", "Notifications" — each owning its data — are good seams. "Controllers", "Services", "DAOs" are not.

## The trade-off, side by side

| | **Monolith** | **Distributed (microservices)** |
| --- | --- | --- |
| Deploy | One unit, simple | Many units, independent |
| Scaling | Whole app together | Per-service |
| Transactions | Local, easy (ACID) | Distributed — need [sagas](../../concepts/consistency/) |
| Failure | One process | Partial failure everywhere — need [resilience](../../concepts/resilience/) patterns |
| Debugging | One stack trace | Distributed [tracing](../../concepts/observability/) needed |
| Team fit | Small teams | Many independent teams |
| Ops cost | Low | High (orchestration, networking, monitoring) |

## The distributed tax

Going distributed buys independence but you **must** then pay for:

- **The network** — every in-process call becomes a remote call that can be slow or fail. Timeouts, retries, circuit breakers everywhere. → [Resilience](../../concepts/resilience/)
- **Partial failure** — some services up, some down; the system must degrade gracefully.
- **Distributed transactions** — no more single ACID commit; you use [sagas with compensations](../../concepts/consistency/).
- **Operational weight** — service discovery, orchestration, distributed tracing, more on-call surface.

:::note[Key Idea]
Microservices are a **response to organizational and scaling pressure**, not a starting architecture. Begin with a modular monolith, keep the seams clean, and carve off a service the moment a *specific* pressure above makes the distributed tax worth paying. "I'd start monolithic and split X out when Y" is the answer that lands.
:::
