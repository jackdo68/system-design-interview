---
title: Choosing a Database
description: SQL vs NoSQL decided by access patterns and consistency, not by "scale" — the four NoSQL families, when each fits, and polyglot persistence.
sidebar:
  order: 2
---

"SQL or NoSQL?" is one of the most common interview forks. The weak answer picks on vibes ("NoSQL scales"). The strong answer picks on **access pattern + consistency need**.

:::caution[Trap to avoid]
**"NoSQL because it scales" is wrong on its own.** Modern SQL scales to enormous sizes, and the wrong NoSQL model is *harder* to scale, not easier. Decide on **how you read and write the data** and **how strong your consistency must be** — not on a scale buzzword.
:::

## Start with SQL (relational)

Reach for a relational database (Postgres, MySQL) **by default**. Pick it when you have:

- **Relationships and joins** — data that references other data.
- **Transactions** — multiple changes that must succeed or fail together (<abbr title="ACID — database guarantees that a transaction is Atomic, Consistent, Isolated, and Durable: it fully succeeds or fully fails, and survives crashes.">ACID</abbr>). A money transfer is the classic case.
- **Ad-hoc queries** — you don't know every query in advance and want flexible `WHERE`/`JOIN`/`GROUP BY`.
- **Strong consistency** — read-your-writes, no surprises.

**Example:** a payments ledger → **Postgres**. You need ACID transactions and the books to always balance. → [Consistency](../../concepts/consistency/)

## Reach for NoSQL when the pattern fits

NoSQL isn't one thing — it's four families, each good at a specific shape:

| Family | Shape | Good at | Examples | Use when |
| --- | --- | --- | --- | --- |
| **Key-Value** | `key → blob` | Fastest possible lookups | Redis, DynamoDB | Sessions, caches, feature flags |
| **Document** | JSON docs | Flexible, nested objects | MongoDB, Firestore | Catalogs, user profiles, content |
| **Wide-column** | rows with huge, sparse columns | Massive write throughput, time-series | Cassandra, Bigtable | Event logs, metrics, IoT |
| **Graph** | nodes + edges | Relationship traversal | Neo4j | Social graphs, fraud rings, recommendations |

**Do this — the decision:**

1. **Write the top 3–5 queries** your API runs.
2. **Can they be served by a primary-key lookup or a known index?** → a KV or document store is fast and cheap.
3. **Do they need joins, transactions, or ad-hoc filtering?** → relational.
4. **Is it a relationship-traversal problem** ("friends of friends", "accounts linked to this fraud ring")? → graph.

:::tip[Principal Move]
It's good to frame it this sharply at principal level — but for a senior, you should at least choose SQL vs NoSQL from your **access patterns and consistency need**, not from "scale". The real question is: **"What are my access patterns, and how strong must consistency be?"** NoSQL stores make you design the schema *around the query* up front — fast if you know the query, painful if it changes. SQL keeps you flexible at the cost of some scaling work later. Name that trade-off out loud.
:::

## Polyglot persistence

You don't pick *one* database for the whole system — you pick the right one **per workload**:

**Example — a payments app:**

- **Postgres** for the ledger (ACID, source of truth).
- **Redis** for sessions and the idempotency-key store (fast KV).
- **Elasticsearch** for transaction search (full-text + filtering).
- **Cassandra** for the high-volume audit/event log (write-heavy, time-series).

:::note[Key Idea]
Pick the database from the **read/write pattern and consistency need of each workload**, not a single house bet. Then the *scaling* of that store — replicas, sharding, indexes — is a separate, later decision. → [Scalability](../../concepts/scalability/) · [Sharding](../../deep-dives/sharding/) · [Indexing](../../performance/indexing/)
:::
