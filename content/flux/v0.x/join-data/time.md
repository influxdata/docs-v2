---
title: Join on time
description: >
  Use [`join.time()`](/flux/v0.x/stdlib/join/time/) to join two streams of data
  based on time values in the `_time` column.
  This type of join operation is common when joining two streams of
  [time series data](/influxdb/latest/reference/glossary/#time-series-data).
menu:
  flux_0_x:
    parent: Join data
weight: 104
related:
  - /flux/v0.x/join-data/troubleshoot-joins/
  - /flux/v0.x/stdlib/join/
  - /flux/v0.x/stdlib/join/time/
list_code_example: |
  ```js
  import "join"

  left = from(bucket: "example-bucket-1") |> //...
  right = from(bucket: "example-bucket-2") |> //...

  join.time(
      left: left,
      right: right,
      as: (l, r) => ({l with field1: l._value, field2: r._value_}),
  )
  ```
---

Use [`join.time()`](/flux/v0.x/stdlib/join/time/) to join two streams of data
based on time values in the `_time` column.
This type of join operation is common when joining two streams of
[time series data](/influxdb/latest/reference/glossary/#time-series-data).

`join.time()` can use any of the available join methods.
Which method you use depends on your desired behavior:

- **inner** _(Default)_:
  Drop any rows from both input streams that do not have a matching
  row in the other stream.

- **left**:
  Output a row for each row in the **left** data stream with data matching
  from the **right** data stream. If there is no matching data in the **right**
  data stream, non-group-key columns with values from the **right** data stream
  are _null_.

- **right**: 
  Output a row for each row in the **right** data stream with data matching
  from the **left** data stream. If there is no matching data in the **left**
  data stream, non-group-key columns with values from the **left** data stream
  are _null_.

- **full**: 
  Output a row for all rows in both the **left** and **right** input streams
  and join rows that match based on their `_time` value.

## Use join.time to join your data

1. Import the `join` package.
2. Define the **left** and **right** data streams to join:

    - Each stream must also have a `_time` column.
    - Each stream must have one or more columns with common values.
      Column labels do not need to match, but column values do.
    - Each stream should have identical [group keys](/flux/v0.x/get-started/data-model/#group-key).

    _For more information, see [join data requirements](/flux/v0.x/join-data/#data-requirements)._

3. Use `join.time()` to join the two streams together based on time values.
    Provide the following parameters:

    - `left`: ({{< req >}}) Stream of data representing the left side of the join.
    - `right`: ({{< req >}}) Stream of data representing the right side of the join.
    - `as`: ({{< req >}}) [Join output function](/flux/v0.x/join-data/#join-output-function-as)
      that returns a record with values from each input stream.
      For example: `(l, r) => ({r with column1: l.column1, column2: l.column2})`.
    - `method`: Join method to use. Default is `inner`.

The following example uses a filtered selections from the
[**machineProduction** sample data set](/flux/v0.x/stdlib/influxdata/influxdb/sample/data/#set)
as the **left** and **right** data streams.

{{% note %}}
#### Example data grouping

The example below regroups both the left and right streams to remove the
`_field` column from the group key.
Because `join.time()` only compares tables with matching
[group key instances](/flux/v0.x/get-started/data-model/#example-group-key-instances),
to join streams with different `_field` column values, `_field` cannot be part
of the group key.
{{% /note %}}

```js
import "influxdata/influxdb/sample"
import "join"

left =
    sample.data(set: "machineProduction")
        |> filter(fn: (r) => r.stationID == "g1" or r.stationID == "g2" or r.stationID == "g3")
        |> filter(fn: (r) => r._field == "pressure")
        |> limit(n: 5)
        |> group(columns: ["_time", "_value", "_field"], mode: "except")

right =
    sample.data(set: "machineProduction")
        |> filter(fn: (r) => r.stationID == "g1" or r.stationID == "g2" or r.stationID == "g3")
        |> filter(fn: (r) => r._field == "pressure_target")
        |> limit(n: 5)
        |> group(columns: ["_time", "_value", "_field"], mode: "except")

join.time(method: "left", left: left, right: right, as: (l, r) => ({l with target: r._value}))
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

### Input

{{% note %}}
_`_start` and `_stop` columns have been omitted from input examples._
{{% /note %}}

#### left {#left-input}

| _time                   | _measurement | stationID | _field   |   _value |
| :---------------------- | :----------- | :-------- | :------- | -------: |
| 2021-08-01T00:00:00Z    | machinery    | g1        | pressure | 110.2617 |
| 2021-08-01T00:00:11.51Z | machinery    | g1        | pressure | 110.3506 |
| 2021-08-01T00:00:19.53Z | machinery    | g1        | pressure | 110.1836 |
| 2021-08-01T00:00:25.1Z  | machinery    | g1        | pressure | 109.6387 |
| 2021-08-01T00:00:36.88Z | machinery    | g1        | pressure | 110.5021 |

| _time                   | _measurement | stationID | _field   |   _value |
| :---------------------- | :----------- | :-------- | :------- | -------: |
| 2021-08-01T00:00:00Z    | machinery    | g2        | pressure |  105.392 |
| 2021-08-01T00:00:27.93Z | machinery    | g2        | pressure | 105.3786 |
| 2021-08-01T00:00:54.96Z | machinery    | g2        | pressure | 105.4801 |
| 2021-08-01T00:01:17.27Z | machinery    | g2        | pressure | 105.5656 |
| 2021-08-01T00:01:41.84Z | machinery    | g2        | pressure | 105.5495 |

| _time                   | _measurement | stationID | _field   |   _value |
| :---------------------- | :----------- | :-------- | :------- | -------: |
| 2021-08-01T00:00:00Z    | machinery    | g3        | pressure | 110.5309 |
| 2021-08-01T00:00:14.46Z | machinery    | g3        | pressure | 110.3746 |
| 2021-08-01T00:00:25.29Z | machinery    | g3        | pressure | 110.3719 |
| 2021-08-01T00:00:38.77Z | machinery    | g3        | pressure | 110.5362 |
| 2021-08-01T00:00:51.2Z  | machinery    | g3        | pressure | 110.4514 |

#### right {#right-input}

| _time                   | _measurement | stationID | _field          | _value |
| :---------------------- | :----------- | :-------- | :-------------- | -----: |
| 2021-08-01T00:00:00Z    | machinery    | g1        | pressure_target |    110 |
| 2021-08-01T00:00:11.51Z | machinery    | g1        | pressure_target |    110 |
| 2021-08-01T00:00:19.53Z | machinery    | g1        | pressure_target |    110 |
| 2021-08-01T00:00:25.1Z  | machinery    | g1        | pressure_target |    110 |
| 2021-08-01T00:00:36.88Z | machinery    | g1        | pressure_target |    110 |

| _time                   | _measurement | stationID | _field          | _value |
| :---------------------- | :----------- | :-------- | :-------------- | -----: |
| 2021-08-01T00:00:00Z    | machinery    | g2        | pressure_target |    105 |
| 2021-08-01T00:00:27.93Z | machinery    | g2        | pressure_target |    105 |
| 2021-08-01T00:00:54.96Z | machinery    | g2        | pressure_target |    105 |
| 2021-08-01T00:01:17.27Z | machinery    | g2        | pressure_target |    105 |
| 2021-08-01T00:01:41.84Z | machinery    | g2        | pressure_target |    105 |

| _time                   | _measurement | stationID | _field          | _value |
| :---------------------- | :----------- | :-------- | :-------------- | -----: |
| 2021-08-01T00:00:00Z    | machinery    | g3        | pressure_target |    110 |
| 2021-08-01T00:00:14.46Z | machinery    | g3        | pressure_target |    110 |
| 2021-08-01T00:00:25.29Z | machinery    | g3        | pressure_target |    110 |
| 2021-08-01T00:00:38.77Z | machinery    | g3        | pressure_target |    110 |
| 2021-08-01T00:00:51.2Z  | machinery    | g3        | pressure_target |    110 |

### Output {#example-output}

| _time                   | _measurement | stationID | _field   |   _value | target |
| :---------------------- | :----------- | :-------- | :------- | -------: | :----- |
| 2021-08-01T00:00:00Z    | machinery    | g1        | pressure | 110.2617 | 110    |
| 2021-08-01T00:00:11.51Z | machinery    | g1        | pressure | 110.3506 | 110    |
| 2021-08-01T00:00:19.53Z | machinery    | g1        | pressure | 110.1836 | 110    |
| 2021-08-01T00:00:25.1Z  | machinery    | g1        | pressure | 109.6387 | 110    |
| 2021-08-01T00:00:36.88Z | machinery    | g1        | pressure | 110.5021 | 110    |

| _time                   | _measurement | stationID | _field   |   _value | target |
| :---------------------- | :----------- | :-------- | :------- | -------: | :----- |
| 2021-08-01T00:00:00Z    | machinery    | g2        | pressure |  105.392 | 105    |
| 2021-08-01T00:00:27.93Z | machinery    | g2        | pressure | 105.3786 | 105    |
| 2021-08-01T00:00:54.96Z | machinery    | g2        | pressure | 105.4801 | 105    |
| 2021-08-01T00:01:17.27Z | machinery    | g2        | pressure | 105.5656 | 105    |
| 2021-08-01T00:01:41.84Z | machinery    | g2        | pressure | 105.5495 | 105    |

| _time                   | _measurement | stationID | _field   |   _value | target |
| :---------------------- | :----------- | :-------- | :------- | -------: | :----- |
| 2021-08-01T00:00:00Z    | machinery    | g3        | pressure | 110.5309 | 110    |
| 2021-08-01T00:00:14.46Z | machinery    | g3        | pressure | 110.3746 | 110    |
| 2021-08-01T00:00:25.29Z | machinery    | g3        | pressure | 110.3719 | 110    |
| 2021-08-01T00:00:38.77Z | machinery    | g3        | pressure | 110.5362 | 110    |
| 2021-08-01T00:00:51.2Z  | machinery    | g3        | pressure | 110.4514 | 110    |

{{% /expand %}}
{{< /expand-wrapper >}}
