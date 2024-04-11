---
title: bigpanda.statusFromLevel() function
description: >
  `bigpanda.statusFromLevel()` converts an alert level to a BigPanda status.
menu:
  flux_v0_ref:
    name: bigpanda.statusFromLevel
    parent: contrib/rhajek/bigpanda
    identifier: contrib/rhajek/bigpanda/statusFromLevel
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/rhajek/bigpanda/bigpanda.flux#L75-L90

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bigpanda.statusFromLevel()` converts an alert level to a BigPanda status.

BigPanda accepts one of ok, warning, or critical,.

##### Function type signature

```js
(level: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### level
({{< req >}})
Alert level.

##### Supported alert levels
| Alert level | BigPanda status |
| :---------- | :--------------|
| crit        | critical        |
| warn        | warning         |
| info        | ok              |
| ok          | ok              |
_All other alert levels return a `critical` BigPanda status._


## Examples

- [Convert an alert level to a BigPanda status](#convert-an-alert-level-to-a-bigpanda-status)
- [Convert alert levels in a stream of tables to BigPanda statuses](#convert-alert-levels-in-a-stream-of-tables-to-bigpanda-statuses)

### Convert an alert level to a BigPanda status

```js
import "contrib/rhajek/bigpanda"

bigpanda.statusFromLevel(level: "crit")// Returns "critical"


```


### Convert alert levels in a stream of tables to BigPanda statuses

Use `map()` to iterate over rows in a stream of tables and convert alert levels to Big Panda statuses.

```js
import "contrib/rhajek/bigpanda"

data
    |> map(fn: (r) => ({r with big_panda_status: bigpanda.statusFromLevel(level: r._level)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _level  |
| -------------------- | ------- |
| 2021-01-01T00:00:00Z | ok      |
| 2021-01-01T00:01:00Z | info    |
| 2021-01-01T00:02:00Z | warn    |
| 2021-01-01T00:03:00Z | crit    |


#### Output data

| _level  | _time                | big_panda_status  |
| ------- | -------------------- | ----------------- |
| ok      | 2021-01-01T00:00:00Z | ok                |
| info    | 2021-01-01T00:01:00Z | ok                |
| warn    | 2021-01-01T00:02:00Z | warning           |
| crit    | 2021-01-01T00:03:00Z | critical          |

{{% /expand %}}
{{< /expand-wrapper >}}
