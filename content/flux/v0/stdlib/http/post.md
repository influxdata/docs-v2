---
title: http.post() function
description: >
  `http.post()` sends an HTTP POST request to the specified URL with headers and data
  and returns the HTTP status code.
menu:
  flux_v0_ref:
    name: http.post
    parent: http
    identifier: http/post
weight: 101
flux/v0/tags: [single notification]
introduced: 0.40.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/http/http.flux#L50-L50

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`http.post()` sends an HTTP POST request to the specified URL with headers and data
and returns the HTTP status code.



##### Function type signature

```js
(url: string, ?data: bytes, ?headers: A) => int where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
URL to send the POST request to.



### headers

Headers to include with the POST request.

**Header keys with special characters:**
Wrap header keys that contain special characters in double quotes (`""`).

### data

Data body to include with the POST request.




## Examples

### Send the last reported status to a URL

```js
import "json"
import "http"

lastReported =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses")
        |> last()
        |> findColumn(fn: (key) => true, column: "_level")

http.post(
    url: "http://myawsomeurl.com/api/notify",
    headers: {Authorization: "Bearer mySuPerSecRetTokEn", "Content-type": "application/json"},
    data: json.encode(v: lastReported[0]),
)

```

