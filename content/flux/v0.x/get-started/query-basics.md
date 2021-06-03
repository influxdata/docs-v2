---
title: Flux query basics
description: >
  ...
menu:
  flux_0_x:
    name: Query basics
    parent: Get started
weight: 102
---

In the majority of cases, a Flux query includes the following steps:

- [Source](#source)
- [Filter](#filter)
- [Shape](#shape)
- [Process](#process)

```js
from(bucket: "example-bucket")            // ── Source
  |> range(start: -1d)                    // ┐
  |> filter(fn: (r) => r._field == "foo") // ┴─ Filter
  |> group(columns: ["sensorID"])         // ── Shape
  |> mean()                               // ── Process
```


### Pipe-forward operator
In Flux, the **pipe-forward operator** (`|>`) sends the output of one function to the next function as input.
Using the [water treatment metaphor](/flux/v0.x/get-started/#flux-overview), the pipe-forward operator
is that pipe the carries water or data through the entire pipeline.

Basic query structure

### Source
Flux needs to retrieve data from a data source. Flux supports multiple data sources
including:

- Time series databases (such as **InfluxDB** and **Prometheus**)
- Relational databases (such as **MySQL** and **PostgreSQL**)
- CSV

The source returns data as a [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables).

### Filter
- Filters iterate over each input row and evaluate if the row meets the conditions
  of the filter. If the row does meet the conditions, it is included in the function output.
  If not, the row is dropped.

- Two primary functions for filtering data:

  - [`range()`](/flux/v0.x/stdlib/universe/range/) filters rows based on time.
  - [`filter()`](/flux/v0.x/stdlib/universe/filter/) filters rows based on column values.
    - Uses predicate functions to evaluate rows
    - Each row is passed into the predicate function as a [record](#).

### Shape
- Change the structure of an input stream of tables
- Modify the group keys with `group()` or `window()`

### Process
- Aggregate data
- Select data
- Rewrite rows with `map()`.
- Send notifications based on columns values in rows.

### Predicate functions
- Functions that return `true` or `false` using [predicate expressions](#predicate-expression).
- Predicate expression
  - left and right operand split by an operator
  - chained together using [logical operators](/flux/v0.x/spec/operators/#logical-operators) (`and`, `or`)

