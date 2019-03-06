---
title: Transform data with mathematic operations
seotitle: Transform data with mathematic operations in Flux
description: This guide walks through using Flux to transform data with mathematic operations.
v2.0/tags: [math, flux]
menu:
  v2_0:
    name: Transform data with math
    parent: How-to guides
weight: 209
---

[Flux](/v2.0/reference/flux), InfluxData's data scripting and query language,
supports mathematic expressions in data transformations.
This article walks through using [Flux arithmetic operators](/v2.0/reference/flux/language/operators/#arithmetic-operator)
to map over input data and transform values using mathematic operations.

##### Basic mathematic operation examples
```js
// Examples executed using the Flux REPL
> 9 + 9
18
> 22 - 14
8
> 6 * 5
30
> 21 / 7
3
```

<p style="font-size:.85rem;font-style:italic;margin-top:-2rem;">See the <a href="/v2.0/reference/cli/influx/repl">Flux read-eval-print-loop (REPL)</a> documentation.</p>

{{% note %}}
#### Operands must be of the same type
Operands in Flux mathematic operations must be of the same data type.
For example, integers cannot be used in operations with floats.
Doing so will result in an error similar to:

```
Error: type error: float != int
```

This can be solved with [type-conversion functions](/v2.0/reference/flux/functions/built-in/transformations/type-conversions/)
or by formatting hard-coded operands differently.
The output type is determined by the operand type.
For example:

```js
100 // Parsed as an integer
100.0 // Parsed as a float

// Example evaluations
> 20 / 8
2

> 20.0 / 8.0
2.5
```
{{% /note %}}

## Custom mathematic functions
Flux’s functional syntax lets you [create custom functions](/v2.0/query-data/guides/custom-functions).
The examples below illustrate custom function definitions that use mathematic operations to transform input data.

###### Custom multiplication function
```js
multiply = (x, y) => x * y

multiply(x: 10, y: 12)
// Returns 120
```

###### Custom percentage function
```js
percent = (sample, total) => (sample / total) * 100.0

percent(sample: 20.0, total: 80.0)
// Returns 25
```

### Transform values in a data stream
The examples above illustrate transforming single values with mathematic operations,
but it is more common to transform multiple values within an input stream.
To do this, your custom function must [handle piped-forward data](/v2.0/query-data/guides/custom-functions/#functions-that-manipulate-piped-forward-data)"
and iterate over each row using the [`map()` function](/v2.0/reference/flux/functions/built-in/transformations/map).

The example `multiplyByX()` function below includes a `tables` parameter that represents the input data
stream (`<-`) and a required `x` parameter which is the number by which values in the `_value` column are multiplied.
It uses the `map()` function to iterate over each row in the input stream,
defines the `_time` column of the output stream using the value of the `_time` column in the input stream,
and transforms the value of the `_value` column by multiplying it by `x`.

```js
mutliplyByX = (x, tables=<-) =>
  tables
    |> map(fn: (r) => ({
        _time: r._time,
        _value: r._value * x
      })
    )

data
  |> multiplyByX(x: 10)
```

## Examples

### Convert bytes to gigabytes
The following Flux query calculates the amount of active memory in gigabytes (GB).
The `active` field in the `mem` measurement is recorded in bytes.
To calculate GBs, divide it by 1,073,741,824.

The `map()` function iterates over each row in the piped-forward data and defines
a new `_value` by dividing the original `_value` by 1073741824.

```js
from(bucket: "default")
  |> range(start: -10m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "active"
  )
  |> map(fn: (r) => ({
        _time: r._time,
        _value: r._value / 1073741824
      })
    )
```

You could turn that same calculation into a function:

```js
bytesToGB = (tables=<-) =>
  tables
    |> map(fn: (r) => ({
        _time: r._time,
        _value: r._value / 1073741824
      })
    )

data
  |> bytesToGB()
```

#### Include partial gigabytes
Because the original metric (bytes) is an integer, the output of the operation is an integer and does not include partial GBs.
To calculate partial GBs, convert the `_value` column and its values to floats using the
[`float()` function](/v2.0/reference/flux/functions/built-in/transformations/type-conversions/float)
and format the denominator in the division operation as a float.

```js
bytesToGB = (tables=<-) =>
  tables
    |> map(fn: (r) => ({
        _time: r._time,
        _value: float(v: r._value) / 1073741824.0
      })
    )
```

### Calculate a percentage
Calculate percentages using simple division operations.
Multiply the result by 100 for a true percentage.

{{% note %}}
Operands in percentage calculations should always be floats.
{{% /note %}}

```js
> 1.0 / 4.0 * 100.0
25.0
```

#### User vs system CPU usage
The example below calculates the percentage of total CPU used by the `user` vs the `system`.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Comments](#)
[No Comments](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```js
// Custom function that converts usage_user and
// usage_system columns to floats
usageToFloat = (tables=<-) =>
  tables
    |> map(fn: (r) => ({
      _time: r._time,
      usage_user: float(v: r.usage_user),
      usage_system: float(v: r.usage_system)
      })
    )

// Define the data source and filter user and system CPU usage
// from 'cpu-total' in the 'cpu' measurement
from(bucket: "default")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_user" or
    r._field == "usage_system" and
    r.cpu == "cpu-total"
  )

  // Pivot the output tables so usage_user and usage_system are in each row
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")

  // Convert usage_user and usage_system to floats
  |> usageToFloat()

  // Map over each row and calculate the percentage of
  // CPU used by the user vs the system
  |> map(fn: (r) => ({
      _time: r._time,
      usage_user: r.usage_user / (r.usage_user + r.usage_system) * 100.0,
      usage_system: r.usage_system / (r.usage_user +  r.usage_system) * 100.0
    })
  )
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
usageToFloat = (tables=<-) =>
  tables
    |> map(fn: (r) => ({
      _time: r._time,
      usage_user: float(v: r.usage_user),
      usage_system: float(v: r.usage_system)
      })
    )

from(bucket: "default")
  |> range(start: timeRangeStart, stop: timeRangeStop)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_user" or
    r._field == "usage_system" and
    r.cpu == "cpu-total"
  )
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> usageToFloat()
  |> map(fn: (r) => ({
      _time: r._time,
      usage_user: r.usage_user / (r.usage_user + r.usage_system) * 100.0,
      usage_system: r.usage_system / (r.usage_user +  r.usage_system) * 100.0
    })
  )
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
