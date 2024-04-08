---
title: hex.string() function
description: >
  `hex.string()` converts a Flux basic type to a hexadecimal string.
menu:
  flux_v0_ref:
    name: hex.string
    parent: contrib/bonitoo-io/hex
    identifier: contrib/bonitoo-io/hex/string
weight: 301

---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/hex/hex.flux#L131-L131

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`hex.string()` converts a Flux basic type to a hexadecimal string.

The function is similar to `string()`, but encodes int, uint, and bytes
types to hexadecimal lowercase characters.

##### Function type signature

```js
(v: A) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to convert.




## Examples

- [Convert integer to hexadecimal string](#convert-integer-to-hexadecimal-string)
- [Convert a boolean to a hexadecimal string value](#convert-a-boolean-to-a-hexadecimal-string-value)
- [Convert a duration to a hexadecimal string value](#convert-a-duration-to-a-hexadecimal-string-value)
- [Convert a time to a hexadecimal string value](#convert-a-time-to-a-hexadecimal-string-value)
- [Convert an integer to a hexadecimal string value](#convert-an-integer-to-a-hexadecimal-string-value)
- [Convert a uinteger to a hexadecimal string value](#convert-a-uinteger-to-a-hexadecimal-string-value)
- [Convert a float to a hexadecimal string value](#convert-a-float-to-a-hexadecimal-string-value)
- [Convert bytes to a hexadecimal string value](#convert-bytes-to-a-hexadecimal-string-value)
- [Convert all values in a column to hexadecimal string values](#convert-all-values-in-a-column-to-hexadecimal-string-values)

### Convert integer to hexadecimal string

```js
import "contrib/bonitoo-io/hex"

hex.string(v: 1234)// Returns 4d2


```


### Convert a boolean to a hexadecimal string value

```js
import "contrib/bonitoo-io/hex"

hex.string(v: true)// Returns "true"


```


### Convert a duration to a hexadecimal string value

```js
import "contrib/bonitoo-io/hex"

hex.string(v: 1m)// Returns "1m"


```


### Convert a time to a hexadecimal string value

```js
import "contrib/bonitoo-io/hex"

hex.string(v: 2021-01-01T00:00:00Z)// Returns "2021-01-01T00:00:00Z"


```


### Convert an integer to a hexadecimal string value

```js
import "contrib/bonitoo-io/hex"

hex.string(v: 1234)// Returns "4d2"


```


### Convert a uinteger to a hexadecimal string value

```js
import "contrib/bonitoo-io/hex"

hex.string(v: uint(v: 5678))// Returns "162e"


```


### Convert a float to a hexadecimal string value

```js
import "contrib/bonitoo-io/hex"

hex.string(v: 10.12)// Returns "10.12"


```


### Convert bytes to a hexadecimal string value

```js
import "contrib/bonitoo-io/hex"

hex.string(v: bytes(v: "Hello world!"))// Returns "48656c6c6f20776f726c6421"


```


### Convert all values in a column to hexadecimal string values

Use `map()` to iterate over and update all input rows.
Use `hex.string()` to update the value of a column.
The following example uses data provided by the sampledata package.

```js
import "sampledata"
import "contrib/bonitoo-io/hex"

data =
    sampledata.int()
        |> map(fn: (r) => ({r with _value: r._value * 1000}))

data
    |> map(fn: (r) => ({r with _value: hex.string(v: r.foo)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2000   | t1   |
| 2021-01-01T00:00:10Z | 10000   | t1   |
| 2021-01-01T00:00:20Z | 7000    | t1   |
| 2021-01-01T00:00:30Z | 17000   | t1   |
| 2021-01-01T00:00:40Z | 15000   | t1   |
| 2021-01-01T00:00:50Z | 4000    | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19000   | t2   |
| 2021-01-01T00:00:10Z | 4000    | t2   |
| 2021-01-01T00:00:20Z | -3000   | t2   |
| 2021-01-01T00:00:30Z | 19000   | t2   |
| 2021-01-01T00:00:40Z | 13000   | t2   |
| 2021-01-01T00:00:50Z | 1000    | t2   |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z |         | t1   |
| 2021-01-01T00:00:10Z |         | t1   |
| 2021-01-01T00:00:20Z |         | t1   |
| 2021-01-01T00:00:30Z |         | t1   |
| 2021-01-01T00:00:40Z |         | t1   |
| 2021-01-01T00:00:50Z |         | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z |         | t2   |
| 2021-01-01T00:00:10Z |         | t2   |
| 2021-01-01T00:00:20Z |         | t2   |
| 2021-01-01T00:00:30Z |         | t2   |
| 2021-01-01T00:00:40Z |         | t2   |
| 2021-01-01T00:00:50Z |         | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
