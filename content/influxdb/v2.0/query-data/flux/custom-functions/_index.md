---
title: Create custom Flux functions
description: Create your own custom Flux functions to transform and manipulate data.
list_title: Custom functions
influxdb/v2.0/tags: [functions, custom, flux]
menu:
  influxdb_2_0:
    name: Custom functions
    parent: Query with Flux
weight: 220
aliases:
  - /influxdb/v2.0/query-data/guides/custom-functions/
list_code_example: |
  ```js
  multByX = (tables=<-, x) =>
    tables
      |> map(fn: (r) => ({ r with _value: r._value * x}))

  data
    |> multByX(x: 2.0)
  ```
---

Flux's functional syntax allows for custom functions.
This guide walks through the basics of creating your own function.

- [Function definition structure](#function-definition-structure)
- [Functions that use piped-forward data](#functions-that-use-piped-forward-data)
- [Define parameter defaults](#define-parameter-defaults)
- [Define functions with scoped variables](#define-functions-with-scoped-variables)

## Function definition structure
The basic structure for defining functions in Flux is as follows:

```js
// Basic function definition structure
functionName = (functionParameters) => functionOperations
```

##### functionName
The name used to call the function in your Flux script.  

##### functionParameters
A comma-separated list of parameters passed into the function and used in its operations.
[Parameter defaults](#define-parameter-defaults) can be defined for each.  

##### functionOperations
Operations and functions that manipulate the input into the desired output.

#### Basic function examples

###### Example square function
```js
// Function definition
square = (n) => n * n

// Function usage
> square(n:3)
9
```

###### Example multiply function
```js
// Function definition
multiply = (x, y) => x * y

// Function usage
> multiply(x:2, y:15)
30
```

## Functions that use piped-forward data
Most Flux functions manipulate data piped-forward into the function.
In order for a custom function to process piped-forward data, one of the function
parameters must capture the input tables using the `<-` pipe-receive expression.

In the example below, the `tables` parameter is assigned to the `<-` expression,
which represents all data piped-forward into the function.
`tables` is then piped-forward into other operations in the function definition.

```js
functionName = (tables=<-) => tables |> functionOperations
```

#### Pipe-forwardable function example

###### Multiply row values by x
The example below defines a `multByX` function that multiplies the `_value` column
of each row in the input table by the `x` parameter.
It uses the [`map()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map)
to modify each `_value`.

```js
// Function definition
multByX = (tables=<-, x) =>
  tables
    |> map(fn: (r) => ({ r with _value: r._value * x}))

// Function usage
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> multByX(x:2.0)
```

## Define parameter defaults
Use the `=` assignment operator to assign a default value to function parameters
in your function definition:

```js
functionName = (param1=defaultValue1, param2=defaultValue2) => functionOperation
```

Defaults are overridden by explicitly defining the parameter in the function call.

### Example functions with defaults

#### Get the winner or the "winner"
The example below defines a `getWinner` function that returns the record with the highest
or lowest `_value` (winner versus "winner") depending on the `noSarcasm` parameter which defaults to `true`.
It uses the [`sort()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/sort)
to sort records in either descending or ascending order.
It then uses the [`limit()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/limit)
to return the first record from the sorted table.

```js
// Function definition
getWinner = (tables=<-, noSarcasm:true) =>
  tables
    |> sort(desc: noSarcasm)
    |> limit(n:1)

// Function usage
// Get the winner
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> getWinner()

// Get the "winner"
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> getWinner(noSarcasm: false)
```

## Define functions with scoped variables
To create custom functions with variables scoped to the function, place your
function operations and variables in a [block (`{}`)](/influxdb/v2.0/reference/flux/language/blocks/)
and use a `return` statement to return a specific variable.

```js
functionName = (functionParameters) => {
  exampleVar = "foo"
  return exampleVar
}
```

### Example functions with scoped variables

- [Return an alert level based on a value](#return-an-alert-level-based-on-a-value)
- [Convert a HEX color code to a name](#convert-a-hex-color-code-to-a-name)

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

