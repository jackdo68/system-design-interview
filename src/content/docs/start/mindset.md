---
title: The Principal Mindset
description: The mental shift from senior to principal — name the decision, the rejected alternative, the trade-off, and the failure mode at 10×.
sidebar:
  order: 1
---

The interview is not testing whether you know Kafka. It's testing whether you can be **trusted with an ambiguous, high-stakes decision** and reason about it out loud so others can follow, challenge, and own it after you leave the room.

> **Reasoning > tech. Name the trade-off every time.**

## The shift: senior describes, principal decides

A senior engineer can describe a working system and the components in it. A principal makes the **decision** — chooses the component — and crucially carries four things with every choice:

:::tip[Principal Move]
For a **senior**, you should at least name **the decision and the trade-off** for every meaningful choice. To signal **principal** level, say the full four-part line out loud:

1. **The decision** — what I'm choosing.
2. **The alternative rejected** — and why.
3. **The trade-off accepted** — what this costs me.
4. **The failure mode** — how it breaks, and how it evolves from 1× to 100× the traffic.
:::

This is the single highest-leverage habit. It converts "I'd use a queue" (a junior signal) into "I'd use a log over a queue here because I need replay and multiple consumers; I accept the operational weight of Kafka; it fails by consumer-group lag, which I'd monitor" (a principal signal).

## Name the property, then the tech

Don't lead with technology. Lead with the **property you need**, then reach for the tool that provides it.

- "I need an authoritative, auditable record that I'd rather refuse than corrupt" → **<abbr title="Consistency under Partition — when the network between servers splits, the system refuses writes it can't confirm rather than risk a wrong answer.">CP</abbr>, <abbr title="ACID — database guarantees that a transaction is Atomic, Consistent, Isolated, and Durable: it fully succeeds or fully fails, and survives crashes.">ACID</abbr>, double-entry ledger**.
- "I need this to absorb a spike without dropping the critical path" → **queue + backpressure + load-shed**.
- "I need safe retries across an unreliable network" → **idempotency keys**.

:::caution[Trap to avoid]
Naming a technology before the requirement. If you say "I'd use DynamoDB" before anyone knows the access pattern, you've shown you reach for tools, not requirements. State the access pattern and consistency need first; the datastore falls out of it.
:::

## The bank lens

This manual is worked through a **bank-grade, regulated payments platform**, because it forces the hardest version of every trade-off. Carry this lens:

- **Correctness > availability.** A ledger would rather refuse a write than be wrong.
- **Audit everything** — immutable logs, who did what, when.
- **Segregation of duties** — initiator ≠ approver.
- **Fraud is first-class**, not bolted on.

## End every answer with reversibility

Close a decision by naming the **condition under which you'd revisit it**. This shows you know decisions are made with today's information and that you've built in a tripwire.

> *"I'd revisit sharding the ledger once write throughput nears the primary's ceiling."*

:::note[Key Idea]
"Good enough" is not a vibe — it's **anchored to an <abbr title="Service Level Objective — a specific reliability target you commit to, e.g. 99.9% of requests succeed. The error budget is the small amount of failure that target still allows.">SLO</abbr> / error budget**. A decision is good enough when it meets the target with headroom, and you can say what would make it not good enough.
:::

## "Maximise org output, not my keyboard"

At principal level, your impact is the **decisions and standards you enable**, not the code you personally type. Influence through reasoning, <abbr title="RFC — Request for Comments: a written design proposal shared with the team so others can review and agree before you build.">RFCs</abbr>, and design reviews — not by giving orders. More on this in [Leadership](../concepts/leadership/).
