---
title: http.pathEscape() function
description: >
  `http.pathEscape()` escapes special characters in a string (including `/`)
  and replaces non-ASCII characters with hexadecimal representations (`%XX`).
menu:
  flux_v0_ref:
    name: http.pathEscape
    parent: http
    identifier: http/pathEscape
weight: 101

introduced: 0.71.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/http/http.flux#L114-L114

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`http.pathEscape()` escapes special characters in a string (including `/`)
and replaces non-ASCII characters with hexadecimal representations (`%XX`).



##### Function type signature

```js
(inputString: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### inputString
({{< req >}})
String to escape.




## Examples

- [URL-encode a string](#url-encode-a-string)
- [URL-encode strings in a stream of tables](#url-encode-strings-in-a-stream-of-tables)

### URL-encode a string

```js
import "http"

http.pathEscape(inputString: "Hello world!")// Returns "Hello%20world%21"


```


### URL-encode strings in a stream of tables

```js
import "http"
import "sampledata"

sampledata.string()
    |> map(fn: (r) => ({r with _value: http.pathEscape(inputString: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value      |
| -------------------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | t1   | smpl_g9qczs |
| 2021-01-01T00:00:10Z | t1   | smpl_0mgv9n |
| 2021-01-01T00:00:20Z | t1   | smpl_phw664 |
| 2021-01-01T00:00:30Z | t1   | smpl_guvzy4 |
| 2021-01-01T00:00:40Z | t1   | smpl_5v3cce |
| 2021-01-01T00:00:50Z | t1   | smpl_s9fmgy |

| _time                | *tag | _value      |
| -------------------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | t2   | smpl_b5eida |
| 2021-01-01T00:00:10Z | t2   | smpl_eu4oxp |
| 2021-01-01T00:00:20Z | t2   | smpl_5g7tz4 |
| 2021-01-01T00:00:30Z | t2   | smpl_sox1ut |
| 2021-01-01T00:00:40Z | t2   | smpl_wfm757 |
| 2021-01-01T00:00:50Z | t2   | smpl_dtn2bv |


#### Output data

| _time                | _value      | *tag |
| -------------------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | smpl_g9qczs | t1   |
| 2021-01-01T00:00:10Z | smpl_0mgv9n | t1   |
| 2021-01-01T00:00:20Z | smpl_phw664 | t1   |
| 2021-01-01T00:00:30Z | smpl_guvzy4 | t1   |
| 2021-01-01T00:00:40Z | smpl_5v3cce | t1   |
| 2021-01-01T00:00:50Z | smpl_s9fmgy | t1   |

| _time                | _value      | *tag |
| -------------------- | ----------- | ---- |
| 2021-01-01T00:00:00Z | smpl_b5eida | t2   |
| 2021-01-01T00:00:10Z | smpl_eu4oxp | t2   |
| 2021-01-01T00:00:20Z | smpl_5g7tz4 | t2   |
| 2021-01-01T00:00:30Z | smpl_sox1ut | t2   |
| 2021-01-01T00:00:40Z | smpl_wfm757 | t2   |
| 2021-01-01T00:00:50Z | smpl_dtn2bv | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
