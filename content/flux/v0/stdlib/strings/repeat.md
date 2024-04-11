---
title: strings.repeat() function
description: >
  `strings.repeat()` returns a string consisting of `i` copies of a specified string.
menu:
  flux_v0_ref:
    name: strings.repeat
    parent: strings
    identifier: strings/repeat
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L629-L629

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.repeat()` returns a string consisting of `i` copies of a specified string.



##### Function type signature

```js
(i: int, v: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
String value to repeat.



### i
({{< req >}})
Number of times to repeat `v`.




## Examples

### Repeat a string based on existing columns

```js
import "strings"

data
    |> map(fn: (r) => ({r with _value: strings.repeat(v: "ha", i: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 1       | t1   |
| 2021-01-01T00:00:10Z | 5       | t1   |
| 2021-01-01T00:00:20Z | 3       | t1   |
| 2021-01-01T00:00:30Z | 8       | t1   |
| 2021-01-01T00:00:40Z | 7       | t1   |
| 2021-01-01T00:00:50Z | 2       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 9       | t2   |
| 2021-01-01T00:00:10Z | 2       | t2   |
| 2021-01-01T00:00:20Z | 1       | t2   |
| 2021-01-01T00:00:30Z | 9       | t2   |
| 2021-01-01T00:00:40Z | 6       | t2   |
| 2021-01-01T00:00:50Z | 0       | t2   |


#### Output data

| _time                | _value           | *tag |
| -------------------- | ---------------- | ---- |
| 2021-01-01T00:00:00Z | ha               | t1   |
| 2021-01-01T00:00:10Z | hahahahaha       | t1   |
| 2021-01-01T00:00:20Z | hahaha           | t1   |
| 2021-01-01T00:00:30Z | hahahahahahahaha | t1   |
| 2021-01-01T00:00:40Z | hahahahahahaha   | t1   |
| 2021-01-01T00:00:50Z | haha             | t1   |

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | hahahahahahahahaha | t2   |
| 2021-01-01T00:00:10Z | haha               | t2   |
| 2021-01-01T00:00:20Z | ha                 | t2   |
| 2021-01-01T00:00:30Z | hahahahahahahahaha | t2   |
| 2021-01-01T00:00:40Z | hahahahahaha       | t2   |
| 2021-01-01T00:00:50Z |                    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
