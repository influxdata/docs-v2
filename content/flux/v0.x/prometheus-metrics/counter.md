---
title: Work with Prometheus counters
list_title: Counter
description: >
  ...
menu:
  flux_0_x:
    name: Counter
    parent: Prometheus metric types
weight: 101
flux/v0.x/tags: [prometheus]
---

- Calculate the positive change in a counter
  - [`increase()`](/flux/v0.x/stdlib/universe/increase/)
  - Accounts for counter resets, but there may be some precision lost on reset depending on your scrape interval.

- Calculate the rate of change in a counter
  - [derivative()](/flux/v0.x/stdlib/universe/derivative/) (non-negative)
  - [aggregate.rate](/flux/v0.x)