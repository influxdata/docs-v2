---
title: Calculate percentages with Flux
list_title: Calculate percentages
description: >
  Use [`pivot()` or `join()`](/v2.0/query-data/flux/calculate-percentages/#pivot-vs-join)
  and the [`map()` function](/v2.0/reference/flux/stdlib/built-in/transformations/map/)
  to align operand values into row-wise sets and calculate a percentage.
menu:
  v2_0:
    name: Calculate percentages
    parent: Query with Flux
weight: 220
aliases:
 - /v2.0/query-data/guides/manipulate-timestamps/
related:
  - /v2.0/query-data/flux/mathematic-operations
  - /v2.0/reference/flux/stdlib/built-in/transformations/map
  - /v2.0/reference/flux/stdlib/built-in/transformations/pivot
  - /v2.0/reference/flux/stdlib/built-in/transformations/join
list_query_example: percentages
---


Calculating percentages using multiple values in a queried data set is a common use case for time series data.
With Flux, all operand values need to exists in a single row to use them in a mathematic calculation.
Once operands are aligned in rows, use `map()` to re-map values in the row and calculate a percentage.

**To calculate percentages:**

1. Query the necessary operand values.
2. Use [`pivot()` or `join()`](#pivot-vs-join) to align operand values into row-wise sets.
3. Use [`map()`](/v2.0/reference/flux/stdlib/built-in/transformations/map/)
   to divide the numerator operand value by the denominator operand value and multiply by 100.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[pivot()](#)
[join()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "m1" and r._field =~ /field[1-2]/ )
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> map(fn: (r) => ({ r with _value: r.field1 / r.field2 * 100.0 }))
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
t1 = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "m1" and r._field == "field1")

t2 = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "m2" and r._field == "field2")

join(tables: {t1: t1, t2: t2}, on: ["_time"])
  |> map(fn: (r) => ({ r with _value: r._value_t1 / r._value_t2 * 100.0 }))
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% note %}}
This guide uses `pivot()` to align operand values into row-wise sets because
`pivot()` works for the majority of use cases and is more performant than `join()`.
_See [Pivot vs join](#pivot-vs-join) below._
{{% /note %}}

## GPU monitoring example
The following example queries data collected from a GPU monitoring solution and
calculates the percentage of GPU memory used over time.
Data includes the following:

- **`gpu` measurement**
- **`mem_used` field**: used GPU memory in bytes
- **`mem_total` field**: total GPU memory in bytes

### Query mem_used and mem_total fields
```js
from(bucket: "gpu-monitor")
  |> range(start: 2020-01-01T00:00:00Z)
  |> filter(fn: (r) => r._measurement == "gpu" and r._field =~ /mem_/)
```

###### Returns the following stream of tables:

| _time                | _measurement | _field   | _value     |
|:-----                |:------------:|:------:  | ------:    |
| 2020-01-01T00:00:00Z | gpu          | mem_used | 2517924577 |
| 2020-01-01T00:00:10Z | gpu          | mem_used | 2695091978 |
| 2020-01-01T00:00:20Z | gpu          | mem_used | 2576980377 |
| 2020-01-01T00:00:30Z | gpu          | mem_used | 3006477107 |
| 2020-01-01T00:00:40Z | gpu          | mem_used | 3543348019 |
| 2020-01-01T00:00:50Z | gpu          | mem_used | 4402341478 |

<p style="margin:-2.5rem 0;"></p>

| _time                | _measurement | _field    | _value     |
|:-----                |:------------:|:------:   | ------:    |
| 2020-01-01T00:00:00Z | gpu          | mem_total | 8589934592 |
| 2020-01-01T00:00:10Z | gpu          | mem_total | 8589934592 |
| 2020-01-01T00:00:20Z | gpu          | mem_total | 8589934592 |
| 2020-01-01T00:00:30Z | gpu          | mem_total | 8589934592 |
| 2020-01-01T00:00:40Z | gpu          | mem_total | 8589934592 |
| 2020-01-01T00:00:50Z | gpu          | mem_total | 8589934592 |

### Pivot fields into columns
Use `pivot()` to pivot the `mem_used` and `mem_total` fields into columns.
Output includes `mem_used` and `mem_total` columns with values for each corresponding `_time`.

```js
// ...
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
```

###### Returns the following:

| _time                | _measurement | mem_used   | mem_total  |
|:-----                |:------------:| --------:  | ---------: |
| 2020-01-01T00:00:00Z | gpu          | 2517924577 | 8589934592 |
| 2020-01-01T00:00:10Z | gpu          | 2695091978 | 8589934592 |
| 2020-01-01T00:00:20Z | gpu          | 2576980377 | 8589934592 |
| 2020-01-01T00:00:30Z | gpu          | 3006477107 | 8589934592 |
| 2020-01-01T00:00:40Z | gpu          | 3543348019 | 8589934592 |
| 2020-01-01T00:00:50Z | gpu          | 4402341478 | 8589934592 |

### Map new values
With fields pivoted into columns, each row contains the values necessary to calculate a percentage.
Use `map()` to re-map values in each row.
Divide `mem_used` by `mem_total` and multiply by 100 to return the percentage.

{{% note %}}
To return a precise float percentage value that includes decimal points the example
below casts integer field values to floats and multiplies by a float value (`100.0`).
{{% /note %}}

```js
// ...
  |> map(fn: (r) => ({
    _time: r._time,
    _measurement: r._measurement,
    _field: "mem_used_percent",
    _value: float(v: r.mem_used) / float(v: r.mem_total) * 100.0
  }))
```

| _time                | _measurement | _field           | _value  |
|:-----                |:------------:|:------:          | ------: |
| 2020-01-01T00:00:00Z | gpu          | mem_used_percent | 29.31   |
| 2020-01-01T00:00:10Z | gpu          | mem_used_percent | 31.37   |
| 2020-01-01T00:00:20Z | gpu          | mem_used_percent | 30.00   |
| 2020-01-01T00:00:30Z | gpu          | mem_used_percent | 35.00   |
| 2020-01-01T00:00:40Z | gpu          | mem_used_percent | 41.25   |
| 2020-01-01T00:00:50Z | gpu          | mem_used_percent | 51.25   |

### Full query
```js
from(bucket: "gpu-monitor")
  |> range(start: 2020-01-01T00:00:00Z)
  |> filter(fn: (r) => r._measurement == "gpu" and r._field =~ /mem_/ )
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> map(fn: (r) => ({
    _time: r._time,
    _measurement: r._measurement,
    _field: "mem_used_percent",
    _value: float(v: r.mem_used) / float(v: r.mem_total) * 100.0
  }))
```

---

## Pivot vs join
To use values in mathematical operations in Flux, operand values must exists in a single row.
Both `pivot()` and `join()` will do this, but there are important differences between the two:

#### Pivot is more performant
`pivot()` only has to read and operate on a single stream of data.
`join()` requires two streams of data and the overhead of reading and combing both
streams can be high, especially for larger data sets.

#### Use join for multiple data sources
`join()` is really only necessary when querying data from multiple buckets or
different data sources.

---

## Examples

#### Use pivot() to align multiple fields
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> filter(fn: (r) =>
    r._field == "used_system" or
    r._field == "used_user" or
    r._field == "total"
  )
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> map(fn: (r) => ({ r with
    _value: float(v: r.used_system + r.used_user) / float(v: r.total) * 100.0
  }))
```

#### Use pivot() for math across measurements

1. Ensure measurements are in the same [bucket](/v2.0/reference/glossary/#bucket).
2. Use `filter()` to include data from both measurements.
3. Use `group()` to ungroup data to return a single table.
4. Use `pivot()` to pivot fields into row-wise sets.
5. Use `map()` to re-map rows and perform the percentage calculation.

<!-- -->
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    (r._measurement == "m1" or r._measurement == "m2") and
    (r._field == "field1" or r._field == "field2")    
  )
  |> group()
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> map(fn: (r) => ({ r with  _value: r.field1 / r.field2 * 100.0 }))
```

#### Use join for multiple data sources
```js
import "sql"
import "influxdata/influxdb/secrets"

pgUser = secrets.get(key: "POSTGRES_USER")
pgPass = secrets.get(key: "POSTGRES_PASSWORD")
pgHost = secrets.get(key: "POSTGRES_HOST")

t1 = sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://${pgUser}:${pgPass}@${pgHost}",
  query:"SELECT id, name, available FROM exampleTable"
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
