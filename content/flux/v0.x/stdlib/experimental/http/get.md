---
title: http.get() function
description: >
  The `http.get()` function submits an HTTP GET request to the specified URL and
  returns the HTTP status code, response body, and response headers.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/http/get/
  - /influxdb/cloud/reference/flux/stdlib/experimental/http/get/
menu:
  flux_0_x_ref:
    name: http.get
    parent: http-exp
weight: 401
introduced: 0.39.0
---

The `http.get()` function submits an HTTP GET request to the specified URL and
returns the HTTP status code, response body, and response headers.

```js
import "experimental/http"

http.get(
    url: "http://localhost:8086/",
    headers: {x:"a", y:"b", z:"c"},
    timeout: 30s
)
```

## Parameters

### url {data-type="string"}
The URL to send the GET request to.

### headers {data-type="record"}
Headers to include with the GET request.

### timeout {data-type="duration"}
Timeout for the GET request.
Default is `30s`.

## Response format
`http.get` returns a record that contains the following:

- [statusCode](#statuscode)
- [body](#body)
- [headers](#headers)

### statusCode {data-type="int"}
The HTTP status code returned by the GET request.

### body {data-type="bytes"}
The response body.

### headers {data-type="record"}
Headers included with the response.

## Examples

##### Get the status of InfluxDB OSS
{{< keep-url >}}
```js
import "influxdata/influxdb/secrets"
import "experimental/http"
import "csv"

token = secrets.get(key: "READONLY_TOKEN")

response = http.get(url: "http://localhost:8086/health", headers: {Authorization: "Token ${token}"})

httpStatus = response.statusCode
responseBody = string(v: response.body)
responseHeaders = response.headers

// Response header data
date = responseHeaders.Date
contentLenth = responseHeaders["Content-Length"]
contentType = responseHeaders["Content-Type"]

// Use the returned data in a stream of tables
csvData = "#datatype,string,long,string
#group,false,false,false
#default,,,
,result,table,column
,,0,*
"

csv.from(csv: csvData)
    |> map(
        fn: (r) => ({
            httpStatus: httpStatus,
            responseBody: responseBody,
            date: date,
            contentLenth: contentLenth,
            contentType: contentType,
        }),
    )
```
