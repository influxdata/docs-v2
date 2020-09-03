---
title: Flux Profiler package
list_title: Profiler package
description: >
  The Flux Profiler package provides performance profiling tools for Flux queries and operations.
  Import the `profiler` package.
menu:
  influxdb_2_0_ref:
    name: Profiler
    parent: Flux standard library
weight: 202
influxdb/v2.0/tags: [functions, optimize, package]
---

The Flux Profiler package provides performance profiling tools for Flux queries and operations.
Import the `profiler` package:

```js
import "profiler"
```

## Options
The Profiler package includes the following options:

#### enabledProfilers
Use the `enabledProfilers` option to enable Flux profilers.

{{% note %}}
_Available profilers will be added as they are released._
{{% /note %}}

_**Data type:** Array of strings_

```js
import "profiler"

option profiler.enabledProfilers = [""]
```