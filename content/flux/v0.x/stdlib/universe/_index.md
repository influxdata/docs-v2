---
title: Flux Universe package (Built-in)
list_title: Universe package (Built-in)
description: >
  The Flux `universe` package includes all functions that do not require a package import statement and are usable without any extra setup.
  Functions in the `universe` package provide a foundation for working with data using Flux.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/
  - /influxdb/cloud/reference/flux/stdlib/built-in/
menu:
  flux_0_x_ref:
    name: universe (built-in)
    identifier: universe
    parent: Standard library
weight: 10
flux/v0.x/tags: [built-in, functions, package]
---

he Flux `universe` package includes all functions that do not require a package import statement and are usable without any extra setup.
The "built-in" functions in the `universe` package provide a foundation for working with data using Flux.

## Options
The `universe` package provides the following options:

```js
option now = () => system.time
```

### now {data-type="function"}
Function option that, by default, returns the current system time.
The value of `now()` is cached at query time, so all instances of `now()` in a
script return the same time value.

## Functions
{{< children type="functions" >}}
