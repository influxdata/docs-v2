---
title: duplicate() function
description: The `duplicate()` function duplicates a specified column in a table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/duplicate
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/duplicate/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/duplicate/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/duplicate/
menu:
  flux_0_x_ref:
    name: duplicate
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `duplicate()` function duplicates a specified column in a table.
If the specified column is part of the group key, it will be duplicated, but will
not be part of the output table's group key.

```js
duplicate(column: "column-name", as: "duplicate-name")
```

## Parameters

### column {data-type="string"}
({{< req >}})
Column to duplicate.

### as {data-type="string"}
({{< req >}})
Name assigned to the duplicate column.

{{% note %}}
If the `as` column already exists, this function will overwrite the existing values.
{{% /note %}}

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
	|> duplicate(column: "tag", as: "tag_dup")
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
| _time                | tag | _value | tag_dup |
| :------------------- | :-- | -----: | :------ |
| 2021-01-01T00:00:00Z | t1  |     -2 | t1      |
| 2021-01-01T00:00:10Z | t1  |     10 | t1      |
| 2021-01-01T00:00:20Z | t1  |      7 | t1      |
| 2021-01-01T00:00:30Z | t1  |     17 | t1      |
| 2021-01-01T00:00:40Z | t1  |     15 | t1      |
| 2021-01-01T00:00:50Z | t1  |      4 | t1      |

| _time                | tag | _value | tag_dup |
| :------------------- | :-- | -----: | :------ |
| 2021-01-01T00:00:00Z | t2  |     19 | t2      |
| 2021-01-01T00:00:10Z | t2  |      4 | t2      |
| 2021-01-01T00:00:20Z | t2  |     -3 | t2      |
| 2021-01-01T00:00:30Z | t2  |     19 | t2      |
| 2021-01-01T00:00:40Z | t2  |     13 | t2      |
| 2021-01-01T00:00:50Z | t2  |      1 | t2      |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
