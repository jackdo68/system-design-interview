---
title: Chaos & DR
description: Chaos engineering with a hypothesis and blast radius, game days, and disaster recovery — RTO/RPO and the strategy ladder.
sidebar:
  order: 12
---

You don't know your system is resilient until you've broken it on purpose. Chaos proves the resilience patterns work; DR proves you survive losing a region.

## Chaos engineering

:::tip[Principal Move]
Chaos is not "randomly break things." It's a **controlled experiment**: a **hypothesis**, a **small blast radius**, and a **stop button**.

> *"I believe if I kill one AZ, traffic fails over within 30s with no errors. Let's verify — on 1% of traffic, with an abort switch."*

If the hypothesis holds, you've earned confidence. If it doesn't, you found the bug before your customers did.
:::

### What to inject

- Kill a **pod / AZ / region**.
- Add **latency**; **drop** traffic.
- Kill the **DB mid-saga** — do the compensations run correctly?
- **Replay a duplicate** — is the consumer idempotent?
- **Clock skew** between nodes.

### Game days

Scheduled, organised chaos with the team present. They test the **people and process**, not just the system: Do the runbooks work? Is **MTTR** what you think? Does the on-call know what to do?

## Disaster Recovery

- **DR** = survive losing a **region**.
- **HA** = survive losing a **component** (node, AZ).

### RTO and RPO

The two numbers that define your DR posture:

- **RTO — Recovery Time Objective** — how much **downtime** you can tolerate.
- **RPO — Recovery Point Objective** — how much **data loss** you can tolerate. (Ledger: **RPO = 0** — lose nothing.)

### The strategy ladder

More resilience costs more money — climb to your requirement, not beyond:

| Strategy | RTO/RPO | Cost |
| --- | --- | --- |
| **Backup & restore** | Hours / hours | $ |
| **Pilot light** | Tens of min | $$ |
| **Warm standby** | Minutes | $$$ |
| **Active-active** | ~Zero / ~Zero | $$$$ |

:::danger[Never]
**An untested backup is hope, not a backup.** If you've never run a restore, you don't have DR — you have a folder you believe in. Test restores on a schedule; a backup that can't be restored is worse than none because it gives false confidence.
:::

See [Disaster Recovery](../../deep-dives/disaster-recovery/) for the strategy ladder in depth.
