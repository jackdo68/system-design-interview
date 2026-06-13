---
title: Question Bank
description: Model answers and curveballs — the questions you'll actually get, with answers that name the trade-off. Try each before expanding.
sidebar:
  order: 1
---

Study mode: read the question, answer it **out loud**, then expand the model answer. The goal isn't to memorise — it's to rehearse naming the decision, the rejected alternative, the trade-off, and the failure mode.

## Distributed systems & data

<details>
<summary><strong>Why is a naïve retry dangerous, and what makes a retry safe?</strong></summary>

A naïve retry amplifies failure: when a dependency blips, thousands of callers fail and retry **simultaneously**, tripling load and keeping it down — a self-inflicted DDoS (retry storm). It can also double-apply non-idempotent effects.

Safe retry needs three things together: the operation is **idempotent** (or guarded by an [idempotency key](../../concepts/idempotency/)); **exponential backoff with jitter** so retries don't synchronise; and a **retry budget** capping retries to a small % of traffic. *Trade-off:* added latency and complexity for stability under partial failure.
</details>

<details>
<summary><strong>A client retries a payment and you receive the request twice. How do you guarantee one charge?</strong></summary>

A **client-minted idempotency key**, stable across retries. **Atomically claim** it with a unique `INSERT` (never check-then-act), and store the **key + effect in one transaction**. On a duplicate: `COMPLETED` → return the stored result; `STARTED` → 409; same key + different body → 422. For the external PSP call, pass the key down as the **provider idempotency key** and/or use the **outbox** pattern. Key on the **domain ID**, not the transport `MessageId`.
</details>

<details>
<summary><strong>CAP says pick two. Which do you pick for a ledger, and which for notifications?</strong></summary>

CAP is really: *under a partition*, choose C or A. **Ledger = CP** — refuse the write rather than risk a wrong balance; correctness is unrecoverable if lost. **Notifications/analytics = AP** — stay available, accept eventual consistency; a late notification is harmless. The senior move is making the choice **per component**, and adding **PACELC**: even without a partition, stronger consistency costs latency.
</details>

<details>
<summary><strong>Why saga over two-phase commit?</strong></summary>

2PC needs a coordinator that locks all participants and blocks until commit — it's a SPOF and the locks kill throughput at scale. A **saga** is local transactions plus **compensating actions** that reverse completed steps on failure. *Trade-off:* you accept a window of inconsistency and must design (and test) every compensation, in exchange for no global locks and far better scalability. Compensations must themselves be idempotent.
</details>

## Resilience & operations

<details>
<summary><strong>The PSP call times out and you don't know if it succeeded. What do you do?</strong></summary>

**Don't assume failure** — that's how you double-spend. Treat the outcome as unknown: keep the **debit hold** in place, then **reconcile** via a status/pull call to the provider. Because the original call carried an **idempotency key**, a retry is safe and won't double-charge. Resolve to success or failure from the reconciliation, then notify the customer with the reference. Ambiguous timeouts are exactly why idempotency + reconciliation exist.
</details>

<details>
<summary><strong>How do you alert without burning out on-call?</strong></summary>

Alert on **symptoms** (user-facing SLO burn, error rate, latency), not **causes** (one box's CPU). Use **multi-window burn-rate** alerts: fast burn pages, slow burn opens a ticket. Every alert is **actionable + has a runbook, or it's deleted**. Page on the p99 tail, not the average. Review alerts after each incident and prune the noise — alert fatigue is the real outage risk.
</details>

<details>
<summary><strong>Your service is overloaded. Scaling out the app tier didn't help. Why, and what now?</strong></summary>

Because the bottleneck is elsewhere — adding app servers in front of a saturated **database** just lengthens the queue at the DB. Find the constraining resource (USE: utilisation/saturation/errors), then either scale *that*, cut **W** (per-request time, via Little's Law `L = λW`), or **shed load** — reject low-priority traffic early and cheaply to protect the critical path. Never accept work you can't finish.
</details>

## Security & delivery

<details>
<summary><strong>How do you let 30 teams deploy independently without an integration-test bottleneck?</strong></summary>

**Consumer-driven contract testing** (Pact): each consumer records its expectations as a contract → broker → the provider verifies it satisfies every contract before deploy, gated by **can-I-deploy**. No shared staging environment, no big-bang integration suite. Combine with a **paved road** (golden templates), **feature flags** (deploy ≠ release), and **progressive delivery** (canary + auto-rollback) so independent deploys stay safe.
</details>

<details>
<summary><strong>How do you reduce PCI scope and prove what's running in prod?</strong></summary>

**Tokenize** card data at the edge so downstream systems only see tokens — they fall **out of PCI scope**. To prove production contents: generate an **SBOM** per build (answers "are we affected by this CVE?"), **sign artifacts** + record **provenance**, and gate deploys on signature/provenance via admission control. Add **GitOps + separation of duties + immutable audit** so every prod change is attributable.
</details>

## Curveballs

<details>
<summary><strong>"We don't need idempotency, the network is reliable." Push back.</strong></summary>

No network is reliable enough to skip it. Timeouts, retries, load-balancer re-sends, at-least-once queues, and user double-clicks all produce duplicates **without any network fault**. The cost of idempotency is one unique index and a state column; the cost of skipping it is a double charge and a customer-trust incident. It's cheap insurance against an inevitability, not a network-failure edge case.
</details>

<details>
<summary><strong>"Just cache the balance to hit the latency budget." Respond.</strong></summary>

Caching a **display** balance with a clear "as of" timestamp is fine. Caching the **authoritative** balance for a **debit decision** is not — a stale cached balance authorises a payment that should have declined, causing an overdraft you can't undo. Read the balance transactionally from the ledger at decision time; meet the latency budget elsewhere (faster ledger reads, async non-critical work), never by trading away correctness on the money path.
</details>

<details>
<summary><strong>"Make it 100% available." Respond.</strong></summary>

100% is the wrong target — infinitely expensive, impossible, and it leaves no room to ship. Pick the lowest reliability users won't notice (say 99.95%) and treat **1 − SLO as an error budget** to spend on deploys and experiments. When the budget burns fast, freeze risky changes and invest in stability. Reliability becomes a shared, data-driven decision instead of an absolute nobody can deliver.
</details>

<details>
<summary><strong>"Why not just use microservices for everything from day one?"</strong></summary>

Because you'd pay the entire distributed-systems tax — network failures, partial failure, distributed transactions, deployment complexity — before you have the scale or team boundaries to justify it. **Start coarse**: a few services aligned to business capabilities and data ownership. Split a seam only when it genuinely hurts (independent scaling/deploy, team autonomy). Decomposition is a response to real pressure, not a default.
</details>
