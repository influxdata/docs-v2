---
title: http.get() function
description: >
  `http.get()` submits an HTTP GET request to the specified URL and returns the HTTP
  status code, response body, and response headers.
menu:
  flux_v0_ref:
    name: http.get
    parent: experimental/http
    identifier: experimental/http/get
weight: 201
flux/v0/tags: [http, inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/http/http.flux#L41-L48

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`http.get()` submits an HTTP GET request to the specified URL and returns the HTTP
status code, response body, and response headers.

{{% warn %}}
#### Deprecated
Experimental `http.get()` is deprecated in favor of [`requests.get()`](/flux/v0/stdlib/http/requests/get/).
{{% /warn %}}

## Response format
`http.get()` returns a record with the following properties:

- **statusCode**: HTTP status code returned by the GET request (int).
- **body**: HTTP response body (bytes).
- **headers**: HTTP response headers (record).

##### Function type signature

```js
(url: string, ?headers: A, ?timeout: duration) => {statusCode: int, headers: B, body: bytes} where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### url
({{< req >}})
URL to send the GET request to.



### headers

Headers to include with the GET request.



### timeout

Timeout for the GET request. Default is `30s`.




## Examples

### Get the status of an InfluxDB OSS instance

```js
import "experimental/http"

http.get(
    url: "http://localhost:8086/health",
    headers: {Authorization: "Token mY5up3RS3crE7t0k3N", Accept: "application/json"},
)

```

