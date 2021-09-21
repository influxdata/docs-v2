---
title: keyValues() function
description: The `keyValues()` function returns a table with the input table's group key plus two columns, _key and _value, that correspond to unique column + value pairs from the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/keyvalues
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/keyvalues/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/keyvalues/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/keyvalues/
menu:
  flux_0_x_ref:
    name: keyValues
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-measurements, InfluxQL – SHOW MEASUREMENTS
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-field-keys, InfluxQL – SHOW FIELD KEYS
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys, InfluxQL – SHOW TAG KEYS
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-values, InfluxQL – SHOW TAG VALUES
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-serie, InfluxQL – SHOW SERIES
introduced: 0.13.0
---

The `keyValues()` function returns a table with the input table's group key plus two columns,
`_key` and `_value`, that correspond to unique column and value pairs for specific
columns in each input table.

```js
keyValues(keyColumns: ["usage_idle", "usage_user"])
```

<!--
```js
// OR

keyValues(fn: (schema) => schema.columns |> filter(fn: (r) =>  r.label =~ /usage_.*/))
``` -->

## Parameters

<!--
{{% note %}}
`keyColumns` and `fn` are mutually exclusive. Only one may be used at a time.
{{% /note %}}
-->

### keyColumns {data-type="array of strings"}

A list of columns from which values are extracted.
All columns indicated must be of the same type.
Each input table must have all of the columns listed by the `keyColumns` parameter.

<!--
### fn {data-type="function"}

Function used to identify a set of columns.
All columns indicated must be of the same type.

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

## Additional requirements

- Only one of `keyColumns` or `fn` may be used in a single call.
- All columns indicated must be of the same type.
- Each input table must have all of the columns listed by the `keyColumns` parameter.
-->

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
The following examples use [`sample.data()`](/flux/v0.x/stdlib/influxdata/influxdb/sample/data/)
to simulate data queried from InfluxDB and illustrate how `keys()` transforms data.

- [Get key values from explicitly defined columns](#get-key-values-from-explicitly-defined-columns)
- [Get key values from all group key columns](#get-key-values-from-all-group-key-columns)

#### Get key values from explicitly defined columns

```js
import "influxdata/influxdb/sample"

data = sample.data(set: "airSensor") 
  |> filter(fn: (r) => r.sensor_id == "TLM0100")

data
  |> keyValues(keyColumns: ["sensor_id", "_field"])
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}
##### Example input data

{{< flux/group-key "[ _field, _measurement, sensor_id]" >}}

| _field | _measurement | sensor_id | _time                                             |              _value |
| :----- | :----------- | :-------- | :------------------------------------------------ | ------------------: |
| co     | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:21:57Z{{% /nowrap %}} | 0.31069912185103726 |
| co     | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:07Z{{% /nowrap %}} |  0.2958765656451926 |
| co     | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:17Z{{% /nowrap %}} |  0.3148598993377045 |
| co     | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:27Z{{% /nowrap %}} |  0.3138373097388317 |

| _field   | _measurement | sensor_id | _time                                             |             _value |
| :------- | :----------- | :-------- | :------------------------------------------------ | -----------------: |
| humidity | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:21:57Z{{% /nowrap %}} | 36.032121180773785 |
| humidity | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:07Z{{% /nowrap %}} | 36.078174038253856 |
| humidity | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:17Z{{% /nowrap %}} |  36.10019403559529 |
| humidity | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:27Z{{% /nowrap %}} |  36.12069055726357 |

| _field      | _measurement | sensor_id | _time                                             |            _value |
| :---------- | :----------- | :-------- | :------------------------------------------------ | ----------------: |
| temperature | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:21:57Z{{% /nowrap %}} | 70.84122391403946 |
| temperature | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:07Z{{% /nowrap %}} | 70.86036165985708 |
| temperature | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:17Z{{% /nowrap %}} | 70.89253177998165 |
| temperature | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:27Z{{% /nowrap %}} | 70.85193833073798 |

##### Example output data

| _field | _measurement | sensor_id | _key      |  _value |
| :----- | :----------- | :-------- | :-------- | ------: |
| co     | airSensors   | TLM0100   | sensor_id | TLM0100 |
| co     | airSensors   | TLM0100   | _field    |      co |

| _field   | _measurement | sensor_id | _key      |   _value |
| :------- | :----------- | :-------- | :-------- | -------: |
| humidity | airSensors   | TLM0100   | sensor_id |  TLM0100 |
| humidity | airSensors   | TLM0100   | _field    | humidity |

| _field      | _measurement | sensor_id | _key      |      _value |
| :---------- | :----------- | :-------- | :-------- | ----------: |
| temperature | airSensors   | TLM0100   | sensor_id |     TLM0100 |
| temperature | airSensors   | TLM0100   | _field    | temperature |
{{% /expand %}}
{{< /expand-wrapper >}}

#### Get key values from all group key columns

1. Use [`keys()`](/flux/v0.x/stdlib/universe/keys/) and [`findColumn()`](/flux/v0.x/stdlib/universe/findcolumn/)
    to extract an array of group key columns and store it as a variable.
2. Use `keyValues()` and provide the group key column array variable to the `keyColumns` parameter.

```js
import "influxdata/influxdb/sample"

data = sample.data(set: "airSensor") 
  |> filter(fn: (r) => r.sensor_id == "TLM0100")

keyColumns = data
  |> keys()
  |> findColumn(fn: (key) => true, column: "_value")
  // Returns [_field, _measurement, sensor_id]

data
  |> keyValues(keyColumns: keyColumns)
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}
##### Example input data

{{< flux/group-key "[ _field, _measurement, sensor_id]" >}}

| _field | _measurement | sensor_id | _time                                             |              _value |
| :----- | :----------- | :-------- | :------------------------------------------------ | ------------------: |
| co     | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:21:57Z{{% /nowrap %}} | 0.31069912185103726 |
| co     | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:07Z{{% /nowrap %}} |  0.2958765656451926 |
| co     | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:17Z{{% /nowrap %}} |  0.3148598993377045 |
| co     | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:27Z{{% /nowrap %}} |  0.3138373097388317 |

| _field   | _measurement | sensor_id | _time                                             |             _value |
| :------- | :----------- | :-------- | :------------------------------------------------ | -----------------: |
| humidity | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:21:57Z{{% /nowrap %}} | 36.032121180773785 |
| humidity | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:07Z{{% /nowrap %}} | 36.078174038253856 |
| humidity | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:17Z{{% /nowrap %}} |  36.10019403559529 |
| humidity | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:27Z{{% /nowrap %}} |  36.12069055726357 |

| _field      | _measurement | sensor_id | _time                                             |            _value |
| :---------- | :----------- | :-------- | :------------------------------------------------ | ----------------: |
| temperature | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:21:57Z{{% /nowrap %}} | 70.84122391403946 |
| temperature | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:07Z{{% /nowrap %}} | 70.86036165985708 |
| temperature | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:17Z{{% /nowrap %}} | 70.89253177998165 |
| temperature | airSensors   | TLM0100   | {{% nowrap %}}2021-09-08T14:22:27Z{{% /nowrap %}} | 70.85193833073798 |

##### Example output data

| _field | _measurement | sensor_id | _key         |     _value |
| :----- | :----------- | :-------- | :----------- | ---------: |
| co     | airSensors   | TLM0100   | _field       |         co |
| co     | airSensors   | TLM0100   | _measurement | airSensors |
| co     | airSensors   | TLM0100   | sensor_id    |    TLM0100 |

| _field   | _measurement | sensor_id | _key         |     _value |
| :------- | :----------- | :-------- | :----------- | ---------: |
| humidity | airSensors   | TLM0100   | _field       |   humidity |
| humidity | airSensors   | TLM0100   | _measurement | airSensors |
| humidity | airSensors   | TLM0100   | sensor_id    |    TLM0100 |

| _field      | _measurement | sensor_id | _key         |      _value |
| :---------- | :----------- | :-------- | :----------- | ----------: |
| temperature | airSensors   | TLM0100   | _field       | temperature |
| temperature | airSensors   | TLM0100   | _measurement |  airSensors |
| temperature | airSensors   | TLM0100   | sensor_id    |     TLM0100 |
{{% /expand %}}
{{< /expand-wrapper >}}

<!--
##### Get key values from columns matching a regular expression

```js
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> keyValues(fn: (schema) => schema.columns |> filter(fn: (r) =>  r.label =~ /usage_.*/))
```
 -->
