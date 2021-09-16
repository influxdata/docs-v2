---
title: Check if a value exists
seotitle: Use Flux to check if a value exists
list_title: Exists
description: >
  Use the Flux `exists` operator to check if a record contains a key or if that
  key's value is `null`.
menu:
  enterprise_influxdb_1_9:
    name: Exists
    parent: Query with Flux
weight: 20
canonical: /{{< latest "influxdb" "v2" >}}/query-data/flux/exists/
v2: /influxdb/v2.0/query-data/flux/exists/
list_code_example: |
  ##### Filter null values
  ```js
  data
    |> filter(fn: (r) => exists r._value)
  ```
---

Use the Flux `exists` operator to check if a record contains a key or if that
key's value is `null`.

```js
p = {firstName: "John", lastName: "Doe", age: 42}

exists p.firstName
// Returns true

exists p.height
// Returns false
```

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/enterprise_influxdb/v1.9/flux/get-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/enterprise_influxdb/v1.9/flux/guides/execute-queries/) to discover a variety of ways to run your queries.

Use `exists` with row functions (
[`filter()`](/{{< latest "flux" >}}/stdlib/universe/filter/),
[`map()`](/{{< latest "flux" >}}/stdlib/universe/map/),
[`reduce()`](/{{< latest "flux" >}}/stdlib/universe/reduce/))
to check if a row includes a column or if the value for that column is `null`.

#### Filter null values
```js
from(bucket: "db/rp")
  |> range(start: -5m)
  |> filter(fn: (r) => exists r._value)
```

#### Map values based on existence
```js
from(bucket: "default")
  |> range(start: -30s)
  |> map(fn: (r) => ({
      r with
      human_readable:
        if exists r._value then "${r._field} is ${string(v:r._value)}."
        else "${r._field} has no value."
  }))
```

#### Ignore null values in a custom aggregate function
```js
customSumProduct = (tables=<-) =>
  tables
    |> reduce(
      identity: {sum: 0.0, product: 1.0},
      fn: (r, accumulator) => ({
        r with
        sum:
          if exists r._value then r._value + accumulator.sum
          else accumulator.sum,
        product:
          if exists r._value then r.value * accumulator.product
          else accumulator.product
      })
    )
```
