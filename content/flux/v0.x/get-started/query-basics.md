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

## Important concepts

### Pipe-forward operator
The **pipe-forward operator** (`|>`) sends output of a function as input to the next function.
In the [water treatment metaphor](/flux/v0.x/get-started/#flux-overview),
the pipe-forward operator is that pipe the carries water or data through the entire pipeline.

### Predicate functions
- Functions that return `true` or `false` using [predicate expressions](#predicate-expression).
- Predicate expression
  - left and right operand split by an operator
  - chained together using [logical operators](/flux/v0.x/spec/operators/#logical-operators) (`and`, `or`)

### Packages
- Explain how packages work.
- Import statements should be at the beginning of a script

```js
import "package/path"
```

## Basic query structure

The majority of basic Flux queries include the following:

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

### Source
Flux [input functions](/flux/v0.x/function-types/#inputs) retrieve data from a data source.
All input functions return a [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables).

Flux supports multiple data sources including, time series databases (such as **InfluxDB** and **Prometheus**),
relational databases (such as **MySQL** and **PostgreSQL**), CSV, and more.

<!-- For more information about supported data sources, see [Query data sources](#) -->

For a list of input functions, see [Function types and categories – Inputs](/flux/v0.x/function-types/#inputs).

### Filter
Filter functions iterate over and evaluate each input row to see if it matches
specified conditions.
Rows that meet the conditions are included in the function output.
Rows that do not meet the specified conditions are dropped.

Flux provides the following primary filter functions:

- [`range()`](/flux/v0.x/stdlib/universe/range/): filter data based on time.
- [`filter()`](/flux/v0.x/stdlib/universe/filter/): filter data based on column values.
  `filter()` uses a [predicate function](#predicate-functions) defined in the
  `fn` parameter to evaluate input rows.
  Each row is passed into the predicate function as a **record**, `r`, containing
  key-value pairs for each column in the row.

Other filter functions are also available.
For more information, see [Function types and categories – Filters](/flux/v0.x/function-types/#filters).

### Shape data
Many queries need to modify the structure of data to prepare it for processing.
Common data-shaping tasks include [regrouping data](/flux/v0.x/get-started/data-model/#restructure-tables)
by column values or by time or pivoting column values into rows.

Functions that reshape data include the following:

- [`group()`](/flux/v0.x/stdlib/universe/group/): modify group keys
- [`window()`](/flux/v0.x/stdlib/universe/window/): modify `_start` and `_stop` values of rows to group data by time
- [`pivot()`](/flux/v0.x/stdlib/universe/pivot/): pivot column values into rows
- [`drop()`](/flux/v0.x/stdlib/universe/drop/): drop specific columns
- [`keep()`](/flux/v0.x/stdlib/universe/keep/): keep specific columns and drop all others

### Process
Processing data can take on many forms, but include the following types of operations:

- **Aggregate data**: aggregate all rows of an input table into a single row.
  For information, see [Function types and categories - Aggregates](/flux/v0.x/function-types/#aggregates).
- **Select specific data points**: return specific rows from each input table.
  For example, return the first or last row, the row with the highest or lowest value, and more.
  For information, see [Function types and categories - Selectors](/flux/v0.x/function-types/#selectors).
- **Rewrite rows**: use [`map()`](/flux/v0.x/stdlib/universe/map/) to rewrite each input row.
  Tranform values with mathematic operations, process strings, dynamically add new columns, and more.
- **Send notifications**: evaluate data and use Flux notification endpoint functions
  to send notifications to external services. 
  For information, see [Function types and categories- Notification endpoints](/flux/v0.x/function-types/#notification-endpoints).

{{% note %}}
#### aggregateWindow helper function
[`aggregateWindow()`](/flux/v0.x/stdlib/universe/aggregatewindow/) is a helper function
that both **shapes and processes data**.
The function windows and groups data by time, and then applies an [aggregate](/flux/v0.x/function-types/#aggregates)
or [selector](/flux/v0.x/function-types/#selectors) function to the restructured tables.
{{% /note %}}

## Write a basic query

- Use the Flux REPL or the InfluxDB Cloud or InfluxDB OSS data explorer.

```js
import "http"

```
