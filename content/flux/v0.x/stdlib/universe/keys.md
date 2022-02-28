---
title: keys() function
description: >
  The `keys()` function outputs the group key of input tables.
  For each input table, it outputs a table with the same group key columns, plus a
  _value column containing the labels of the input table's group key.  
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/keys
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/keys/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/keys/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/keys/
menu:
  flux_0_x_ref:
    name: keys
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-measurements, InfluxQL – SHOW MEASUREMENTS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-field-keys, InfluxQL – SHOW FIELD KEYS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys, InfluxQL – SHOW TAG KEYS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys, InfluxQL – SHOW SERIES
introduced: 0.13.0
---

The `keys()` function outputs the column keys in the [group key](/flux/v0.x/get-started/data-model/#group-key) of each input table.
For each input table, the function outputs a table with the same group key columns,
and a `_value` column containing the labels of the input table's group key.
Each row in an output table contains the group key value and the label of one column in the group key of the input table.
Each output table has the same number of rows as the size of the group key of the input table.

```js
keys(column: "_value")
```

## Parameters

### column {data-type="string"}
Name of the output column in to store group key labels in.
Default is "_value"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
The following examples use [`sample.data()`](/flux/v0.x/stdlib/influxdata/influxdb/sample/data/)
to simulate data queried from InfluxDB and illustrate how `keys()` transforms data.

- [Return group key columns for each input table](#return-group-key-columns-for-each-input-table)
- [Return all distinct group key columns in a single table](#return-all-distinct-group-key-columns-in-a-single-table)
- [Return group key columns as an array](#return-group-key-columns-as-an-array)

#### Return group key columns for each input table
```js
import "influxdata/influxdb/sample"

data = sample.data(set: "airSensor")
    |> range(start: -30m)
    |> filter(fn: (r) => r.sensor_id == "TLM0100")

data
    |> keys()
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}
##### Example input data

{{< flux/group-key "[_start, _stop, _field, _measurement, sensor_id]" >}}

| _start               | _stop                | _field | _measurement | sensor_id | _time                |              _value |
| :------------------- | :------------------- | :----- | :----------- | :-------- | :------------------- | ------------------: |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   | 2021-09-08T14:21:57Z | 0.31069912185103726 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   | 2021-09-08T14:22:07Z |  0.2958765656451926 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   | 2021-09-08T14:22:17Z |  0.3148598993377045 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   | 2021-09-08T14:22:27Z |  0.3138373097388317 |

| _start               | _stop                | _field   | _measurement | sensor_id | _time                |             _value |
| :------------------- | :------------------- | :------- | :----------- | :-------- | :------------------- | -----------------: |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   | 2021-09-08T14:21:57Z | 36.032121180773785 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   | 2021-09-08T14:22:07Z | 36.078174038253856 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   | 2021-09-08T14:22:17Z |  36.10019403559529 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   | 2021-09-08T14:22:27Z |  36.12069055726357 |

| _start               | _stop                | _field      | _measurement | sensor_id | _time                |            _value |
| :------------------- | :------------------- | :---------- | :----------- | :-------- | :------------------- | ----------------: |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   | 2021-09-08T14:21:57Z | 70.84122391403946 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   | 2021-09-08T14:22:07Z | 70.86036165985708 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   | 2021-09-08T14:22:17Z | 70.89253177998165 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   | 2021-09-08T14:22:27Z | 70.85193833073798 |

##### Example output data

| _start               | _stop                | _field | _measurement | sensor_id |       _value |
| :------------------- | :------------------- | :----- | :----------- | :-------- | -----------: |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   |       _start |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   |        _stop |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   |       _field |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   | _measurement |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   |    sensor_id |

| _start               | _stop                | _field   | _measurement | sensor_id |       _value |
| :------------------- | :------------------- | :------- | :----------- | :-------- | -----------: |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   |       _start |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   |        _stop |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   |       _field |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   | _measurement |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   |    sensor_id |

| _start               | _stop                | _field      | _measurement | sensor_id |       _value |
| :------------------- | :------------------- | :---------- | :----------- | :-------- | -----------: |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   |       _start |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   |        _stop |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   |       _field |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   | _measurement |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   |    sensor_id |
{{% /expand %}}
{{< /expand-wrapper >}}

#### Return all distinct group key columns in a single table
```js
import "influxdata/influxdb/sample"

data = sample.data(set: "airSensor")
    |> range(start: -30m)
    |> filter(fn: (r) => r.sensor_id == "TLM0100")

data
    |> keys()
    |> keep(columns: ["_value"])
    |> distinct()
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}
##### Example input data

{{< flux/group-key "[_start, _stop, _field, _measurement, sensor_id]" >}}

| _start               | _stop                | _field | _measurement | sensor_id | _time                |              _value |
| :------------------- | :------------------- | :----- | :----------- | :-------- | :------------------- | ------------------: |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   | 2021-09-08T14:21:57Z | 0.31069912185103726 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   | 2021-09-08T14:22:07Z |  0.2958765656451926 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   | 2021-09-08T14:22:17Z |  0.3148598993377045 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | co     | airSensors   | TLM0100   | 2021-09-08T14:22:27Z |  0.3138373097388317 |

| _start               | _stop                | _field   | _measurement | sensor_id | _time                |             _value |
| :------------------- | :------------------- | :------- | :----------- | :-------- | :------------------- | -----------------: |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   | 2021-09-08T14:21:57Z | 36.032121180773785 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   | 2021-09-08T14:22:07Z | 36.078174038253856 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   | 2021-09-08T14:22:17Z |  36.10019403559529 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | humidity | airSensors   | TLM0100   | 2021-09-08T14:22:27Z |  36.12069055726357 |

| _start               | _stop                | _field      | _measurement | sensor_id | _time                |            _value |
| :------------------- | :------------------- | :---------- | :----------- | :-------- | :------------------- | ----------------: |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   | 2021-09-08T14:21:57Z | 70.84122391403946 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   | 2021-09-08T14:22:07Z | 70.86036165985708 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   | 2021-09-08T14:22:17Z | 70.89253177998165 |
| 2021-09-08T14:21:53Z | 2021-09-08T14:51:53Z | temperature | airSensors   | TLM0100   | 2021-09-08T14:22:27Z | 70.85193833073798 |

##### Example output data

|       _value |
| -----------: |
|       _start |
|        _stop |
|       _field |
| _measurement |
|    sensor_id |

{{% /expand %}}
{{< /expand-wrapper >}}

#### Return group key columns as an array
To return group key columns as an array:

1. Use `keys()` to replace the `_value` column with the group key labels.
2. Use [`findColumn()`](/flux/v0.x/stdlib/universe/findcolumn/) to return the
   `_value` column as an array.

```js
import "influxdata/influxdb/sample"

data = sample.data(set: "airSensor")
    |> range(start: -30m)
    |> filter(fn: (r) => r.sensor_id == "TLM0100")

data
    |> keys()
    |> findColumn(fn: (key) => true, column: "_value")

// Returns [_start, _stop, _field, _measurement, sensor_id]
```
