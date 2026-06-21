---
title: Observability
description: Metrics, logs, traces; the Golden Signals, RED and USE; cardinality; and why you alert on the p99 tail, not the average.
sidebar:
  order: 6
---

Monitoring answers questions you knew to ask. **Observability** lets you answer **new** questions about production **without shipping new code**. The difference matters in an incident.

## The three pillars

- **Metrics** — cheap, aggregated numbers over time (counters, gauges, histograms).
- **Logs** — discrete, high-detail events.
- **Traces** — the path of one request across services (use **OpenTelemetry / OTel** as the vendor-neutral standard).

## Golden Signals, RED, USE

Three overlapping frameworks — know which fits what:

- **4 Golden Signals** (Google <abbr title="SRE — Site Reliability Engineering: Google's discipline of running production systems with software-engineering practices.">SRE</abbr>): **Latency, Traffic, Errors, Saturation.**
- **RED** (per service): **Rate, Errors, Duration.**
- **USE** (per resource): **Utilisation, Saturation, Errors.**

:::tip[Principal Move]
It's good to watch these proactively at principal level — but for a senior, you should at least alert on the **p99 tail, not the average.** An average hides the users having a terrible time — if p50 is 50 ms but p99 is 4 s, 1% of requests are timing out and the mean looks fine. And watch **saturation as a leading indicator**: queues filling and pools nearing capacity predict the outage *before* errors spike.
:::

## Reliability vocabulary

- **MTTD** — mean time to **detect**.
- **MTTA** — mean time to **acknowledge**.
- **MTTR** — mean time to **recover**.
- **MTBF** — mean time **between failures**.
- **Nines** — `99.9%` ≈ **8.7 hours/year** of downtime; `99.99%` ≈ 52 min/year.

## Cardinality — the cost trap

:::caution[Trap to avoid]
**Cardinality = the number of distinct values** a field can take. Put it in the wrong place and you blow up cost.

- **Low cardinality** (method, status code, region) → **metric labels**. A handful of series.
- **High cardinality** (userId, requestId, IP) → **logs and traces**, **never metric labels**. Each distinct value creates a new time series → **series explosion** → your metrics bill and storage detonate.

Rule of thumb: **aggregate on low cardinality, debug on high cardinality.**
:::

:::note[Key Idea]
Instrument for the questions you *can't* predict. The point of traces and high-cardinality logs is that during a novel incident you can slice by a dimension nobody thought to pre-aggregate — that's observability, not just monitoring.
:::

See [Alerting](../../deep-dives/alerting/) for Datadog/CloudWatch specifics.
