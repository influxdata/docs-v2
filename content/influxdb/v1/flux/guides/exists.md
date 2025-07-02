---
title: Check if a value exists
seotitle: Use Flux to check if a value exists
list_title: Exists
description: >
  Use the `exists` operator to check if a row record contains a column or if a
  column's value is _null_.
menu:
  influxdb_v1:
    name: Exists
    parent: Query with Flux
weight: 20
canonical: /influxdb/v2/query-data/flux/exists/
alt_links:
  v2: /influxdb/v2/query-data/flux/exists/
list_code_example: |
  ##### Filter null values
  ```js
  data
    |> filter(fn: (r) => exists r._value)
  ```
---

Use the `exists` operator to check if a row record contains a column or if a
column's value is _null_.

```js
(r) => exists r.column
```

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/flux/v0/get-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/influxdb/v2/query-data/execute-queries/) to discover a variety of ways to run your queries.

Use `exists` with row functions (
[`filter()`](/flux/v0/stdlib/universe/filter/),
[`map()`](/flux/v0/stdlib/universe/map/),
[`reduce()`](/flux/v0/stdlib/universe/reduce/))
to check if a row includes a column or if the value for that column is _null_.

#### Filter null values

```js
from(bucket: "example-bucket")
    |> range(start: -5m)
    |> filter(fn: (r) => exists r._value)
```

#### Map values based on existence

```js
from(bucket: "default")
    |> range(start: -30s)
    |> map(
        fn: (r) => ({r with
            human_readable: if exists r._value then
                "${r._field} is ${string(v: r._value)}."
            else
                "${r._field} has no value.",
        }),
    )
```

#### Ignore null values in a custom aggregate function

```js
customSumProduct = (tables=<-) => tables
    |> reduce(
        identity: {sum: 0.0, product: 1.0},
        fn: (r, accumulator) => ({r with
            sum: if exists r._value then
                r._value + accumulator.sum
            else
                accumulator.sum,
            product: if exists r._value then
                r.value * accumulator.product
            else
                accumulator.product,
        }),
    )
```

#### Check if a statically defined record contains a key

When you use the [record literal syntax](/flux/v0/data-types/composite/record/#record-syntax)
to statically define a record, Flux knows the record type and what keys to expect.

- If the key exists in the static record, `exists` returns `true`.
- If the key does not exist in the static record, because the record type is
  statically known, `exists` returns an error.

```js
import "internal/debug"

p = {
    firstName: "John",
    lastName: "Doe",
    age: 42,
}

exists p.firstName
// Returns true

exists p.height
// Returns "error: record is missing label height"
```
