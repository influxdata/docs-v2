---
title: toBool() function
description: The `toBool()` function converts all values in the `_value` column to booleans.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/tobool
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/tobool/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/tobool/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/tobool/
menu:
  flux_0_x_ref:
    name: toBool
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
related:
  - /flux/v0.x/data-types/basic/boolean/
  - /flux/v0.x/stdlib/universe/bool/
introduced: 0.7.0
---

The `toBool()` function converts all values in the `_value` column to booleans.

```js
toBool()
```

{{% note %}}
To convert values in a column other than `_value`, define a custom function
patterned after the [function definition](#function-definition),
but replace `_value` with your desired column.
{{% /note %}}

##### Supported data types

- **string**: `true` or `false`
- **int**: `1` or `0`
- **uint**: `1` or `0`
- **float**: `1.0` or `0.0`

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

#### Convert an integer value column to a boolean column
```js
import "sampledata"

sampledata.numericBool()
  |> toBool()
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "numericBool" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |   true |
| 2021-01-01T00:00:10Z | t1  |   true |
| 2021-01-01T00:00:20Z | t1  |  false |
| 2021-01-01T00:00:30Z | t1  |   true |
| 2021-01-01T00:00:40Z | t1  |  false |
| 2021-01-01T00:00:50Z | t1  |  false |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |  false |
| 2021-01-01T00:00:10Z | t2  |   true |
| 2021-01-01T00:00:20Z | t2  |  false |
| 2021-01-01T00:00:30Z | t2  |   true |
| 2021-01-01T00:00:40Z | t2  |   true |
| 2021-01-01T00:00:50Z | t2  |  false |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
toBool = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: bool(v: r._value) }))
```
