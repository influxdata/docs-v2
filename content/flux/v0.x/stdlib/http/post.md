---
title: http.post() function
description: >
  The `http.post()` function submits an HTTP POST request to the specified URL with headers and data.
  The HTTP status code is returned.
aliases:
  - /influxdb/v2.0/reference/flux/functions/http/post/
  - /influxdb/v2.0/reference/flux/stdlib/http/post/
  - /influxdb/cloud/reference/flux/stdlib/http/post/
menu:
  flux_0_x_ref:
    name: http.post
    parent: http
weight: 202
introduced: 0.40.0
---

The `http.post()` function submits an HTTP POST request to the specified URL with
headers and data and returns the HTTP status code.

```js
import "http"

http.post(
  url: "http://localhost:8086/",
  headers: {x:"a", y:"b", z:"c"},
  data: bytes(v: "body")
)
```

## Parameters

### url {data-type="string"}
The URL to POST to.

### headers {data-type="record"}
Headers to include with the POST request.

{{% note %}}
##### Header keys with special characters
Wrap header keys that contain special characters in double quotes (`""`).

```js
{"key-1": "value 1", "key#2": "value 2" }
```
{{% /note %}}

### data {data-type="bytes"}
The data body to include with the POST request.

## Examples

##### Send the last reported status to a URL
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
  headers: {
    Authorization: "Bearer mySuPerSecRetTokEn",
    "Content-type": "application/json"
  },
  data: json.encode(v: lastReported[0])
)
```
