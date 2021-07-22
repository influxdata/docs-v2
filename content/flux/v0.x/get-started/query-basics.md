---
title: Flux query basics
description: >
  View basic concepts and steps to use when querying data with Flux. 
menu:
  flux_0_x:
    name: Query basics
    parent: Get started
weight: 102
---

Most Flux queries follow the same basic structure.
Familiarize yourself with the basic concepts and steps to use when querying data with Flux. 

- [Important concepts](#important-concepts)
- [Basic query structure](#basic-query-structure)
- [Write a basic query](#write-a-basic-query)

## Important concepts

- [Pipe-forward operator](#pipe-forward-operator)
- [Predicate expressions](#predicate-expressions)
- [Predicate functions](#predicate-functions)
- [Packages](#packages)

### Pipe-forward operator
The **pipe-forward operator** (`|>`) sends output of a function as input to the next function.
In the [water treatment metaphor](/flux/v0.x/get-started/#flux-overview),
the pipe-forward operator is that pipe the carries water or data through the pipeline.

### Predicate expressions
A predicate is an expression that evaluates to `true` or `false`.
A predicate expression consists of [comparison operators](/flux/v0.x/spec/operators/#comparison-operators)
and [logical operators](/flux/v0.x/spec/operators/#logical-operators) that specify a
relationship between values or operands.
For example:

```js
"John" == "John"
// Evaluates to true

41 < 30
// Evaluates to false

"John" == "John" and 41 < 30
// Evaluates to false

"John" == "John" or 41 < 30
// Evaluates to true
```

Flux uses predicate expressions when [filtering data](#filter) or in
[conditional expressions](/flux/v0.x/spec/expressions/#conditional-expressions).

### Predicate functions
Predicate functions use [predicate expressions](#predicate-expressions) to evaluate
input and return `true` or `false`. For example:

```js
examplePredicate = (v) => v == "foo"

examplePredicate(v: "foo")
// Returns true

examplePredicate(v: "bar")
// Returns false
```

### Packages
The [Flux standard library](/flux/v0.x/stdlib/) is organized into [packages](/flux/v0.x/spec/packages/)
that contain functions and package-specific options.
The [universe package](/flux/v0.x/stdlib/universe/) is loaded by default.
To load other packages, include an import statement for each package at the
beginning of your Flux script.

```js
import "array"
import "math"
import "influxdata/influxdb/sample"
```

---

## Basic query structure

The majority of basic Flux queries include the following steps:

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

---

## Write a basic query

Use [InfluxDB sample data](/{{< latest "influxdb" >}}/reference/sample-data/)to
write a basic Flux query that queries data, filters the data by time and column values,
then applies an [aggregate](/flux/v0.x/function-types/#aggregates).

{{% note %}}
Use the [InfluxDB data explorer](/influxdb/cloud/query-data/execute-queries/data-explorer/)
or the [Flux REPL](/{{< latest "influxdb" >}}/tools/repl/#build-the-repl)
to build and execute the following basic query.
{{% /note %}}

1.  Import the [`influxdata/influxdb/sample` package](/flux/v0.x/stdlib/influxdata/influxdb/sample/)
    and use the [`sample.data()` function](/flux/v0.x/stdlib/influxdata/influxdb/sample/data/)
    to load the `airSensor` sample dataset.

    ```js
    import "influxdata/influxdb/sample"

    sample.data(set: "airSensor")
    ```

    {{% note %}}
`sample.data()` returns data as if it was queried from InfluxDB.
To actually query data from InfluxDB, replace `sample.data()` with the
[`from()` function](/flux/v0.x/stdlib/universe/from/).
    {{% /note %}}

2.  Pipe the returned data forward into [`range()`](/flux/v0.x/stdlib/universe/range/)
    to filter the data by time.
    Return data from the last hour.

    ```js
    import "influxdata/influxdb/sample"

    sample.data(set: "airSensor")
      |> range(start: -1h)
    ```

3.  Use [`filter()`](/flux/v0.x/stdlib/universe/filter/) to filter rows based on
    column values. 
    In this example, return only rows that include values for the `co` field.
    The field name is stored in the `_field` column.

    ```js
    import "influxdata/influxdb/sample"

    sample.data(set: "airSensor")
      |> range(start: -1h)
      |> filter(fn: (r) => r._field == "co")
    ```

4.  Use [`mean()`](/flux/v0.x/stdlib/universe/mean/) to calculate the average value
    in each input table.
    Because InfluxDB groups data by [series](/influxdb/cloud/reference/glossary/#series),
    `mean()` returns a table for each unique `sensor_id` containing a single row
    with the average value in the `_value` column.

    ```js
    import "influxdata/influxdb/sample"

    sample.data(set: "airSensor")
      |> range(start: -1h)
      |> filter(fn: (r) => r._field == "co")
      |> mean()
    ```

5.  Use [`group()`](/flux/v0.x/stdlib/universe/group) to [restructure tables](/flux/v0.x/get-started/data-model/#restructure-tables)
    into a single table:

    ```js
    import "influxdata/influxdb/sample"

    sample.data(set: "airSensor")
      |> range(start: -1h)
      |> filter(fn: (r) => r._field == "co")
      |> mean()
      |> group()
    ```

Results from this basic query should be similar to the following:

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _field | _measurement | sensor_id |              _value |
| :----: | :----------: | :-------: | ------------------: |
|   co   |  airSensors  |  TLM0100  | 0.42338714381053716 |
|   co   |  airSensors  |  TLM0101  |  0.4223251339463061 |
|   co   |  airSensors  |  TLM0102  |  0.8543452859060252 |
|   co   |  airSensors  |  TLM0103  |  0.2782783780205422 |
|   co   |  airSensors  |  TLM0200  |   4.612143110484339 |
|   co   |  airSensors  |  TLM0201  |   0.297474366047375 |
|   co   |  airSensors  |  TLM0202  |  0.3336370208486757 |
|   co   |  airSensors  |  TLM0203  |  0.4948166816959906 |
