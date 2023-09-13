---
title: strings.isLetter() function
description: >
  `strings.isLetter()` tests if a single character string is a letter (a-z, A-Z).
menu:
  flux_v0_ref:
    name: strings.isLetter
    parent: strings
    identifier: strings/isLetter
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L538-L538

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.isLetter()` tests if a single character string is a letter (a-z, A-Z).



##### Function type signature

```js
(v: string) => bool
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Single-character string to test.




## Examples

### Filter by columns with digits as values

```js
import "strings"

data
    |> filter(fn: (r) => strings.isLetter(v: r._value))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | s       | t1   |
| 2021-01-01T00:00:10Z | n       | t1   |
| 2021-01-01T00:00:20Z | 4       | t1   |
| 2021-01-01T00:00:30Z | 4       | t1   |
| 2021-01-01T00:00:40Z | e       | t1   |
| 2021-01-01T00:00:50Z | y       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | a       | t2   |
| 2021-01-01T00:00:10Z | p       | t2   |
| 2021-01-01T00:00:20Z | 4       | t2   |
| 2021-01-01T00:00:30Z | t       | t2   |
| 2021-01-01T00:00:40Z | 7       | t2   |
| 2021-01-01T00:00:50Z | v       | t2   |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | s       | t1   |
| 2021-01-01T00:00:10Z | n       | t1   |
| 2021-01-01T00:00:40Z | e       | t1   |
| 2021-01-01T00:00:50Z | y       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | a       | t2   |
| 2021-01-01T00:00:10Z | p       | t2   |
| 2021-01-01T00:00:30Z | t       | t2   |
| 2021-01-01T00:00:50Z | v       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
