---
title: Define custom functions
seotitle: Define custom Flux functions
list_title: Define functions
description: >
  Flux's functional syntax lets you define custom functions.
  Learn the basics of creating your own functions.
menu:
  flux_0_x:
    name: Define functions
weight: 6
related:
  - /flux/v0.x/data-types/composite/function/
---

Flux's functional syntax lets you define custom functions.
Learn the basics of creating your own functions.

###### On this page:

- [Function definition syntax](#function-definition-syntax)
- [Custom function examples](#custom-function-examples)
- [Create a custom transformation](#create-a-custom-transformation)
  - [Custom transformation examples](#custom-transformation-examples)
- [Define functions with scoped variables](#define-functions-with-scoped-variables)
  - [Example functions with scoped variables](#example-functions-with-scoped-variables)

## Function definition syntax
The basic syntax for defining functions in Flux is as follows:

```js
// Basic function definition syntax
functionName = (functionParameters) => functionBody
```

- **functionName**: Name to use to execute the function.
- **functionParameters**: Comma-separated list of parameters passed into the function.
- **functionBody**: Operations on function parameters.

### Define parameter defaults
Use the `=` assignment operator to assign a default value to function parameters
in your function definition:

```js
functionName = (param1=defaultVal1, param2=defaultVal2) => functionBody
```

Defaults are overridden by explicitly defining the parameter in the function call.
Parameters without default values are considered **required parameters**.

## Custom function examples

{{< expand-wrapper >}}
{{% expand "Square a number" %}}
```js
square = (n) => n * n

square(n:3)
// Returns 9
```
{{% /expand %}}
{{% expand "Multiple two values" %}}
```js
multiply = (x, y) => x * y

multiply(x: 2, y: 15)
// Returns 30
```
{{% /expand %}}
{{% expand "Calculate n to the p power (with default parameters)" %}}
```js
pow = (n, p=10) => n ^ p

pow(n: 2)
// Returns 1024
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Create a custom transformation
A [transformation](/flux/v0.x/function-types/#transformations) is a function that
takes a [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables)
as input, operates on the input, and then outputs a new stream of tables.

The [pipe-forward operator](/flux/v0.x/get-started/query-basics/#pipe-forward-operator) (`|>`)
pipes data from the previous identifier or function forward into a transformation.
To use piped-forward data, assign a function parameter to the 
[pipe-receive operator](/flux/v0.x/spec/operators/#function-operators) (`<-`).

In the following example, the function `x()` receives piped-forwarded data and assigns it to the `t` parameter.
In the function body, `t` is piped forward into other operations to generate output.

```js
x = (t=<-) => t |> //...
```

### Custom transformation examples

{{< expand-wrapper >}}
{{% expand "Multiply values by x" %}}
#### Multiply values by x
The following example defines a `multByX` function that multiplies the `_value` column
of each input row by the `x` parameter.
The example uses the [`map()` function](/flux/v0.x/stdlib/universe/map/) to iterate over
each row, modify the `_value`, and then return the updated row.

##### Function definition
```js
multByX = (tables=<-, x) =>
  tables
    |> map(fn: (r) => ({ r with _value: r._value * x }))
```

##### Example usage 
```js
data
  |> multByX(x: 2.0)
```

{{< flex >}}
{{% flex-content %}}
###### Given the following input data:

| srcID | _field | _value |
| :---- | :----- | -----: |
| t1a   | foo    |    1.2 |
| t1a   | foo    |    3.4 |
| t1a   | foo    |    5.6 |

| srcID | _field | _value |
| :---- | :----- | -----: |
| t2b   | foo    |    0.8 |
| t2b   | foo    |    1.9 |
| t2b   | foo    |    2.7 |
{{% /flex-content %}}
{{% flex-content %}}
###### The example above returns:

| srcID | _field | _value |
| :---- | :----- | -----: |
| t1a   | foo    |    2.4 |
| t1a   | foo    |    6.8 |
| t1a   | foo    |   11.2 |

| srcID | _field | _value |
| :---- | :----- | -----: |
| t2b   | foo    |    1.6 |
| t2b   | foo    |    3.8 |
| t2b   | foo    |    5.4 |
{{% /flex-content %}}
{{< /flex >}}

{{% /expand %}}
{{% expand "Calculate speed" %}}
#### Calculate speed
The following example defines a `speed` function that calculates speed using an
`elapsed` and `distance` column in input tables.
The example uses the [`map()` function](/flux/v0.x/stdlib/universe/map/) to iterate over
each row, calculate the speed per specified unit of distance, and then return
the updated row with a new `speed` column.

##### Function definition
```js
speed = (tables=<-, unit="m") =>
  tables
    |> map(fn: (r) => {
      elapsedHours = float(v: int(v: duration(v: r.elapsed))) / float(v: int(v: 1h))
      distance = float(v: r.distance)
      speed = distance / elapsedHours
      
      return { r with speed: "${speed} ${unit}ph" }
    })
```

##### Example usage
```js
data
  |> speed()
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input data:

| id  | elapsed | distance |
| :-- | ------: | -------: |
| t1  |   1h15m |      101 |
| t2  |   1h32m |      138 |
| t3  |     56m |      112 |
{{% /flex-content %}}
{{% flex-content %}}
##### The example above returns:

| id  | elapsed | distance |    speed |
| :-- | ------: | -------: | -------: |
| t1  |   1h15m |      101 | 88.8 mph |
| t2  |   1h32m |      138 |   90 mph |
| t3  |     56m |      112 |  120 mph |
{{% /flex-content %}}
{{< /flex >}}

{{% /expand %}}
{{< /expand-wrapper >}}


## Define functions with scoped variables
To create custom functions with variables scoped to the function,

1. Enclose your [function body](#function-definition-syntax) in a
   [block (`{}`)](/influxdb/v2.0/reference/flux/language/blocks/).
2. Use a `return` statement to return a specific variable.

```js
functionName = (param) => {
  exampleVar = "foo"

  return exampleVar
}
```

### Example functions with scoped variables

{{< expand-wrapper >}}
{{% expand "Return an alert level based on a value" %}}

#### Return an alert level based on a value
The following function uses conditional logic to return an alert level based on
a numeric input value:

```js
alertLevel = (v) => {
  level = if float(v:v) >= 90.0 then "crit"
          else if float(v:v) >= 80.0 then "warn"
          else if float(v:v) >= 65.0 then "info"
          else "ok"
  
  return level
}

alertLevel(v: 87.3)
// Returns "warn"
```
{{% /expand %}}

{{% expand "Convert a HEX color code to a name" %}}
#### Convert a HEX color code to a name
The following function converts a hexadecimal (HEX) color code to the equivalent HTML color name.
The functions uses the [Flux dictionary package](/influxdb/v2.0/reference/flux/stdlib/dict/)
to create a dictionary of HEX codes and their corresponding names.

```js
import "dict"

hexName = (hex) => {
  hexNames = dict.fromList(pairs: [
    {key: "#00ffff", value: "Aqua"},
    {key: "#000000", value: "Black"},
    {key: "#0000ff", value: "Blue"},
    {key: "#ff00ff", value: "Fuchsia"},
    {key: "#808080", value: "Gray"},
    {key: "#008000", value: "Green"},
    {key: "#00ff00", value: "Lime"},
    {key: "#800000", value: "Maroon"},
    {key: "#000080", value: "Navy"},
    {key: "#808000", value: "Olive"},
    {key: "#800080", value: "Purple"},
    {key: "#ff0000", value: "Red"},
    {key: "#c0c0c0", value: "Silver"},
    {key: "#008080", value: "Teal"},
    {key: "#ffffff", value: "White"},
    {key: "#ffff00", value: "Yellow"},
  ])  
  name = dict.get(dict: hexNames, key: hex, default: "No known name")
  
  return name
}

hexName(hex: "#000000")
// Returns "Black"

hexName(hex: "#8b8b8b")
// Returns "No known name"
```
{{% /expand %}}
{{< /expand-wrapper >}}
