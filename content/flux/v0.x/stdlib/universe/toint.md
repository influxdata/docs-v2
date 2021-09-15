---
title: toInt() function
description: The `toInt()` function converts all values in the `_value` column to integers.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/toint
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/toint/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/toint/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/toint/
menu:
  flux_0_x_ref:
    name: toInt
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
introduced: 0.7.0
related:
  - /flux/v0.x/data-types/basic/int/
  - /flux/v0.x/stdlib/universe/int/
---

The `toInt()` function converts all values in the `_value` column to integers.

```js
toInt()
```

##### Supported data types

- bool
- duration
- float
- string (numeric)
- time
- uinteger

`toInt()` behavior depends on the `_value` column data type:

| \_value type | Returned value                                  |
| :----------- | :---------------------------------------------- |
| string       | Integer equivalent of the numeric string        |
| bool         | 1 (true) or 0 (false)                           |
| duration     | Number of nanoseconds in the specified duration |
| time         | Equivalent nanosecond epoch timestamp           |
| float        | Value truncated at the decimal                  |
| uint         | Integer equivalent of the unsigned integer      |

{{% note %}}
To convert values in a column other than `_value`, define a custom function
patterned after the [function definition](#function-definition),
but replace `_value` with your desired column.
{{% /note %}}

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Convert a float value column to an integer column](#convert-a-float-value-column-to-an-integer-column)
- [Convert a boolean value column to an integer column](#convert-a-boolean-value-column-to-an-integer-column)
- [Convert a uinteger value column to an integer column](#convert-a-uinteger-value-column-to-an-integer-column)

#### Convert a float value column to an integer column
```js
import "sampledata"

sampledata.float()
  |> toInt()
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "float" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |     -2 |
| 2021-01-01T00:00:10Z | t1  |     10 |
| 2021-01-01T00:00:20Z | t1  |      7 |
| 2021-01-01T00:00:30Z | t1  |     17 |
| 2021-01-01T00:00:40Z | t1  |     15 |
| 2021-01-01T00:00:50Z | t1  |      4 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:20Z | t2  |     -3 |
| 2021-01-01T00:00:30Z | t2  |     19 |
| 2021-01-01T00:00:40Z | t2  |     13 |
| 2021-01-01T00:00:50Z | t2  |      1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Convert a boolean value column to an integer column
```js
import "sampledata"

sampledata.bool()
  |> toInt()
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "bool" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
{{% flux/sample "numericBool" %}}

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Convert a uinteger value column to an integer column
```js
import "sampledata"

sampledata.uint()
  |> toInt()
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "uint" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |     -2 |
| 2021-01-01T00:00:10Z | t1  |     10 |
| 2021-01-01T00:00:20Z | t1  |      7 |
| 2021-01-01T00:00:30Z | t1  |     17 |
| 2021-01-01T00:00:40Z | t1  |     15 |
| 2021-01-01T00:00:50Z | t1  |      4 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:20Z | t2  |     -3 |
| 2021-01-01T00:00:30Z | t2  |     19 |
| 2021-01-01T00:00:40Z | t2  |     13 |
| 2021-01-01T00:00:50Z | t2  |      1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
toInt = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: int(v: r._value) }))
```
