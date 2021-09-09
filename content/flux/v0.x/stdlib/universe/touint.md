---
title: toUInt() function
description: The `toUInt()` function converts all values in the `_value` column to UIntegers.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/touint
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/touint/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/touint/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/touint/
menu:
  flux_0_x_ref:
    name: toUInt
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
related:
  - /flux/v0.x/data-types/basic/uinteger/
  - /flux/v0.x/stdlib/universe/uint/
introduced: 0.7.0
---

The `toUInt()` function converts all values in the `_value` column to UIntegers.

```js
toUInt()
```

{{% note %}}
To convert values in a column other than `_value`, define a custom function
patterned after the [function definition](#function-definition),
but replace `_value` with your desired column.
{{% /note %}}

##### Supported data types

- bool
- duration
- float
- int
- string (numeric)
- time

`toInt()` behavior depends on the `_value` column data type:

| \_value type | Returned value                                                  |
| :----------- | :-------------------------------------------------------------- |
| bool         | 1 (true) or 0 (false)                                           |
| duration     | Number of nanoseconds in the specified duration                 |
| float        | UInteger equivalent of the float value truncated at the decimal |
| int          | UInteger equivalent of the integer                              |
| string       | UInteger equivalent of the numeric string                       |
| time         | Equivalent nanosecond epoch timestamp                           |

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Convert a float value column to a uinteger column](#convert-a-float-value-column-to-a-uinteger-column)
- [Convert a boolean value column to a uinteger column](#convert-a-boolean-value-column-to-a-uinteger-column)
- [Convert a uinteger value column to a integer column](#convert-a-uinteger-value-column-to-a-integer-column)

#### Convert a float value column to a uinteger column
```js
import "sampledata"

sampledata.float()
  |> toUInt()
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
{{% flux/sample "uint" %}}

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Convert a boolean value column to a uinteger column
```js
import "sampledata"

sampledata.bool()
  |> toUInt()
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

#### Convert a uinteger value column to a integer column
```js
import "sampledata"

sampledata.uint()
  |> toUInt()
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
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
toUInt = (tables=<-) => tables
  |> map(fn:(r) => ({ r with _value: uint(v:r._value) }))
```
