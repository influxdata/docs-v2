---
title: universe package
description: >
  The `universe` package provides options and primitive functions that are
  loaded into the Flux runtime by default and do not require an
  import statement.
menu:
  flux_0_x_ref:
    name: universe (built-in)
    parent: stdlib
    identifier: universe
weight: 10
cascade:

  introduced: 0.14.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `universe` package provides options and primitive functions that are
loaded into the Flux runtime by default and do not require an
import statement.

## Constants

```js
inf
```

- **inf** represents a floating point value of infinity.

## Options

```js
option now = system.time
```
 
### now

`now` is a function option that, by default, returns the current system time.

#### now() vs system.time()
`now()` returns the current system time (UTC). `now()` is cached at runtime,
so all executions of `now()` in a Flux script return the same time value.
`system.time()` returns the system time (UTC) at which `system.time()` is executed.
Each instance of `system.time()` in a Flux script returns a unique value.

## Functions

{{< children type="functions" show="pages" >}}
