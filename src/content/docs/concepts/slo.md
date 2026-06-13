---
title: SLI / SLO / SLA
description: The difference between the three, why you never target 100%, and how the error budget turns reliability into a decision tool.
sidebar:
  order: 7
---

These three are constantly confused. Getting them crisp is an easy way to sound senior — and the **error budget** is the real prize.

## The three, precisely

- **SLI — Service Level Indicator.** A **measured** number: e.g. the proportion of requests served < 300 ms over the last 30 days.
- **SLO — Service Level Objective.** Your **internal target** for an SLI: e.g. "99.9% of requests < 300 ms."
- **SLA — Service Level Agreement.** A **contract** with a customer, with **penalties** if breached. Always *looser* than your SLO — you want internal headroom before you owe money.

> SLI = what you measure · SLO = the target you hold yourself to · SLA = the promise with teeth.

## Never target 100%

:::caution[Trap to avoid]
**Never set an SLO of 100%.** It's infinitely expensive, impossible to hit, and leaves no room to ship. The last few nines cost exponentially more than the first. Pick the lowest reliability your users won't notice — that headroom is your budget to move fast.
:::

## The error budget

:::tip[Principal Move]
**Error budget = 1 − SLO.** A 99.9% SLO gives you a 0.1% budget to *spend* — on deploys, experiments, risk.

- Budget healthy → ship features, take risks.
- **Burning the budget fast → freeze risky changes and invest in stability.**

This turns reliability from an argument into a **shared, data-driven decision**: the budget, not opinion, decides whether you ship or stabilise.
:::

## Alerts must be actionable

:::note[Key Idea]
**Every alert is actionable + has a runbook, or it's deleted.** An alert nobody can act on is noise, and noise causes **alert fatigue** — the real alert gets ignored at 3am. Page on **symptoms** (user-facing SLO burn), not **causes** (one server's CPU). See [Alerting](../../deep-dives/alerting/).
:::
