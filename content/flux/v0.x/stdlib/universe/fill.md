---
title: fill() function
description: The `fill()` function replaces all null values in an input stream and replace them with a non-null value.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/fill
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/fill/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/fill/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/fill/
menu:
  flux_0_x_ref:
    name: fill
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/fill/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#group-by-time-intervals-and-fill, InfluxQL – FILL
introduced: 0.14.0
---

The `fill()` function replaces all null values in an input stream with a non-null value.
The output stream is the same as the input stream with all null values replaced in the specified column.

```js
fill(column: "_value", value: 0.0)

// OR

fill(column: "_value", usePrevious: true)
```

## Parameters

### column {data-type="string"}
The column in which to replace null values. Defaults to `"_value"`.

### value {data-type="string, bool, int, uint, float, duration, time"}
The constant value to use in place of nulls.
The value type must match the value type of the `column`.

### usePrevious {data-type="bool"}
When `true`, assigns the value set in the previous non-null row.

{{% note %}}
Cannot be used with `value`.
{{% /note %}}

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Fill null values with a specified non-null value](#fill-null-values-with-a-specified-non-null-value)
- [Fill null values with the previous non-null value](#fill-null-values-with-the-previous-non-null-value)

#### Fill null values with a specified non-null value
```js
import "sampledata"

sampledata.float(includeNull: true)
  |> fill(value: 0.0)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "float" true %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |  -2.18 |
| 2021-01-01T00:00:10Z | t1  |    0.0 |
| 2021-01-01T00:00:20Z | t1  |   7.35 |
| 2021-01-01T00:00:30Z | t1  |    0.0 |
| 2021-01-01T00:00:40Z | t1  |    0.0 |
| 2021-01-01T00:00:50Z | t1  |   4.43 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |    0.0 |
| 2021-01-01T00:00:10Z | t2  |   4.97 |
| 2021-01-01T00:00:20Z | t2  |  -3.75 |
| 2021-01-01T00:00:30Z | t2  |  19.77 |
| 2021-01-01T00:00:40Z | t2  |    0.0 |
| 2021-01-01T00:00:50Z | t2  |   1.86 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Fill null values with the previous non-null value
```js
import "sampledata"

sampledata.float(includeNull: true)
  |> fill(usePrevious: true)
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "float" true %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |  -2.18 |
| 2021-01-01T00:00:10Z | t1  |  -2.18 |
| 2021-01-01T00:00:20Z | t1  |   7.35 |
| 2021-01-01T00:00:30Z | t1  |   7.35 |
| 2021-01-01T00:00:40Z | t1  |   7.35 |
| 2021-01-01T00:00:50Z | t1  |   4.43 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |        |
| 2021-01-01T00:00:10Z | t2  |   4.97 |
| 2021-01-01T00:00:20Z | t2  |  -3.75 |
| 2021-01-01T00:00:30Z | t2  |  19.77 |
| 2021-01-01T00:00:40Z | t2  |  19.77 |
| 2021-01-01T00:00:50Z | t2  |   1.86 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
