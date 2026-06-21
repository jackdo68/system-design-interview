---
title: API Design & Data Modeling
description: Design the contract first, then model the data around your access patterns — resources, idempotency, pagination, versioning, and normalize-vs-denormalize.
sidebar:
  order: 1
---

Once you know the requirements, the first thing you *build* is the **contract** (the API) and the **shape of the data** behind it. Get these right and the rest of the design falls out of them; get them wrong and everything downstream fights you.

## Part 1 — Design the API (the contract)

The API is the promise your system makes to its callers. Define it before internals — it maps almost directly to your functional requirements.

**Do this:**

- **Pick a style:** **REST** (default), **GraphQL** (diverse clients, avoid over-fetching), or **gRPC** (internal, performance-critical).
- **One endpoint per functional requirement** — this becomes your design checklist.
- **Resources are plural nouns**, actions are HTTP verbs: `GET /payments`, `POST /payments`, not `/getPayment`.
- **Identity comes from the auth token**, never from the request body. → [Authentication](../auth/)

**Example:**

```text
POST /v1/payments        body: { "amount": 5000, "currency": "AUD", "dest": "acc_123" }
                         header: Idempotency-Key: <client-uuid>
GET  /v1/payments/{id} → Payment
GET  /v1/payments?limit=20&cursor=<token> → { items: Payment[], next: cursor }
```

**The four details interviewers look for:**

- **Idempotency** — a client-minted `Idempotency-Key` so a retried `POST` doesn't charge twice. → [Idempotency](../../concepts/idempotency/)
- **Pagination** — return a **cursor**, not an offset (offset gets slow and skips rows as data shifts). `?cursor=...&limit=...`.
- **Versioning** — put `/v1/` in the path so you can evolve without breaking clients.
- **Error shape** — a consistent body (`{ code, message, retryable }`) so callers can act, not guess.

## Part 2 — Model the data (shape it around your queries)

:::tip[Principal Move]
It's good to have this instinct at principal level — but for a senior, you should at least list your API's main reads and writes and make sure the common ones are cheap (indexed lookups, no surprise joins). The fuller principal habit: **model for your access patterns, not for tidiness.** Don't design the "perfect" normalized schema in the abstract — let the query pattern drive the model, not the other way around.
:::

**Do this:**

1. **List the core entities** (the nouns): `User`, `Account`, `Payment`, `LedgerEntry`.
2. **Map the relationships** (one-to-many, many-to-many): a `User` has many `Account`s; a `Payment` touches two `Account`s.
3. **Write down the top queries** each endpoint runs ("get a user's last 20 payments").
4. **Shape the schema** so those queries are a simple, indexed lookup.

### Normalize vs denormalize

| | **Normalize** (split into related tables) | **Denormalize** (duplicate data together) |
| --- | --- | --- |
| Optimises | Writes & correctness — one source of truth | Reads — everything in one place |
| Cost | Reads need joins | Writes must update every copy |
| Use when | Data changes often, consistency matters | Read-heavy, joins are the bottleneck |

**Example — a feed:** storing each post once is normalized (clean writes), but rendering a feed then needs an expensive join across follows. Denormalizing (a precomputed per-user feed) makes the read a single lookup — at the cost of fan-out work on every write. That's the classic [fan-out trade-off](../monolith-vs-distributed/), and it's a *modeling* decision before it's a scaling one.

:::note[Key Idea]
Start normalized; denormalize **deliberately** when a specific read is too slow, and say what it costs you (every write now maintains the duplicate). Which datastore makes these trade-offs easy is the next decision → [Choosing a Database](../database-choice/).
:::
