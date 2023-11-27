---
title: experimental.chain() function
description: >
  `experimental.chain()` runs two queries in a single Flux script sequentially and outputs the
  results of the second query.
menu:
  flux_v0_ref:
    name: experimental.chain
    parent: experimental
    identifier: experimental/chain
weight: 101

introduced: 0.68.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L450-L450

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.chain()` runs two queries in a single Flux script sequentially and outputs the
results of the second query.

Flux typically executes multiple queries in a single script in parallel.
Running the queries sequentially ensures any dependencies the second query
has on the results of the first query are met.

##### Applicable use cases
- Write to an InfluxDB bucket and query the written data in a single Flux script.

  _**Note:** `experimental.chain()` does not guarantee that data written to
  InfluxDB is immediately queryable. A delay between when data is written and
  when it is queryable may cause a query using `experimental.chain()` to fail.

- Execute queries sequentially in testing scenarios.

##### Function type signature

```js
(first: stream[A], second: stream[B]) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### first
({{< req >}})
First query to execute.



### second
({{< req >}})
Second query to execute.




## Examples

### Write to a bucket and query the written data

```js
import "experimental"

downsampled_max =
    from(bucket: "example-bucket-1")
        |> range(start: -1d)
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> aggregateWindow(every: 1h, fn: max)
        |> to(bucket: "downsample-1h-max", org: "example-org")

average_max =
    from(bucket: "downsample-1h-max")
        |> range(start: -1d)
        |> filter(fn: (r) => r.measurement == "example-measurement")
        |> mean()

experimental.chain(first: downsampled_max, second: average_max)

```

