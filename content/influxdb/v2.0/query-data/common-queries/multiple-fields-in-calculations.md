---
title: Use multiple fields in a calculation
description: >
  Query multiple fields, pivot results, and use multiple field values to
  calculate new values in query results.
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    parent: Common queries
weight: 103
---

To use values from multiple fields in a mathematic calculation, complete the following steps:

1. [Filter by fields required in your calculation](#filter-by-fields)
2. [Pivot fields into columns](#pivot-fields-into-columns)
3. [Perform the mathematic calculation](#perform-the-calculation)

## Filter by fields
Use [`filter()`](/{{< latest "flux" >}}/stdlib/universe/filter/)
to return only the fields necessary for your calculation.
Use the [`or` logical operator](/{{< latest "flux" >}}/spec/operators/#logical-operators)
to filter by multiple fields.

The following example queries two fields, `A` and `B`:

```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._field == "A" or r._field == "B")
```

This query returns one or more tables for each field. For example:

{{< flex >}}
{{% flex-content %}}
| _time                | _field | _value |
|:-----                |:------:| ------:|
| 2021-01-01T00:00:00Z | A      | 12.4   |
| 2021-01-01T00:00:15Z | A      | 12.2   |
| 2021-01-01T00:00:30Z | A      | 11.6   |
| 2021-01-01T00:00:45Z | A      | 11.9   |
{{% /flex-content %}}
{{% flex-content %}}
| _time                | _field | _value |
|:-----                |:------:| ------:|
| 2021-01-01T00:00:00Z | B      | 3.1    |
| 2021-01-01T00:00:15Z | B      | 4.8    |
| 2021-01-01T00:00:30Z | B      | 2.2    |
| 2021-01-01T00:00:45Z | B      | 3.3    |
{{% /flex-content %}}
{{< /flex >}}

## Pivot fields into columns
Use [`pivot()`](/{{< latest "flux" >}}/stdlib/universe/pivot/)
to align multiple fields by time.

{{% note %}}
To correctly pivot on `_time`, points for each field must have identical timestamps.
If timestamps are irregular or do not align perfectly, see
[Normalize irregular timestamps](/influxdb/v2.0/query-data/flux/manipulate-timestamps/#normalize-irregular-timestamps).
{{% /note %}}

```js
// ...
  |> pivot(
    rowKey:["_time"],
    columnKey: ["_field"],
    valueColumn: "_value"
  )
```

Using the queried data [above](#filter-by-fields), this `pivot()` function returns:

| _time                | A      | B      |
|:-----                | ------:| ------:|
| 2021-01-01T00:00:00Z | 12.4   | 3.1    |
| 2021-01-01T00:00:15Z | 12.2   | 4.8    |
| 2021-01-01T00:00:30Z | 11.6   | 2.2    |
| 2021-01-01T00:00:45Z | 11.9   | 3.3    |

## Perform the calculation
Use [`map()`](/{{< latest "flux" >}}/stdlib/universe/map/)
to perform the mathematic operation using column values as operands.

The following example uses values in the `A` and `B` columns to calculate a new `_value` column:

```js
// ...
  |> map(fn: (r) => ({ r with _value: r.A * r.B }))
```

Using the pivoted data above, this `map()` function returns:

| _time                | A      | B      | _value |
|:-----                | ------:| ------:| ------:|
| 2021-01-01T00:00:00Z | 12.4   | 3.1    | 38.44  |
| 2021-01-01T00:00:15Z | 12.2   | 4.8    | 58.56  |
| 2021-01-01T00:00:30Z | 11.6   | 2.2    | 25.52  |
| 2021-01-01T00:00:45Z | 11.9   | 3.3    | 39.27  |

## Full example query

```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._field == "A" or r._field == "B")
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> map(fn: (r) => ({ r with _value: r.A * r.B }))
```
