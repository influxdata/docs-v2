---
title: Flux syntax basics
description: An introduction to the basic elements of the Flux syntax with real-world application examples.
influxdb/v2.0/tags: [flux, syntax]
menu:
  influxdb_2_0:
    name: Syntax basics
    parent: Get started with Flux
weight: 203
related:
  - /{{< latest "flux" >}}/language/types/
---


Flux, at its core, is a scripting language designed specifically for working with data.
This guide walks through a handful of simple expressions and how they are handled in Flux.

## Use the Flux REPL
Use the [Flux REPL](/influxdb/v2.0/tools/repl/) to open the interactive Read-Eval-Print Loop (REPL).
Run the commands provided in this guide in the REPL.

##### Start the Flux REPL
```bash
./flux repl
```

## Basic Flux syntax
The code blocks below provide commands that illustrate the basic syntax of Flux.
Run these commands in the REPL.

### Simple expressions
Flux is a scripting language that supports basic expressions.
For example, simple addition:

```js
> 1 + 1
2
```

### Variables
Assign an expression to a variable using the assignment operator, `=`.

```js
> s = "this is a string"
> i = 1 // an integer
> f = 2.0 // a floating point number
```

Type the name of a variable to print its value:

```js
> s
this is a string
> i
1
> f
2
```

### Records
Flux also supports records, collections of key-value pairs.
Each key must be a string.
Values can be a different data types.

```js
> o = {name:"Jim", age: 42, "favorite color": "red"}
```

Use **dot notation** to access a properties of a record:

```js
> o.name
Jim
> o.age
42
```

Or **bracket notation**:

```js
> o["name"]
Jim
> o["age"]
42
> o["favorite color"]
red
```

{{% note %}}
Use bracket notation to reference record properties with special or
white space characters in the property key.
{{% /note %}}

### Arrays
Flux supports arrays. All values in an array must be the same type.

```js
> n = 4
> l = [1,2,3,n]
> l
[1, 2, 3, 4]
```

Use **bracket notation** to access a value at a specific index in an array:

```js
> a = ["foo","bar","baz","quz"]
> a[0]
foo
```

### Dictionaries
Flux supports dictionaries, collections of key value pairs where keys can be any type,
but all keys must be the same type.
All values in a dictionary must be the same type.

```js
> d = [1: "foo", 2: "bar"]
```

Use the [`dict.get()` function](/influxdb/v2.0/reference/flux/stdlib/dict/get/)
to access properties in a dictionary:

```js
> import "dict"
> dict.get(dict: d, key: "1", default: "")
foo
```

### Functions
Flux uses functions for most of its heavy lifting.
Below is a simple function that squares a number, `n`.

```js
> square = (n) => n * n
> square(n:3)
9
```

{{% note %}}
Flux does not support positional arguments or parameters.
Parameters must always be named when calling a function.
{{% /note %}}

### Pipe-forward operator
Flux uses the pipe-forward operator (`|>`) extensively to chain operations together.
After each function or operation, Flux returns a table or collection of tables containing data.
The pipe-forward operator pipes those tables into the next function where they are further processed or manipulated.

```js
data |> someFunction() |> anotherFunction()
```

## Real-world application of basic syntax
This likely seems familiar if you've already been through through the other
[getting started guides](/influxdb/v2.0/query-data/get-started).
Flux's syntax is inspired by Javascript and other functional scripting languages.
As you begin to apply these basic principles in real-world use cases such as creating data stream variables,
custom functions, etc., the power of Flux and its ability to query and process data will become apparent.

The examples below provide both multi-line and single-line versions of each input command.
Carriage returns in Flux aren't necessary, but do help with readability.
Both single- and multi-line commands can be copied and pasted into the `influx` CLI running in Flux mode.

### Define data stream variables
A common use case for variable assignments in Flux is creating variables for one
or more input data streams.

{{< code-tabs-wrapper >}}
  {{% code-tabs %}}
  [Multi-line](#)
  [Single-line](#)
  {{% /code-tabs %}}
{{% code-tab-content %}}
```js
timeRange = -1h

cpuUsageUser =
  from(bucket:"example-bucket")
    |> range(start: timeRange)
    |> filter(fn: (r) =>
      r._measurement == "cpu" and
      r._field == "usage_user" and
      r.cpu == "cpu-total"
    )

memUsagePercent =
  from(bucket:"example-bucket")
    |> range(start: timeRange)
    |> filter(fn: (r) =>
      r._measurement == "mem" and
      r._field == "used_percent"
    )
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
timeRange = -1h
cpuUsageUser = from(bucket:"example-bucket") |> range(start: timeRange) |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_user" and r.cpu == "cpu-total")
memUsagePercent = from(bucket:"example-bucket") |> range(start: timeRange) |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent")
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper>}}

These variables can be used in other functions, such as  `join()`, while keeping the syntax minimal and flexible.

### Define custom functions
Create a function that returns the `N` number rows in the input stream with the highest `_value`s.
To do this, pass the input stream (`tables`) and the number of results to return (`n`) into a custom function.
Then using Flux's `sort()` and `limit()` functions to find the top `n` results in the data set.

{{< code-tabs-wrapper >}}
  {{% code-tabs %}}
  [Multi-line](#)
  [Single-line](#)
  {{% /code-tabs %}}
{{% code-tab-content %}}
```js
topN = (tables=<-, n) =>
  tables
    |> sort(desc: true)
    |> limit(n: n)
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
topN = (tables=<-, n) => tables |> sort(desc: true) |> limit(n: n)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Using this new custom function `topN` and the `cpuUsageUser` data stream variable defined above,
we can find the top five data points and yield the results.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Multi-line](#)
[Single-line](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```js
cpuUsageUser
  |> topN(n:5)
  |> yield()
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
cpuUsageUser |> topN(n:5) |> yield()
```
{{% /code-tab-content %}}

{{< /code-tabs-wrapper>}}

This query will return the five data points with the highest user CPU usage over the last hour.

_More information about creating custom functions is available in the [Custom functions](/influxdb/v2.0/query-data/flux/custom-functions) documentation._

{{< page-nav prev="/influxdb/v2.0/query-data/get-started/transform-data/" >}}
