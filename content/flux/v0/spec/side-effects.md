---
title: Side effects
description: A summary of side effects in the Flux functional data scripting language.
menu:
  flux_v0_ref:
    parent: Flux specification
    name: Side effects
weight: 113
aliases:
  - /influxdb/v2/reference/flux/language/side-effects/
  - /influxdb/cloud/reference/flux/language/side-effects/
---

Side effects can occur in one of two ways.

1. By reassigning built-in options
2. By calling a function that produces side effects

A function produces side effects when it is explicitly declared to have side effects or when it calls a function that itself produces side effects.

{{< page-nav prev="/flux/v0/spec/statements/" next="/flux/v0/spec/system-built-ins/" >}}
