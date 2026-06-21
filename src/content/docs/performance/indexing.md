---
title: Indexing & Query Optimization
description: Indexes trade write/storage cost for read speed — index types, when they help or hurt, reading the query plan, and N+1 and pagination pitfalls.
sidebar:
  order: 5
---

When a specific query is slow, the answer is usually an **index** — but indexes aren't free, and adding the wrong ones makes the system *slower*. This is where "make it fast" gets concrete.

## What an index is (and its cost)

An index is a separate, sorted data structure that lets the database **find rows without scanning the whole table** — like the index at the back of a book instead of reading every page.

> **The trade:** an index makes matching **reads** dramatically faster, but every **write** must now also update the index, and the index takes **storage**. You're buying read speed with write speed and space.

:::caution[Trap to avoid]
**Don't index everything.** Each extra index slows down every `INSERT`/`UPDATE` and grows storage. Index the columns you actually **filter, join, or sort on** — and remove indexes nothing queries. Over-indexing is as real a problem as under-indexing.
:::

## Index types (know these three)

- **B-tree** — the default. Great for equality **and ranges** (`=`, `<`, `>`, `BETWEEN`, `ORDER BY`). 95% of cases.
- **Hash** — equality only (`=`), no ranges, but very fast for exact lookups.
- **Inverted index** — maps each word → the documents containing it. Powers **full-text search** (Elasticsearch). Use when you search *inside* text.

**Two refinements worth naming:**

- **Composite index** — an index on `(a, b)` together. Order matters: `(user_id, created_at)` makes "this user's rows, newest first" a single fast lookup. It only helps queries that use the columns **left-to-right**.
- **Covering index** — when the index contains *every* column the query needs, the DB answers from the index alone and never touches the table. The fastest kind of read.

## Read the query plan

:::tip[Principal Move]
It's good to optimize with evidence at principal level — but for a senior, you should at least **read the query plan** before adding indexes. Don't guess — ask the database. `EXPLAIN` (or `EXPLAIN ANALYZE`) shows the query plan. The thing you're hunting for:

- **Sequential scan** on a big table = it's reading every row → you probably need an index.
- **Index scan** = it's using an index → good.

Add the index, re-run `EXPLAIN`, and confirm the scan changed. That's how you optimize with evidence instead of folklore.
:::

## Common query pitfalls

Slow systems are often not missing an index — they're making **too many queries** or the wrong shape:

- **N+1 queries** — fetching a list (1 query), then looping and querying once **per item** (N queries). Fix by fetching together (a join or a single `WHERE id IN (...)`). This is the most common performance bug in real apps.
- **Offset pagination** — `LIMIT 20 OFFSET 10000` makes the DB count past 10,000 rows every time, and rows shift as data changes. Use **keyset (cursor) pagination**: `WHERE id > :last_seen ORDER BY id LIMIT 20`. → [API Design](../../design/api-data-modeling/)

:::note[Go deeper · Tech Unpack]
[The Database Performance Bottlenecks →](https://technunpack.substack.com/p/the-database-performance-bottlenecks) — a deeper tour of where database reads and writes actually slow down.
:::

## When indexing isn't enough

If the query is tuned and still too slow, climb the next rungs:

- **Read replicas** — send heavy reads to copies of the DB. Cost: replica lag. → [Scalability](../../concepts/scalability/)
- **Caching** — put hot results in Redis so the query doesn't run at all. → [Caching](../../concepts/caching/)
- **Materialized view** — precompute and store an expensive query's result, refreshed periodically.
- **Sharding** — split the data across nodes when one box can't hold the write load. → [Sharding](../../deep-dives/sharding/)

:::note[Key Idea]
The performance ladder: **right index → read the query plan → kill N+1 and offset pagination → replicas → cache → materialize → shard.** Climb only as far as the slow query forces you, and name the cost of each rung. Don't jump to sharding when the real fix was one composite index.
:::
