---
title: Perform a left outer join
description: >
  Use [`join.left()`](/flux/v0.x/stdlib/join/left/) to perform an outer left join of two streams of data.
  Left joins output a row for each row in the **left** data stream with data matching
  from the **right** data stream. If there is no matching data in the **right**
  data stream, non-group-key columns with values from the **right** data stream are _null_.
menu:
  flux_0_x:
    name: Left outer join
    parent: Join data
weight: 102
related:
  - /flux/v0.x/join-data/troubleshoot-joins/
  - /flux/v0.x/stdlib/join/
  - /flux/v0.x/stdlib/join/left/
list_code_example: |
  ```js
  import "join"

  left = from(bucket: "example-bucket-1") |> //...
  right = from(bucket: "example-bucket-2") |> //...

  join.left(
      left: left,
      right: right,
      on: (l, r) => l.column == r.column,
      as: (l, r) => ({l with name: r.name, location: r.location}),
  )
  ```
---

Use [`join.left()`](/flux/v0.x/stdlib/join/left/) to perform an left outer join of two streams of data.
Left joins output a row for each row in the **left** data stream with data matching
from the **right** data stream. If there is no matching data in the **right**
data stream, non-group-key columns with values from the **right** data stream are _null_.

{{< svg svg="static/svgs/join-diagram.svg" class="left" >}}

{{< expand-wrapper >}}
{{% expand "View table illustration of a left outer join" %}}
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
#### Left outer join result

|     |                                      |                                      |                                      |                                      |
| :-- | :----------------------------------- | :----------------------------------- | :----------------------------------- | :----------------------------------- |
| r1  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r2  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> |                                      |                                      |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Use join.left to join your data

1. Import the `join` package.
2. Define the **left** and **right** data streams to join:

    - Each stream must have one or more columns with common values.
      Column labels do not need to match, but column values do.
    - Each stream should have identical [group keys](/flux/v0.x/get-started/data-model/#group-key).

    _For more information, see [join data requirements](/flux/v0.x/join-data/#data-requirements)._

3. Use `join.left()` to join the two streams together.
    Provide the following parameters:

    - `left`: Stream of data representing the left side of the join.
    - `right`: Stream of data representing the right side of the join.
    - `on`: [Join predicate](/flux/v0.x/join-data/#join-predicate-function-on).
      For example: `(l, r) => l.column == r.column`.
    - `as`: [Join output function](/flux/v0.x/join-data/#join-output-function-as)
      that returns a record with values from each input stream.
      For example: `(l, r) => ({l with column1: r.column1, column2: r.column2})`.

The following example uses a filtered selection from the
[**machineProduction** sample data set](/flux/v0.x/stdlib/influxdata/influxdb/sample/data/#set)
as the **left** data stream and an ad-hoc table created with [`array.from()`](/flux/v0.x/stdlib/array/from/)
as the **right** data stream.

{{% note %}}
#### Example data grouping

The example below ungroups the **left** stream to match the grouping of the **right** stream.
After the two streams are joined together, the joined data is grouped by `stationID`.
{{% /note %}}

```js
import "array"
import "influxdata/influxdb/sample"
import "join"

left =
    sample.data(set: "machineProduction")
        |> filter(fn: (r) => r.stationID == "g1" or r.stationID == "g2" or r.stationID == "g3")
        |> filter(fn: (r) => r._field == "oil_temp")
        |> limit(n: 5)

right =
    array.from(
        rows: [
            {station: "g1", opType: "auto", last_maintained: 2021-07-15T00:00:00Z},
            {station: "g2", opType: "manned", last_maintained: 2021-07-02T00:00:00Z},
        ],
    )

join.left(
    left: left |> group(),
    right: right,
    on: (l, r) => l.stationID == r.station,
    as: (l, r) => ({l with opType: r.opType, maintained: r.last_maintained}),
)
    |> group(columns: ["stationID"])
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

{{% note %}}
_`_start` and `_stop` columns have been omitted from example input and output._
{{% /note %}}

### Input

#### left {#left-input}

| _time                   | _measurement | stationID | _field   | _value |
| :---------------------- | :----------- | :-------- | :------- | -----: |
| 2021-08-01T00:00:00Z    | machinery    | g1        | oil_temp |   39.1 |
| 2021-08-01T00:00:11.51Z | machinery    | g1        | oil_temp |   40.3 |
| 2021-08-01T00:00:19.53Z | machinery    | g1        | oil_temp |   40.6 |
| 2021-08-01T00:00:25.1Z  | machinery    | g1        | oil_temp |  40.72 |
| 2021-08-01T00:00:36.88Z | machinery    | g1        | oil_temp |   40.8 |

| _time                   | _measurement | stationID | _field   | _value |
| :---------------------- | :----------- | :-------- | :------- | -----: |
| 2021-08-01T00:00:00Z    | machinery    | g2        | oil_temp |   40.6 |
| 2021-08-01T00:00:27.93Z | machinery    | g2        | oil_temp |   40.6 |
| 2021-08-01T00:00:54.96Z | machinery    | g2        | oil_temp |   40.6 |
| 2021-08-01T00:01:17.27Z | machinery    | g2        | oil_temp |   40.6 |
| 2021-08-01T00:01:41.84Z | machinery    | g2        | oil_temp |   40.6 |

| _time                   | _measurement | stationID | _field   | _value |
| :---------------------- | :----------- | :-------- | :------- | -----: |
| 2021-08-01T00:00:00Z    | machinery    | g3        | oil_temp |   41.4 |
| 2021-08-01T00:00:14.46Z | machinery    | g3        | oil_temp |  41.36 |
| 2021-08-01T00:00:25.29Z | machinery    | g3        | oil_temp |   41.4 |
| 2021-08-01T00:00:38.77Z | machinery    | g3        | oil_temp |   41.4 |
| 2021-08-01T00:00:51.2Z  | machinery    | g3        | oil_temp |   41.4 |

#### right {#right-input}

| station | opType |      last_maintained |
| :------ | :----- | -------------------: |
| g1      | auto   | 2021-07-15T00:00:00Z |
| g2      | manned | 2021-07-02T00:00:00Z |

### Output {#example-output}

| _time                   | _measurement | stationID | _field   | _value | opType | maintained           |
| :---------------------- | :----------- | :-------- | :------- | -----: | :----- | :------------------- |
| 2021-08-01T00:00:00Z    | machinery    | g1        | oil_temp |   39.1 | auto   | 2021-07-15T00:00:00Z |
| 2021-08-01T00:00:11.51Z | machinery    | g1        | oil_temp |   40.3 | auto   | 2021-07-15T00:00:00Z |
| 2021-08-01T00:00:19.53Z | machinery    | g1        | oil_temp |   40.6 | auto   | 2021-07-15T00:00:00Z |
| 2021-08-01T00:00:25.1Z  | machinery    | g1        | oil_temp |  40.72 | auto   | 2021-07-15T00:00:00Z |
| 2021-08-01T00:00:36.88Z | machinery    | g1        | oil_temp |   40.8 | auto   | 2021-07-15T00:00:00Z |

| _time                   | _measurement | stationID | _field   | _value | opType | maintained           |
| :---------------------- | :----------- | :-------- | :------- | -----: | :----- | :------------------- |
| 2021-08-01T00:00:00Z    | machinery    | g2        | oil_temp |   40.6 | manned | 2021-07-02T00:00:00Z |
| 2021-08-01T00:00:27.93Z | machinery    | g2        | oil_temp |   40.6 | manned | 2021-07-02T00:00:00Z |
| 2021-08-01T00:00:54.96Z | machinery    | g2        | oil_temp |   40.6 | manned | 2021-07-02T00:00:00Z |
| 2021-08-01T00:01:17.27Z | machinery    | g2        | oil_temp |   40.6 | manned | 2021-07-02T00:00:00Z |
| 2021-08-01T00:01:41.84Z | machinery    | g2        | oil_temp |   40.6 | manned | 2021-07-02T00:00:00Z |

| _time                   | _measurement | stationID | _field   | _value | opType | maintained |
| :---------------------- | :----------- | :-------- | :------- | -----: | :----- | :--------- |
| 2021-08-01T00:00:00Z    | machinery    | g3        | oil_temp |   41.4 |        |            |
| 2021-08-01T00:00:14.46Z | machinery    | g3        | oil_temp |   41.3 |        |            |
| 2021-08-01T00:00:25.29Z | machinery    | g3        | oil_temp |   41.4 |        |            |
| 2021-08-01T00:00:38.77Z | machinery    | g3        | oil_temp |   41.4 |        |            |
| 2021-08-01T00:00:51.2Z  | machinery    | g3        | oil_temp |   41.4 |        |            |

#### Things to note about the join output
- Because the [right stream](#right-input) does not have a row with the `g3` station tag,
  rows from the [left stream](#left-input) with the `g3` stationID tag include 
  _null_ values in columns that are populated from the right stream (`r`) in the
  `as` parameter.
{{% /expand %}}
{{< /expand-wrapper >}}

