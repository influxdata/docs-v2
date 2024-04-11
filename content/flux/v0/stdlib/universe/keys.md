---
title: keys() function
description: >
  `keys()` returns the columns that are in the group key of each input table.
menu:
  flux_v0_ref:
    name: keys
    parent: universe
    identifier: universe/keys
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L1610-L1610

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`keys()` returns the columns that are in the group key of each input table.

Each output table contains a row for each group key column label.
A single group key column label is stored in the specified `column` for each row.
All columns not in the group key are dropped.

##### Function type signature

```js
(<-tables: stream[A], ?column: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### column

Column to store group key labels in. Default is `_value`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Return group key columns for each input table](#return-group-key-columns-for-each-input-table)
- [Return all distinct group key columns in a single table](#return-all-distinct-group-key-columns-in-a-single-table)
- [Return group key columns as an array](#return-group-key-columns-as-an-array)

### Return group key columns for each input table

```js
data
    |> keys()

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

| *_field | *_measurement | *sensorID | _value       |
| ------- | ------------- | --------- | ------------ |
| co      | airSensors    | TLM0100   | _field       |
| co      | airSensors    | TLM0100   | _measurement |
| co      | airSensors    | TLM0100   | sensorID     |

| *_field  | *_measurement | *sensorID | _value       |
| -------- | ------------- | --------- | ------------ |
| humidity | airSensors    | TLM0100   | _field       |
| humidity | airSensors    | TLM0100   | _measurement |
| humidity | airSensors    | TLM0100   | sensorID     |

| *_field     | *_measurement | *sensorID | _value       |
| ----------- | ------------- | --------- | ------------ |
| temperature | airSensors    | TLM0100   | _field       |
| temperature | airSensors    | TLM0100   | _measurement |
| temperature | airSensors    | TLM0100   | sensorID     |

{{% /expand %}}
{{< /expand-wrapper >}}

### Return all distinct group key columns in a single table

```js
data
    |> keys()
    |> keep(columns: ["_value"])
    |> distinct()

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

| _value       |
| ------------ |
| _field       |
| _measurement |
| sensorID     |

{{% /expand %}}
{{< /expand-wrapper >}}

### Return group key columns as an array

1. Use `keys()` to replace the `_value` column with the group key labels.
2. Use `findColumn()` to return the `_value` column as an array.

```js
import "sampledata"

sampledata.int()
    |> keys()
    |> findColumn(fn: (key) => true, column: "_value")// Returns [tag]


```

