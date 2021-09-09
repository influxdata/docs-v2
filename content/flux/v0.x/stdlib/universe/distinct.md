---
title: distinct() function
description: The `distinct()` function returns the unique values for a given column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/distinct
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/distinct/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/distinct/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/distinct/
menu:
  flux_0_x_ref:
    name: distinct
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#distinct, InfluxQL – DISTINCT()
introduced: 0.7.0
---

The `distinct()` function returns the unique values for a given column.
The `_value` of each output record is set to the distinct value in the specified column.
`null` is considered its own distinct value if it is present.

_**Output data type:** Record_

```js
distinct(column: "host")
```

{{% warn %}}
#### Empty tables
`distinct()` drops empty tables.
{{% /warn %}}

## Parameters

### column {data-type="string"}
Column to return unique values from.
Default is `_value`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

#### Return distinct values from the _value column
```js
import "sampledata"

data = sampledata.int()

data
  |> distinct()
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample set="int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | _value |
| :-- | -----: |
| t1  |     -2 |
| t1  |     10 |
| t1  |      7 |
| t1  |     17 |
| t1  |     15 |
| t1  |      4 |

| tag | _value |
| :-- | -----: |
| t2  |     19 |
| t2  |      4 |
| t2  |     -3 |
| t2  |     13 |
| t2  |      1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Return distinct values from a non-default column
```js
import "sampledata"

sampledata.int()
  |> distinct(column: "tag")
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample set="int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | _value |
| :-- | -----: |
| t1  |     t1 |

| tag | _value |
| :-- | -----: |
| t2  |     t2 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Return distinct values from with null values
```js
import "sampledata"

sampledata.int(includeNull: true)
  |> distinct()
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" true %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | _value |
| :-- | -----: |
| t1  |     -2 |
| t1  |        |
| t1  |      7 |
| t1  |      4 |

| tag | _value |
| :-- | -----: |
| t2  |        |
| t2  |      4 |
| t2  |     -3 |
| t2  |     19 |
| t2  |      1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
