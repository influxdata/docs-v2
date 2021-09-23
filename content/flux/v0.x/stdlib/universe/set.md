---
title: set() function
description: The `set()` function assigns a static value to each record in the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/set
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/set/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/set/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/set/
menu:
  flux_0_x_ref:
    name: set
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `set()` function assigns a static value to each record in the input table.
The key may modify an existing column or add a new column to the tables.
If the modified column is part of the group key, the output tables are regrouped as needed.

```js
set(key: "myKey",value: "myValue")
```

## Parameters

### key {data-type="string"}
({{< req >}})
The label of the column to modify or set.

### value {data-type="string"}
({{< req >}})
The string value to set.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> set(key: "host", value: "prod1")
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value | host  |
| :------------------- | :-- | -----: | :---- |
| 2021-01-01T00:00:00Z | t1  |     -2 | prod1 |
| 2021-01-01T00:00:10Z | t1  |     10 | prod1 |
| 2021-01-01T00:00:20Z | t1  |      7 | prod1 |
| 2021-01-01T00:00:30Z | t1  |     17 | prod1 |
| 2021-01-01T00:00:40Z | t1  |     15 | prod1 |
| 2021-01-01T00:00:50Z | t1  |      4 | prod1 |

| _time                | tag | _value | host  |
| :------------------- | :-- | -----: | :---- |
| 2021-01-01T00:00:00Z | t2  |     19 | prod1 |
| 2021-01-01T00:00:10Z | t2  |      4 | prod1 |
| 2021-01-01T00:00:20Z | t2  |     -3 | prod1 |
| 2021-01-01T00:00:30Z | t2  |     19 | prod1 |
| 2021-01-01T00:00:40Z | t2  |     13 | prod1 |
| 2021-01-01T00:00:50Z | t2  |      1 | prod1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
