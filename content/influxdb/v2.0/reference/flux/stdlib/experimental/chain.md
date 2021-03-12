---
title: experimental.chain() function
description: >
  The `experimental.chain()` function runs two queries in a single Flux script
  sequentially and outputs the results of the second query.
menu:
  influxdb_2_0_ref:
    name: experimental.chain
    parent: Experimental
weight: 302
---

The `experimental.chain()` function runs two queries in a single Flux script
sequentially and outputs the results of the second query.
Flux typically executes multiple queries in a single script in parallel.
Running the queries sequentially ensures any dependencies the second query has on
the results of the first query are met.

##### Applicable use cases
- Writing to a bucket and querying the written data in a single Flux script or
  [InfluxDB task](/influxdb/v2.0/process-data/get-started/).
- Execute queries sequentially in testing scenarios.

_**Function type:** Miscellaneous_

```js
import "experimental"

experimental.chain(
  first: query1,
  second: query2
)
```

## Parameters

### first
The first query to execute.

_**Data type:** Stream of tables_

### second
The second query to execute.

_**Data type:** Stream of tables_

## Examples

### Write to a bucket and query the written data
```js
import "experimental"

downsampled_max = from(bucket: "example-bucket-1")
  |> range(start: -1d)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> aggregateWindow(every: 1h, fn: max)
  |> to(bucket: "downsample-1h-max", org: "example-org")

average_max = from(bucket: "downsample-1h-max")
  |> range(start: -1d)
  |> filter(fn: (r) => r.measurement == "example-measurement")
  |> mean()

experimental.chain(
  first: downsampled_max,
  second: average_max
)
```
