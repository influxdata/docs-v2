---
title: Work with Prometheus counters
list_title: Counter
description: >
  Use Flux to query and transform Prometheus **counter** metrics.
  A _counter_ is a cumulative metric that represents a single
  [monotonically increasing counter](https://en.wikipedia.org/wiki/Monotonic_function)
  whose value can only increase or be reset to zero on restart.
menu:
  flux_0_x:
    name: Counter
    parent: Prometheus metric types
weight: 101
flux/v0.x/tags: [prometheus]
---

Use Flux to query and transform Prometheus **counter** metrics.

> A _counter_ is a cumulative metric that represents a single
> [monotonically increasing counter](https://en.wikipedia.org/wiki/Monotonic_function)
> whose value can only increase or be reset to zero on restart.
>
> {{% cite %}}[Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/#counter){{% /cite %}}

- Calculate the positive change in a counter
  - [`increase()`](/flux/v0.x/stdlib/universe/increase/)
  - Accounts for counter resets, but there may be some precision lost on reset depending on your scrape interval.

- Calculate the rate of change in a counter
  - [derivative()](/flux/v0.x/stdlib/universe/derivative/) (non-negative)
  - [aggregate.rate](/flux/v0.x)
