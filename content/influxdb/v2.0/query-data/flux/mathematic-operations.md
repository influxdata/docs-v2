---
title: Transform data with mathematic operations
seotitle: Transform data with mathematic operations in Flux
list_title: Transform data with math
description: >
  Use the [`map()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map)
  to remap column values and apply mathematic operations.
influxdb/v2.0/tags: [math, flux]
menu:
  influxdb_2_0:
    name: Transform data with math
    parent: Query with Flux
weight: 208
aliases:
  - /influxdb/v2.0/query-data/guides/mathematic-operations/
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/reduce/
  - /influxdb/v2.0/reference/flux/language/operators/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/
  - /influxdb/v2.0/query-data/flux/calculate-percentages/
list_query_example: map_math
---

[Flux](/influxdb/v2.0/reference/flux), InfluxData's data scripting and query language,
supports mathematic expressions in data transformations.
This article describes how to use [Flux arithmetic operators](/influxdb/v2.0/reference/flux/language/operators/#arithmetic-operators)
to "map" over data and transform values using mathematic operations.

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/influxdb/v2.0/query-data/get-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/influxdb/v2.0/query-data/execute-queries/) to discover a variety of ways to run your queries.

##### Basic mathematic operations
```js
// Examples executed using the Flux REPL
> 9 + 9
18
> 22 - 14
8
> 6 * 5
30
> 21 / 7
3
```

<p style="font-size:.85rem;font-style:italic;margin-top:-2rem;">See <a href="/influxdb/v2.0/tools/repl/">Flux Read-Eval-Print Loop (REPL)</a>.</p>

{{% note %}}
#### Operands must be the same type
Operands in Flux mathematic operations must be the same data type.
For example, integers cannot be used in operations with floats.
Otherwise, you will get an error similar to:

```
Error: type error: float != int
```

To convert operands to the same type, use [type-conversion functions](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/)
or manually format operands.
The operand data type determines the output data type.
For example:

```js
100 // Parsed as an integer
100.0 // Parsed as a float

// Example evaluations
> 20 / 8
2

> 20.0 / 8.0
2.5
```
{{% /note %}}

## Custom mathematic functions
Flux lets you [create custom functions](/influxdb/v2.0/query-data/flux/custom-functions) that use mathematic operations.
View the examples below.

###### Custom multiplication function
```js
multiply = (x, y) => x * y

multiply(x: 10, y: 12)
// Returns 120
```

###### Custom percentage function
```js
percent = (sample, total) => (sample / total) * 100.0

percent(sample: 20.0, total: 80.0)
// Returns 25.0
```

### Transform values in a data stream
To transform multiple values in an input stream, your function needs to:

- [Handle piped-forward data](/influxdb/v2.0/query-data/flux/custom-functions/#functions-that-manipulate-piped-forward-data).
- Each operand necessary for the calculation exists in each row _(see [Pivot vs join](#pivot-vs-join) below)_.
- Use the [`map()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map) to iterate over each row.

The example `multiplyByX()` function below includes:

- A `tables` parameter that represents the input data stream (`<-`).
- An `x` parameter which is the number by which values in the `_value` column are multiplied.
- A `map()` function that iterates over each row in the input stream.
  It uses the `with` operator to preserve existing columns in each row.
  It also multiples the `_value` column by `x`.

```js
multiplyByX = (x, tables=<-) =>
  tables
    |> map(fn: (r) => ({
        r with
        _value: r._value * x
      })
    )

data
  |> multiplyByX(x: 10)
```

## Examples

### Convert bytes to gigabytes
To convert active memory from bytes to gigabytes (GB), divide the `active` field
in the `mem` measurement by 1,073,741,824.

The `map()` function iterates over each row in the piped-forward data and defines
a new `_value` by dividing the original `_value` by 1073741824.

```js
from(bucket: "example-bucket")
  |> range(start: -10m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "active"
  )
  |> map(fn: (r) => ({
      r with
      _value: r._value / 1073741824
    })
  )
```

You could turn that same calculation into a function:

```js
bytesToGB = (tables=<-) =>
  tables
    |> map(fn: (r) => ({
        r with
        _value: r._value / 1073741824
      })
    )

data
  |> bytesToGB()
```

#### Include partial gigabytes
Because the original metric (bytes) is an integer, the output of the operation is an integer and does not include partial GBs.
To calculate partial GBs, convert the `_value` column and its values to floats using the
[`float()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/float)
and format the denominator in the division operation as a float.

```js
bytesToGB = (tables=<-) =>
  tables
    |> map(fn: (r) => ({
        r with
        _value: float(v: r._value) / 1073741824.0
      })
    )
```

### Calculate a percentage
To calculate a percentage, use simple division, then multiply the result by 100.

```js
> 1.0 / 4.0 * 100.0
25.0
```

_For an in-depth look at calculating percentages, see [Calculate percentates](/influxdb/v2.0/query-data/flux/calculate-percentages)._

## Pivot vs join
To query and use values in mathematical operations in Flux, operand values must
exists in a single row.
Both `pivot()` and `join()` will do this, but there are important differences between the two:

#### Pivot is more performant
`pivot()` reads and operates on a single stream of data.
`join()` requires two streams of data and the overhead of reading and combining
both streams can be significant, especially for larger data sets.

#### Use join for multiple data sources
Use `join()` when querying data from different buckets or data sources.

##### Pivot fields into columns for mathematic calculations
```js
data
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> map(fn: (r) => ({ r with
    _value: (r.field1 + r.field2) / r.field3 * 100.0
  }))
```

##### Join multiple data sources for mathematic calculations
```js
import "sql"
import "influxdata/influxdb/secrets"

pgUser = secrets.get(key: "POSTGRES_USER")
pgPass = secrets.get(key: "POSTGRES_PASSWORD")
pgHost = secrets.get(key: "POSTGRES_HOST")

t1 = sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://${pgUser}:${pgPass}@${pgHost}",
  query:"SELECT id, name, available FROM example_table"
)

t2 = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field"
  )

join(tables: {t1: t1, t2: t2}, on: ["id"])
  |> map(fn: (r) => ({ r with _value: r._value_t2 / r.available_t1 * 100.0 }))
```
