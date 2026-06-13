---
title: Caching
description: Cache layers, read/write strategies, eviction, invalidation, and the classic failure modes — stampede, staleness, hot keys.
sidebar:
  order: 2
---

Caching is the highest-leverage latency and cost win — and the richest source of subtle correctness bugs. Know the strategy *and* its failure mode.

## Layers

Cache can live at several layers; each cuts a different cost:

- **CDN** — static & cacheable responses at the edge, closest to the user.
- **Client** — browser/app local cache.
- **Application** — a shared in-memory store like **Redis**.
- **Database** — buffer pool / query cache.

## Read/write strategies

| Strategy | How it works | Best for |
| --- | --- | --- |
| **Cache-aside** | App checks cache; on miss, loads from DB and populates | Default; read-heavy, tolerant of slightly stale |
| **Read-through** | Cache library loads from DB on miss | Same, with cache owning the fetch |
| **Write-through** | Write goes to cache **and** DB synchronously | Consistency-sensitive reads right after write |
| **Write-behind** | Write to cache, flush to DB async | Write-heavy, can tolerate loss window |

## Eviction

- **LRU** — evict least *recently* used.
- **LFU** — evict least *frequently* used.
- **TTL** — expire after a fixed time.

## Invalidation — the hard part

> *"There are only two hard things in computer science: cache invalidation and naming things."*

Options:

- **TTL** — simplest; bounded staleness.
- **On-write** — invalidate/update the key when the source changes.
- **CDC** — drive invalidation from the database change stream.
- **Versioned key** — bake a version into the key so old entries are simply never read.

## Failure modes

:::caution[Trap to avoid]
- **Stampede / thundering herd** — a hot key expires and thousands of requests hit the DB at once. Fix: **request coalescing** (single-flight) + **jittered TTL** so keys don't all expire together.
- **Staleness** — serving data older than the business tolerates.
- **Hot key** — one key concentrates traffic onto one node.
:::

## The bank rule

:::danger[Never]
**Never cache an authoritative balance for a debit.** A cached balance can be stale by the time you act on it, and you'll authorise a payment that should have been declined. Read the balance from the system of record, transactionally, at decision time.
:::

Go deeper in [Caching Internals](../../deep-dives/caching/).
