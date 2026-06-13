---
title: Leadership
description: ADRs, paved roads, aligning on interfaces not implementations, influence through reasoning, and blameless postmortems.
sidebar:
  order: 13
---

At principal level, the technical questions come wrapped in leadership ones: how do you make a decision durable, scale your judgement across teams, and recover from failure without blame?

## ADRs — durable decisions

:::tip[Principal Move]
Write **Architecture Decision Records**: **context / options / decision / consequences.** An ADR captures *why* a decision was made so it isn't **re-litigated** every six months by someone who wasn't there. It also makes reversal honest — when the context changes, you can see whether the original reasoning still holds.
:::

## Paved road / golden path

Give teams a **paved road** — the supported, well-lit way to build a service (templates, libraries, pipelines, observability baked in). Teams get **autonomy within guardrails**: stay on the road and you move fast with safety; step off it and you own the consequences. This scales good practice without central bottlenecks.

## Align on interfaces, not implementations

:::note[Key Idea]
Standardise the **interfaces and standards** between teams (API contracts, event schemas, SLOs), **not the implementations** behind them. Over-standardising implementation kills autonomy and innovation; under-standardising interfaces creates an integration swamp. The seam is where alignment pays off.
:::

## Influence, don't mandate

Drive change through **reasoning and enabling**, not authority. RFCs, design reviews, and a well-argued ADR persuade engineers and leave them owning the decision. A mandate gets compliance; influence gets commitment — and commitment survives you leaving the room.

## Blameless postmortems

When something breaks, run a **blameless postmortem**: assume everyone acted reasonably given what they knew, and fix the **system** that let the error through. Produce **tracked action items** with owners. Blame produces silence and hidden incidents; blamelessness produces the honest information you need to actually get safer. **Mentor the thinking**, not just the fix.

## The principal's job

> **"Maximise org output, not my keyboard."**

Your leverage is the decisions you enable, the standards you set, and the engineers you level up — not the lines you personally write. The best principal makes a hundred other engineers slightly better and a few critical decisions much better.
