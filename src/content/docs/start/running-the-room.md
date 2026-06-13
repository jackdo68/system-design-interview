---
title: Running the Room
description: The in-room playbook and whiteboard loop — clarify, estimate, sketch, deep-dive the risky parts, then failure modes and evolution.
sidebar:
  order: 2
---

How you *run the session* is half the signal. A principal drives a structured conversation; they don't free-associate boxes.

## The whiteboard loop

```text
1 Scope      2 Estimate     3 High level   4 Deep dive   5 Failure      6 Wrap
clarify  →   ~TPS, p99,  →  sketch boxes → risky parts → modes +    →  trade-offs +
reqs         durability                                  evolution     "I'd revisit…"
```

### 1 · Clarify requirements (functional + non-functional)

Pin down both:

- **Functional** — what must it do? (move money, show a statement, notify the user)
- **Non-functional (NFR)** — the numbers that drive the architecture: throughput, latency budget, durability, consistency, availability target.

:::tip[Principal Move]
**State your assumptions on the board** and invite correction: *"~5k TPS peak, p99 < 300 ms on the sync path, RPO = 0 for the ledger, multi-tenant and regulated."* Now everyone is designing against the same target, and you've shown you think in budgets.
:::

### 2 · Estimate

Back-of-envelope the load so the design is anchored: peak TPS, read/write ratio, payload size, data growth/retention, fan-out. You don't need precision — you need the **order of magnitude** that decides single-box vs sharded.

### 3 · High level — sketch the boxes

Draw the coarse component diagram and the **happy-path request flow** end to end. Keep it coarse on purpose; you'll go deep only where it's risky.

### 4 · Deep-dive the risky parts

Pick the 1–2 components where the **hard trade-off lives** (the ledger, the idempotency layer, the fraud check) and go deep there. Spending equal time everywhere is a junior signal.

### 5 · Failure modes + evolution

This is where principals separate themselves. For the risky parts, walk:

- **Failure modes** — what happens when this dependency times out, this node dies mid-operation, this partition splits?
- **Evolution** — how does this design hold at **1× vs 100×**? What breaks first, and what's the next move?

### 6 · Wrap

Summarise the key trade-offs and end with the **condition you'd revisit** (reversibility).

## Per-choice checklist

For each significant choice, hit all six:

> **why** / **rejected alternative** / **trade-off** / **how it fails** / **how it evolves** / **when I'd revisit**

## The bank lens (carry it into the room)

- **Correctness > availability**, audit, segregation of duties, fraud first-class.
- These reframe defaults: you'll often choose to **refuse** rather than serve a possibly-wrong answer.

:::caution[Trap to avoid]
Jumping straight to boxes without clarifying NFRs. If you design before you know the p99 budget and durability requirement, you'll design the wrong system confidently — the worst outcome.
:::
