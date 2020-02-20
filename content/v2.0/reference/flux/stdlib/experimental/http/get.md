---
title: http.get() function
description: >
  The `http.get()` function submits an HTTP GET request to the specified URL and
  returns the HTTP status code, response body, and response headers.
menu:
  v2_0_ref:
    name: http.get
    parent: HTTP-exp
weight: 301
---

The `http.get()` function submits an HTTP GET request to the specified URL and
returns the HTTP status code, response body, and response headers.

_**Function type:** Miscellaneous_

```js
import "experimental/http"

http.get(
  url: "http://localhost:9999/",
  headers: {x:"a", y:"b", z:"c"},
  timeout: 30s
)
```

## Parameters

### url
The URL to send the GET request to.

_**Data type:** String_

### headers
Headers to include with the GET request.

_**Data type:** Object_

### timeout
Timeout for the GET request.
Default is `30s`.

_**Data type:** Duration_

## Response format
`http.get` returns an object that contains the following:

- [statusCode](#statuscode)
- [body](#body)
- [headers](#headers)

### statusCode
The HTTP status code returned by the GET request.

_**Data type:** Integer_

### body
The response body.

_**Data type:** Byte Array_

### headers
Headers included with the response.

_**Data type:** Object_

## Examples

##### Get the status of InfluxDB
```js
import "influxdata/influxdb/secrets"
import "experimental/http"

token = secrets.get(key: "READONLY_TOKEN")

response = http.get(
    url: "http://localhost.com:9999/health",
    headers: {Authorization: "Token ${token}"}
  )

httpStatus = response.statusCode
responseBody = string(v: response.body)
responseHeaders = response.headers
```
