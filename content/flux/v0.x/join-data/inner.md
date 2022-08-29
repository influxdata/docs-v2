---
title: Perform an inner join
list_title: Inner join
description: >
  Use [`join.inner()`](/flux/v0.x/stdlib/join/inner/) to perform an inner join of two streams of data.
  Inner joins drop any rows from both input streams that do not have a matching
  row in the other stream.
menu:
  flux_0_x:
    name: Inner join
    parent: Join data
weight: 101
related:
  - /flux/v0.x/stdlib/join/
  - /flux/v0.x/stdlib/join/inner/
list_code_example: |
  ```js
  import "join"

  left = from(bucket: "example-bucket-1") |> //...
  right = from(bucket: "example-bucket-2") |> //...

  join.inner(
      left: left,
      right: right,
      on: (l, r) => l.column == r.column,
      as: (l, r) => ({l with name: r.name, location: r.location}),
  )
  ```
---

Use [`join.inner()`](/flux/v0.x/stdlib/join/inner/) to perform an inner join of two streams of data.

Inner joins drop any rows from both input streams that do not have a matching
row in the other stream.

## Prepare your data
To join two streams of data with the `join` package, each stream must have:

- **One or more columns with common values to join on**.  
  The `on` parameter defines the **join predicate**–a predicate function
  that compares column values from each input stream to determine what rows
  from each stream should be joined together.
- **Identical [group keys](/flux/v0.x/get-started/data-model/#group-key)**.  
  Functions in the `join` package use group keys to quickly determine what tables
  from each input stream should be paired and evaluated for the join operation.
  Because of that, both input streams must have the same group key.
  This likely requires using [`group()`](/flux/v0.x/stdlib/universe/group/)
  to regroup each input stream before joining them together.

## Use join.inner to join your data

1. Import the `join` package.
2. Define two streams of tables to join.

    One stream of table represents the left side of the join.
    The other stream of table represents the right side of the join.
    Ensure both streams of data meet the [criteria required to join](#prepare-your-data).

3. Use `join.inner()` to join the two streams together.
    Provide the following parameters:

    - `left`: stream of data representing the left side of the join.
    - `right`: stream of data representing the right side of the join.
    - `on`: join predicate.
    - `as`: function that returns record with values from each input stream

```js
import "array"
import "influxdata/influxdb/sample"
import "join"

left =
    sample.data(set: "machineProduction")
        |> filter(fn: (r) => r.stationID == "g1" or r.stationID == "g2" or r.stationID == "g3")
        |> filter(fn: (r) => r._field == "oil_temp")
        |> limit(n: 5)

right =
    array.from(
        rows: [
            {station: "g1", opType: "auto", last_maintained: 2021-07-15T00:00:00Z},
            {station: "g2", opType: "manned", last_maintained: 2021-07-02T00:00:00Z},
        ],
    )

join.inner(
    left: left |> group(),
    right: right,
    on: (l, r) => l.stationID == r.station,
    as: (l, r) => ({l with opType: r.opType, maintained: r.last_maintained}),
)
    |> group(columns: ["stationID"])
```