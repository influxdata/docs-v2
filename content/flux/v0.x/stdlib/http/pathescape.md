---
title: http.pathEscape() function
description: >
  The `http.pathEscape()` function escapes special characters in a string (including `/`)
  and replaces non-ASCII characters with hexadecimal representations (`%XX`).
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/http/pathescape/
  - /influxdb/cloud/reference/flux/stdlib/http/pathescape/
menu:
  flux_0_x_ref:
    name: http.pathEscape
    parent: http
weight: 202
introduced: 0.71.0
---

The `http.pathEscape()` function escapes special characters in a string (including `/`)
and replaces non-ASCII characters with hexadecimal representations (`%XX`).

```js
import "http"

http.pathEscape(
  inputString: "/this/is/an/example-path.html"
)

// Returns %2Fthis%2Fis%2Fan%2Fexample-path.html
```

## Parameters

### inputString {data-type="string"}
The string to escape.

## Examples

##### URL-encode strings in a stream of tables
```js
import "http"

data
  |> map(fn: (r) => ({ r with
    path: http.pathEscape(inputString: r.path)
  }))
```
