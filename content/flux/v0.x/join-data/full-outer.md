---
title: Perform a full outer join
description: >
  Use [`join.full()`](/flux/v0.x/stdlib/join/full/) to perform an full outer join of two streams of data.
  Full outer joins output a row for all rows in both the **left** and **right** input streams
  and join rows that match according to the `on` predicate.
menu:
  flux_0_x:
    name: Full outer join
    parent: Join data
weight: 103
related:
  - /flux/v0.x/join-data/troubleshoot-joins/
  - /flux/v0.x/stdlib/join/
  - /flux/v0.x/stdlib/join/full/
list_code_example: |
  ```js
  import "join"

  left = from(bucket: "example-bucket-1") |> //...
  right = from(bucket: "example-bucket-2") |> //...

  join.full(
      left: left,
      right: right,
      on: (l, r) => l.id== r.id,
      as: (l, r) => {
          id = if exists l.id then l.id else r.id
          
          return {name: l.name, location: r.location, id: id}
      },
  )
  ```
---

Use [`join.full()`](/flux/v0.x/stdlib/join/full/) to perform an full outer join of two streams of data.
Full outer joins output a row for all rows in both the **left** and **right** input streams
and join rows that match according to the `on` predicate.

{{< svg svg="static/svgs/join-diagram.svg" class="full" >}}

{{< expand-wrapper >}}
{{% expand "View table illustration of a full outer join" %}}
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
#### Full outer join result

|     |                                      |                                      |                                      |                                      |
| :-- | :----------------------------------- | :----------------------------------- | :----------------------------------- | :----------------------------------- |
| r1  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r2  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> |                                      |                                      |
| r3  |                                      |                                      | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r4  |                                      |                                      | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Use join.full to join your data

1. Import the `join` package.
2. Define the **left** and **right** data streams to join:

    - Each stream must have one or more columns with common values.
      Column labels do not need to match, but column values do.
    - Each stream should have identical [group keys](/flux/v0.x/get-started/data-model/#group-key).

    _For more information, see [join data requirements](/flux/v0.x/join-data/#data-requirements)._

3. Use `join.full()` to join the two streams together.
    Provide the following required parameters:

    - `left`: Stream of data representing the left side of the join.
    - `right`: Stream of data representing the right side of the join.
    - `on`: [Join predicate](/flux/v0.x/join-data/#join-predicate-function-on).
      For example: `(l, r) => l.column == r.column`.
    - `as`: [Join output function](/flux/v0.x/join-data/#join-output-function-as)
      that returns a record with values from each input stream.
      
      ##### Account for missing, non-group-key values

      In a full outer join, it’s possible for either the left (`l`) or right (`r`)
      to contain _null_ values for the columns used in the join operation
      and default to a default record (group key columns are populated and
      other columns are _null_).
      `l` and `r` will never both use default records at the same time. 
      
      To ensure non-null values are included in the output for non-group-key columns, 
      check for the existence of a value in the `l` or `r` record, and return
      the value that exists:

      ```js
      (l, r) => {
          id = if exists l.id then l.id else r.id

          return {_time: l.time, location: r.location, id: id}
      }
      ```

The following example uses a filtered selection from the
[**machineProduction** sample data set](/flux/v0.x/stdlib/influxdata/influxdb/sample/data/#set)
as the **left** data stream and an ad-hoc table created with [`array.from()`](/flux/v0.x/stdlib/array/from/)
as the **right** data stream.

{{% note %}}
#### Example data grouping

The example below ungroups the **left** stream to match the grouping of the **right** stream.
After the two streams are joined together, the joined data is grouped by `stationID`
and sorted by `_time`.
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
            {station: "g4", opType: "auto", last_maintained: 2021-08-04T00:00:00Z},
        ],
    )

join.full(
    left: left |> group(),
    right: right,
    on: (l, r) => l.stationID == r.station,
    as: (l, r) => {
        stationID = if exists l.stationID then l.stationID else r.station

        return {
            stationID: stationID,
            _time: l._time,
            _field: l._field,
            _value: l._value,
            opType: r.opType,
            maintained: r.last_maintained,
        }
    },
)
    |> group(columns: ["stationID"])
    |> sort(columns: ["_time"])
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
| g4      | auto   | 2021-08-04T00:00:00Z |

### Output {#example-output}

| _time                   | stationID | _field   | _value | maintained           | opType |
| :---------------------- | :-------- | :------- | -----: | :------------------- | :----- |
| 2021-08-01T00:00:00Z    | g1        | oil_temp |   39.1 | 2021-07-15T00:00:00Z | auto   |
| 2021-08-01T00:00:11.51Z | g1        | oil_temp |   40.3 | 2021-07-15T00:00:00Z | auto   |
| 2021-08-01T00:00:19.53Z | g1        | oil_temp |   40.6 | 2021-07-15T00:00:00Z | auto   |
| 2021-08-01T00:00:25.1Z  | g1        | oil_temp |  40.72 | 2021-07-15T00:00:00Z | auto   |
| 2021-08-01T00:00:36.88Z | g1        | oil_temp |   40.8 | 2021-07-15T00:00:00Z | auto   |

| _time                   | stationID | _field   | _value | maintained           | opType |
| :---------------------- | :-------- | :------- | -----: | :------------------- | :----- |
| 2021-08-01T00:00:00Z    | g2        | oil_temp |   40.6 | 2021-07-02T00:00:00Z | manned |
| 2021-08-01T00:00:27.93Z | g2        | oil_temp |   40.6 | 2021-07-02T00:00:00Z | manned |
| 2021-08-01T00:00:54.96Z | g2        | oil_temp |   40.6 | 2021-07-02T00:00:00Z | manned |
| 2021-08-01T00:01:17.27Z | g2        | oil_temp |   40.6 | 2021-07-02T00:00:00Z | manned |
| 2021-08-01T00:01:41.84Z | g2        | oil_temp |   40.6 | 2021-07-02T00:00:00Z | manned |

| _time                   | stationID | _field   | _value | maintained | opType |
| :---------------------- | :-------- | :------- | -----: | :--------- | :----- |
| 2021-08-01T00:00:00Z    | g3        | oil_temp |   41.4 |            |        |
| 2021-08-01T00:00:14.46Z | g3        | oil_temp |  41.36 |            |        |
| 2021-08-01T00:00:25.29Z | g3        | oil_temp |   41.4 |            |        |
| 2021-08-01T00:00:38.77Z | g3        | oil_temp |   41.4 |            |        |
| 2021-08-01T00:00:51.2Z  | g3        | oil_temp |   41.4 |            |        |

| _time | stationID | _field | _value | maintained           | opType |
| :---- | :-------- | :----- | -----: | :------------------- | :----- |
|       | g4        |        |        | 2021-08-04T00:00:00Z | auto   |

#### Things to note about the join output
- Because the [right stream](#right-input) does not have rows with the `g3` stationID tag,
  the joined output includes rows with the `g3` stationID tag from the [left stream](#left-input)
  with _null_ values in columns populated from the **right** stream.
- Because the [left stream](#left-input) does not have rows with the `g4` stationID tag,
  the joined output includes rows with the `g4` stationID tag from the [right stream](#right-input)
  with _null_ values in columns populated from the **left** stream.

{{% /expand %}}
{{< /expand-wrapper >}}

