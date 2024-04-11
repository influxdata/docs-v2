---
title: strings.isUpper() function
description: >
  `strings.isUpper()` tests if a single character string is uppercase.
menu:
  flux_v0_ref:
    name: strings.isUpper
    parent: strings
    identifier: strings/isUpper
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L606-L606

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.isUpper()` tests if a single character string is uppercase.



##### Function type signature

```js
(v: string) => bool
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
Single-character string value to test.




## Examples

### Filter by columns with single-letter uppercase values

```js
import "strings"

data
    |> filter(fn: (r) => strings.isUpper(v: r._value))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2022-01-01T00:00:00Z | t1   | a       |
| 2022-01-01T00:01:00Z | t1   | B       |
| 2022-01-01T00:02:00Z | t1   | C       |
| 2022-01-01T00:03:00Z | t1   | d       |
| 2022-01-01T00:04:00Z | t1   | e       |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2022-01-01T00:00:00Z | t2   | F       |
| 2022-01-01T00:01:00Z | t2   | g       |
| 2022-01-01T00:02:00Z | t2   | H       |
| 2022-01-01T00:03:00Z | t2   | i       |
| 2022-01-01T00:04:00Z | t2   | J       |


#### Output data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2022-01-01T00:01:00Z | t1   | B       |
| 2022-01-01T00:02:00Z | t1   | C       |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2022-01-01T00:00:00Z | t2   | F       |
| 2022-01-01T00:02:00Z | t2   | H       |
| 2022-01-01T00:04:00Z | t2   | J       |

{{% /expand %}}
{{< /expand-wrapper >}}
