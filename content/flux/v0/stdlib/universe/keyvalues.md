---
title: keyValues() function
description: >
  `keyValues()` returns a stream of tables with each input tables' group key and
  two columns, _key and _value, that correspond to unique column label and value
  pairs for each input table.
menu:
  flux_v0_ref:
    name: keyValues
    parent: universe
    identifier: universe/keyValues
weight: 101
flux/v0/tags: [transformations]
introduced: 0.13.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L1372-L1378

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`keyValues()` returns a stream of tables with each input tables' group key and
two columns, _key and _value, that correspond to unique column label and value
pairs for each input table.



##### Function type signature

```js
(<-tables: stream[A], ?keyColumns: [string]) => stream[{B with _value: C, _key: string}] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### keyColumns

List of columns from which values are extracted.

All columns must be of the same type.
Each input table must have all of the columns in the `keyColumns` parameter.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Get key values from explicitly defined columns

```js
data
    |> keyValues(keyColumns: ["sensorID", "_field"])

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_field | *_measurement | *sensorID | _time                | _value  |
| ------- | ------------- | --------- | -------------------- | ------- |
| co      | airSensors    | TLM0100   | 2021-09-08T14:21:57Z | 0.31    |
| co      | airSensors    | TLM0100   | 2021-09-08T14:22:07Z | 0.295   |
| co      | airSensors    | TLM0100   | 2021-09-08T14:22:17Z | 0.314   |
| co      | airSensors    | TLM0100   | 2021-09-08T14:22:27Z | 0.313   |

| *_field  | *_measurement | *sensorID | _time                | _value  |
| -------- | ------------- | --------- | -------------------- | ------- |
| humidity | airSensors    | TLM0100   | 2021-09-08T14:21:57Z | 36.03   |
| humidity | airSensors    | TLM0100   | 2021-09-08T14:22:07Z | 36.07   |
| humidity | airSensors    | TLM0100   | 2021-09-08T14:22:17Z | 36.1    |
| humidity | airSensors    | TLM0100   | 2021-09-08T14:22:27Z | 36.12   |

| *_field     | *_measurement | *sensorID | _time                | _value  |
| ----------- | ------------- | --------- | -------------------- | ------- |
| temperature | airSensors    | TLM0100   | 2021-09-08T14:21:57Z | 70.84   |
| temperature | airSensors    | TLM0100   | 2021-09-08T14:22:07Z | 70.86   |
| temperature | airSensors    | TLM0100   | 2021-09-08T14:22:17Z | 70.89   |
| temperature | airSensors    | TLM0100   | 2021-09-08T14:22:27Z | 70.85   |


#### Output data

| *_field | *_measurement | *sensorID | _key     | _value  |
| ------- | ------------- | --------- | -------- | ------- |
| co      | airSensors    | TLM0100   | sensorID | TLM0100 |
| co      | airSensors    | TLM0100   | _field   | co      |

| *_field  | *_measurement | *sensorID | _key     | _value   |
| -------- | ------------- | --------- | -------- | -------- |
| humidity | airSensors    | TLM0100   | sensorID | TLM0100  |
| humidity | airSensors    | TLM0100   | _field   | humidity |

| *_field     | *_measurement | *sensorID | _key     | _value      |
| ----------- | ------------- | --------- | -------- | ----------- |
| temperature | airSensors    | TLM0100   | sensorID | TLM0100     |
| temperature | airSensors    | TLM0100   | _field   | temperature |

{{% /expand %}}
{{< /expand-wrapper >}}
