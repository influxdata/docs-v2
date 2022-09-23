---
title: Perform a right outer join
description: >
  Use [`join.right()`](/flux/v0.x/stdlib/join/right/) to perform an right outer join of two streams of data.
  Right joins output a row for each row in the **right** data stream with data matching
  from the **left** data stream. If there is no matching data in the **left**
  data stream, non-group-key columns with values from the **left** data stream are _null_.
menu:
  flux_0_x:
    name: Right outer join
    parent: Join data
weight: 102
related:
  - /flux/v0.x/join-data/troubleshoot-joins/
  - /flux/v0.x/stdlib/join/
  - /flux/v0.x/stdlib/join/right/
list_code_example: |
  ```js
  import "join"

  left = from(bucket: "example-bucket-1") |> //...
  right = from(bucket: "example-bucket-2") |> //...

  join.right(
      left: left,
      right: right,
      on: (l, r) => l.column == r.column,
      as: (l, r) => ({r with name: l.name, location: l.location}),
  )
  ```
---

Use [`join.right()`](/flux/v0.x/stdlib/join/right/) to perform an right outer join of two streams of data.
Right joins output a row for each row in the **right** data stream with data matching
from the **left** data stream. If there is no matching data in the **left**
data stream, non-group-key columns with values from the **left** data stream are _null_.

{{< svg svg="static/svgs/join-diagram.svg" class="right" >}}

{{< expand-wrapper >}}
{{% expand "View table illustration of a right outer join" %}}
{{< flex >}}
{{% flex-content "third" %}}
#### left
|     |                                      |                                      |
| :-- | :----------------------------------- | :----------------------------------- |
| r1  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> |
| r2  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> |
{{% /flex-content %}}
{{% flex-content "third" %}}
#### right
|     |                                      |                                      |
| :-- | :----------------------------------- | :----------------------------------- |
| r1  | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r3  | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r4  | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
{{% /flex-content %}}
{{% flex-content "third" %}}
#### Right outer join result

|     |                                      |                                      |                                      |                                      |
| :-- | :----------------------------------- | :----------------------------------- | :----------------------------------- | :----------------------------------- |
| r1  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r3  |                                      |                                      | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r4  |                                      |                                      | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Use join.right to join your data

1. Import the `join` package.
2. Define the **left** and **right** data streams to join:

    - Each stream must have one or more columns with common values.
      Column labels do not need to match, but column values do.
    - Each stream should have identical [group keys](/flux/v0.x/get-started/data-model/#group-key).

    _For more information, see [join data requirements](/flux/v0.x/join-data/#data-requirements)._

3. Use `join.right()` to join the two streams together.
    Provide the following required parameters:

    - `left`: Stream of data representing the left side of the join.
    - `right`: Stream of data representing the right side of the join.
    - `on`: [Join predicate](/flux/v0.x/join-data/#join-predicate-function-on).
      For example: `(l, r) => l.column == r.column`.
    - `as`: [Join output function](/flux/v0.x/join-data/#join-output-function-as)
      that returns a record with values from each input stream.
      For example: `(l, r) => ({r with column1: l.column1, column2: l.column2})`.

The following example uses a filtered selection from the
[**machineProduction** sample data set](/flux/v0.x/stdlib/influxdata/influxdb/sample/data/#set)
as the **left** data stream and an ad-hoc table created with [`array.from()`](/flux/v0.x/stdlib/array/from/)
as the **right** data stream.

{{% note %}}
#### Example data grouping

The example below ungroups the **left** stream to match the grouping of the **right** stream.
{{% /note %}}

```js
import "array"
import "influxdata/influxdb/sample"
import "join"

left =
    sample.data(set: "machineProduction")
        |> filter(fn: (r) => r.stationID == "g1" or r.stationID == "g2" or r.stationID == "g3")
        |> filter(fn: (r) => r._field == "oil_temp")
        |> last()

right =
    array.from(
        rows: [
            {station: "g1", opType: "auto", last_maintained: 2021-07-15T00:00:00Z},
            {station: "g2", opType: "manned", last_maintained: 2021-07-02T00:00:00Z},
        ],
    )

join.right(
    left: left |> group(),
    right: right,
    on: (l, r) => l.stationID == r.station,
    as: (l, r) => ({r with last_reported_val: l._value, last_reported_time: l._time}),
)
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

### Input

#### left {#left-input}

{{% note %}}
_`_start` and `_stop` columns have been omitted._
{{% /note %}}

| _time                   | _measurement | stationID | _field   | _value |
| :---------------------- | :----------- | :-------- | :------- | -----: |
| 2021-08-01T23:59:46.17Z | machinery    | g1        | oil_temp |   40.6 |

| _time                   | _measurement | stationID | _field   | _value |
| :---------------------- | :----------- | :-------- | :------- | -----: |
| 2021-08-01T23:59:34.57Z | machinery    | g2        | oil_temp |  41.34 |

| _time                   | _measurement | stationID | _field   | _value |
| :---------------------- | :----------- | :-------- | :------- | -----: |
| 2021-08-01T23:59:41.96Z | machinery    | g3        | oil_temp |  41.26 |

#### right {#right-input}

| station | opType |      last_maintained |
| :------ | :----- | -------------------: |
| g1      | auto   | 2021-07-15T00:00:00Z |
| g2      | manned | 2021-07-02T00:00:00Z |

### Output {#example-output}

| station | opType | last_maintained      | last_reported_time      | last_reported_val |
| :------ | :----- | :------------------- | :---------------------- | ----------------: |
| g1      | auto   | 2021-07-15T00:00:00Z | 2021-08-01T23:59:46.17Z |              40.6 |
| g2      | manned | 2021-07-02T00:00:00Z | 2021-08-01T23:59:34.57Z |             41.34 |

{{% /expand %}}
{{< /expand-wrapper >}}
