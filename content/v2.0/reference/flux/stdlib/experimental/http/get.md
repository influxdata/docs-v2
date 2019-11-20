---
title: http.get() function
description: >
  The `http.get()` function submits an HTTP GET request to the specified URL with headers
  and returns the HTTP status code and body as a byte array.
menu:
  v2_0_ref:
    name: http.get
    parent: HTTP-exp
weight: 301
---

The `http.get()` function submits an HTTP GET request to the specified URL with headers
and returns the HTTP status code and body as a byte array.

_**Function type:** Miscellaneous_

{{% warn %}}
The `http.get()` function is currently experimental and subject to change at any time.
By using this function, you accept the [risks of experimental functions](/v2.0/reference/flux/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

```js
import "experimental/http"

http.get(
  url: "http://localhost:9999/",
  headers: {x:"a", y:"b", z:"c"}
)
```

## Parameters

### url
The URL to send the GET request to.

_**Data type:** String_

### headers
Headers to include with the GET request.

_**Data type:** Object_

## Examples

##### Get the status of InfluxDB
```js
import "experimental/http"

response = http.get(
    url: "http://localhost.com:9999/health",
    headers: {}
  )

status = string(v: response.body)
```
