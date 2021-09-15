---
title: Flux syntax basics
description: >
  Learn the basic elements of Flux syntax with examples from real-world applications.
menu:
  flux_0_x:
    name: Syntax basics
    parent: Get started
weight: 102
---

Flux, at its core, is a scripting language designed specifically for working with data.
This guide walks through how Flux handles a few simple expressions.

###### On this page
- [Pipe-forward operator](#pipe-forward-operator)
- [Simple expressions](#simple-expressions)
- [Predicate expressions](#predicate-expressions)
- [Variables](#variables)
- [Data types](#data-types)
  - [Basic types](#basic-types)
  - [Composite Types](#composite-types)
    - [Records](#records)
    - [Arrays](#arrays)
    - [Dictionaries](#dictionaries)
    - [Functions](#functions)
  - [Regular expression types](#regular-expression-types)
- [Packages](#packages)
- [Examples of basic syntax](#examples-of-basic-syntax)
  - [Define data stream variables](#define-data-stream-variables)
  - [Define custom functions](#define-custom-functions)

## Pipe-forward operator
The **pipe-forward operator** (`|>`) sends the output of one function as input to the next function.
In the [water treatment metaphor](/flux/v0.x/get-started/#flux-overview),
the pipe-forward operator is the pipe that carries water (or data) through the pipeline.

```js
data
  |> someFunction()
  |> anotherFunction()
```

## Simple expressions
Flux supports basic expressions.
For example:

```js
1 + 1
// Returns 2

10 * 3
// Returns 30

(12.0 + 18.0) / (2.0 ^ 2.0) + (240.0 % 55.0)
// Returns 27.5

"John " + "Doe " + "is here!"
// Returns John Doe is here!
```

_For information about operator precedence, see
[Flux Operators – Operator precedence](/flux/v0.x/spec/operators/#operator-precedence)._

## Predicate expressions
A predicate expression compares values using [comparison operators](/flux/v0.x/spec/operators/#comparison-operators), [logical operators](/flux/v0.x/spec/operators/#logical-operators), or both, and evalutes as `true` or `false`. 
For example:

```js
"John" == "John"
// Returns true

41 < 30
// Returns false

"John" == "John" and 41 < 30
// Returns false

"John" == "John" or 41 < 30
// Returns true
```

Flux uses predicate expressions when [filtering data](/flux/v0.x/get-started/query-basics/#filter)
or in [conditional expressions](/flux/v0.x/spec/expressions/#conditional-expressions).

## Variables
Assign an expression to a variable using the
[assignment operator (`=`)](/flux/v0.x/spec/operators/#assignment-operators).
Use the name (identifier) of a variable to return its value:

```js
s = "foo" // string
i = 1 // integer
f = 2.0 // float (floating point number)

s // Returns foo
i // Returns 1
f // Returns 2.0
```

Variables can be assigned to any [Flux data type](/flux/v0.x/data-types/).

## Data types
Flux supports many data types grouped into the following categories:

- [Basic types](#basic-types)
- [Composite types](#composite-types)
- [Regular expression types](#regular-expression-types)

### Basic types
The following basic types can be represented with literal values:

- [Boolean](/flux/v0.x/data-types/basic/bool/)
- [Duration](/flux/v0.x/data-types/basic/duration/)
- [String](/flux/v0.x/data-types/basic/string/)
- [Time](/flux/v0.x/data-types/basic/time/)
- [Float](/flux/v0.x/data-types/basic/float/)
- [Integer](/flux/v0.x/data-types/basic/int/)

```js
// Boolean
true

// Duration
23h4m5s

// String
"foo"

// Time
2021-01-01T00:00:00Z

// Float
1.0

// Integer
1
```

The following basic types do not have a literal syntax, but can be created in other ways:

- [Bytes](/flux/v0.x/data-types/basic/bytes/)
- [Unsigned integers](/flux/v0.x/data-types/basic/uint/)
- [Nulls](/flux/v0.x/data-types/basic/null/)

### Composite Types
Flux [composite types](/flux/v0.x/data-types/composite/) are constructed from
Flux [basic types](#basic-types).

- [Records](#records)
- [Arrays](#arrays)
- [Dictionaries](#dictionaries)
- [Functions](#functions)

#### Records
A **record** is a collections of key-value pairs.
Each key is a string.
Each value can be a different data type.

```js
{name:"Jim", age: 42, "favorite color": "red"}
```

Use **dot notation** or **bracket notation** to access a properties of a record:

{{% note %}}
Use bracket notation to reference record properties with special or
white space characters in the property key.
{{% /note %}}

```js
o = {name:"Jim", age: 42, "favorite color": "red"}

o.name
// Returns Jim

o.age
// Returns 42

o["favorite color"]
// Returns red
```

_For more information, see [Work with records](/flux/v0.x/data-types/composite/record/)._

#### Arrays
An **array** is a collection of values of the same type.

```js
n = 4
l = [1,2,3,n]

l
// Returns [1, 2, 3, 4]
```

Use **bracket notation** to access a value at a specific index in an array:

```js
a = ["foo","bar","baz","quz"]

a[0]
// Returns foo
```

_For more information, see [Work with arrays](/flux/v0.x/data-types/composite/array/)._

#### Dictionaries
A **dictionary** is a collection of key-value pairs with keys of the same type
and values of the same type.

```js
[1: "foo", 2: "bar"]
```

Use [`dict.get()`](/flux/v0.x/stdlib/dict/get/) to access elements in a dictionary:

```js
import "dict"

d = [1: "foo", 2: "bar"]

dict.get(dict: d, key: "1", default: "")
// Returns foo
```

_For more information, see [Work with dictionaries](/flux/v0.x/data-types/composite/dict/)._

#### Functions
A **function** is a block of code that uses a set of parameters to perform an operation.
Functions can be named or anonymous.
Define parameters in parentheses (`()`) and pass parameters into an operation
with the [arrow operator (`=>`)](/flux/v0.x/spec/operators/#function-operators).

```js
square = (n) => n * n

square(n:3)
// Returns 9
```

{{% note %}}
Flux does not support positional parameters.
Parameters must always be named when calling a function.
{{% /note %}}

##### Predicate functions
Predicate functions use [predicate expressions](#predicate-expressions) to evaluate
input and return `true` or `false`. For example:

```js
examplePredicate = (v) => v == "foo"

examplePredicate(v: "foo")
// Returns true

examplePredicate(v: "bar")
// Returns false
```

For more information about working with functions, see:

- [Work with functions](/flux/v0.x/data-types/composite/function/)
- [Define custom functions](/flux/v0.x/define-functions/)

### Regular expression types
A **regular expression** is a regular expression pattern used to evaluate strings.
Use regular expressions in [predicate expressions](#predicate-expressions) or with
the [`regexp` package](/flux/v0.x/stdlib/regexp/).

```js
regex = /^foo/

"foo" =~ regex
// Returns true

"bar" =~ regex
// Returns false
```

## Packages
The [Flux standard library](/flux/v0.x/stdlib/) is organized into [packages](/flux/v0.x/spec/packages/)
that contain functions and package-specific options.
The [universe package](/flux/v0.x/stdlib/universe/) is loaded by default.
To load other packages, include an import statement for each package at the
beginning of your Flux script.

```js
import "array"
import "math"
import "influxdata/influxdb/sample"
```

## Examples of basic syntax
After reading the sections above, you can begin to apply these basic principles in real-world
use cases such as creating data stream variables, custom functions, and more.

- [Define data stream variables](#define-data-stream-variables)
- [Define custom functions](#define-custom-functions)

### Define data stream variables
A common use case for variable assignments in Flux is creating variables for one
or more input data streams.
The following example uses [`sample.data()`](/flux/v0.x/stdlib/influxdata/influxdb/sample/data/)
to query sample air sensor data and assigns different streams of data to unique variables.

```js
import "influxdata/influxdb/sample"

data = sample.data(set: "airSensor")
    |> range(start: -15m)
    |> filter(fn: (r) => r._measurement == "airSensors")

temperature =
  data
    |> filter(fn: (r) => r._field == "temperature")

humidity =
  data
    |> filter(fn: (r) => r._field == "humidity")
```

These variables can be used in other functions, such as  `join()`, while keeping
the syntax minimal and flexible.

### Define custom functions
Create a function that returns the `N` number rows with the highest values in the `_value` column.
Pass the input stream (`<-`) and the number of results to return (`n`) into a custom function.
Use [`sort()`](/flux/v0.x/stdlib/universe/sort/) and [`limit()`](/flux/v0.x/stdlib/universe/limit/)
to find the top `n` results in the data set.

```js
topN = (tables=<-, n) =>
  tables
    |> sort(desc: true)
    |> limit(n: n)
```

Use the custom function `topN` and the `humidity` data stream variable defined
above to return the top three data points in each input table.

```js
humidity
  |> topN(n:3)
```

_For more information about creating custom functions, see [Define custom functions](/flux/v0.x/define-functions)._

{{< page-nav prev="/flux/v0.x/get-started/data-model/" next="/flux/v0.x/get-started/query-basics/" >}}