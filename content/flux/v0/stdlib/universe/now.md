---
title: now() function
description: >
  `now()` is a function option that, by default, returns the current system time.
menu:
  flux_v0_ref:
    name: now
    parent: universe
    identifier: universe/now
weight: 101
flux/v0/tags: [date/time]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L43-L43

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`now()` is a function option that, by default, returns the current system time.

#### now() vs system.time()
`now()` returns the current system time (UTC). `now()` is cached at runtime,
so all executions of `now()` in a Flux script return the same time value.
`system.time()` returns the system time (UTC) at which `system.time()` is executed.
Each instance of `system.time()` in a Flux script returns a unique value.

##### Function type signature

```js
() => time
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}


## Examples

- [Use the current UTC time as a query boundary](#use-the-current-utc-time-as-a-query-boundary)
- [Define a custom now time](#define-a-custom-now-time)

### Use the current UTC time as a query boundary

```js
data
    |> range(start: -10h, stop: now())

```


### Define a custom now time

```js
option now = () => 2022-01-01T00:00:00Z

```

