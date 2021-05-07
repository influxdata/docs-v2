---
title: http.post() function
description: >
  The `http.post()` function submits an HTTP POST request to the specified URL with headers and data.
  The HTTP status code is returned.
aliases:
  - /influxdb/cloud/reference/flux/functions/http/post/
menu:
  influxdb_cloud_ref:
    name: http.post
    parent: HTTP
weight: 202
---

The `http.post()` function submits an HTTP POST request to the specified URL with
headers and data and returns the HTTP status code.

_**Function type:** Output_

```js
import "http"

http.post(
  url: "http://localhost:8086/",
  headers: {x:"a", y:"b", z:"c"},
  data: bytes(v: "body")
)
```

## Parameters

### url
The URL to POST to.

_**Data type:** String_

### headers
Headers to include with the POST request.

_**Data type:** Record_

{{% note %}}
##### Header keys with special characters
Wrap header keys that contain special characters in double quotes (`""`).

```js
{"key-1": "value 1", "key#2": "value 2" }
```
{{% /note %}}

### data
The data body to include with the POST request.

_**Data type:** Bytes_

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
