---
title: Scalability
description: Vertical vs horizontal, statelessness, decomposition, queue vs log, and database scaling from read replicas to sharding to CQRS.
sidebar:
  order: 1
---

Scaling is about removing the next bottleneck without creating a worse one. Know **which** bottleneck each move solves and what it costs.

## Vertical vs horizontal

- **Vertical** = bigger box. Simple, but has a **ceiling** and remains a single point of failure (SPOF).
- **Horizontal** = more boxes. No hard ceiling, survives a node loss — but **requires statelessness** and adds coordination.

:::tip[Principal Move]
Reach for vertical first when it buys you time cheaply, then go horizontal when you hit the ceiling or need HA. Say *which* you're doing and *why*.
:::

## Statelessness is the enabler

Horizontal scaling only works if the compute tier is **stateless** — push state into a DB, cache, or token. Pay-off:

- Any request can hit any node → scale out freely behind a load balancer.
- **Rolling deploys** become trivial (no sticky sessions to drain).

## Decompose by capability and data ownership

Split services along **business capability + data ownership**, not technical layers. **Start coarse** — a handful of services you understand — and split further only when a seam genuinely hurts (independent scaling, independent deploy, team boundaries).

:::caution[Trap to avoid]
Premature microservices. A dozen services on day one means you've paid all the distributed-systems tax (network failures, partial failure, distributed transactions) before you have the scale to justify it. Start coarse.
:::

## Queue vs log

A frequently-decisive choice:

| | **Queue** (SQS, RabbitMQ) | **Log** (Kafka, Kinesis) |
| --- | --- | --- |
| On consume | **Delete** on consume | **Retained** — offset advances |
| Consumers | Typically one logical consumer | **Multiple** independent consumers |
| Replay | No | **Yes** — rewind the offset |
| Use when | Work distribution, fire-and-forget tasks | Event sourcing, replay, fan-out to many readers |

> **Log = replay + multi-consumer. Queue = delete-on-consume.** If you'll ever need to add a new consumer that reprocesses history, you want a log.

## Database scaling ladder

Climb only as far as you need:

1. **Read replicas** — scale *reads*. Cost: **replication lag** → replicas serve slightly stale data. Never read an authoritative balance for a debit from a replica.
2. **Shard by key** — scale *writes* by partitioning data across nodes. Costs: **hot shards** (skewed keys) and **cross-shard operations** (joins, transactions) become hard.
3. **CQRS** — split the write model from one or more read models, each optimised for its access pattern. Adds eventual consistency between them.

:::note[Key Idea]
Each rung trades simplicity for headroom. Read replicas add staleness; sharding adds cross-shard pain; CQRS adds eventual consistency. Climb deliberately and name the cost you just took on. See [Sharding & Partitions](../../deep-dives/sharding/).
:::
