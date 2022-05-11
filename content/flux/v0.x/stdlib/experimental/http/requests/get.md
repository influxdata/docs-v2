---
title: requests.get() function
description: >
  `requests.get()` makes an HTTP request using the GET request method.
menu:
  flux_0_x_ref:
    name: requests.get
    parent: requests
weight: 401
flux/v0.x/tags: [http, inputs, outputs]
introduced: 0.152.0
---

`requests.get()` makes an HTTP request using the GET request method.

```js
import "experimental/http/requests"

requests.get(
    url: "http://example.com",
    params: ["example-param": ["example-param-value"]],
    headers: ["Example-Header": "example-header-value"],
    body: bytes(v: ""),
    config: requests.defaultConfig,
)
```

`requests.get()` returns a record with the following properties:

- **statusCode**: HTTP status code of the request.
- **body**: Response body. A maximum size of 100MB is read from the response body.
- **headers**: Response headers.

## Parameters

### url {data-type="string"}
URL to send the request to.

{{% note %}}
The URL should not include any query parameters.
Use [`params`](#params) to specify query parameters.
{{% /note %}}

### params {data-type="dict"}
Set of key-value pairs to add to the URL as query parameters.
Query parameters are URL-encoded.
All values for a key are appended to the query.

### headers {data-type="dict"}
Set of key values pairs to include as request headers.

### body {data-type="bytes"}
Data to send with the request.

### config {data-type="record"}
Set of request configuration options.
_See [HTTP configuration option examples](/flux/v0.x/stdlib/experimental/http/requests/#examples)._

## Examples

- [Make a GET request](#make-a-get-request)
- [Make a GET request with authorization](#make-a-get-request-with-authorization)
- [Make a GET request and decode the JSON response](#make-a-get-request-and-decode-the-json-response)
- [Output HTTP response data in a table](#output-http-response-data-in-a-table)

### Make a GET request
```js
import "experimental/http/requests"

requests.get(url:"http://example.com")
```

### Make a GET request with authorization
```js
import "experimental/http/requests"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "TOKEN")

requests.get(url: "http://example.com", headers: ["Authorization": "Bearer ${token}"])
```

### Make a GET request and decode the JSON response
To decode a JSON response, import the [`experimental/json` package](/flux/v0.x/stdlib/experimental/json/)
and use [`json.parse()`](/flux/v0.x/stdlib/experimental/json/parse/) to parse
the response into a [Flux type](/flux/v0.x/data-types/).

```js
import "experimental/http/requests"
import "experimental/json"
import "array"

response = requests.get(url: "https://api.agify.io", params: ["name": ["john"]])

// api.agify.io returns JSON with the form
//
// {
//    name: string,
//    age: number,
//    count: number,
// }
//
// Define a data variable that parses the JSON response body into a Flux record.
data = json.parse(data: response.body)

// Use array.from() to construct a table with one row containing our response data.
array.from(rows: [{name: data.name, age: data.age, count: data.count}])
```

### Output HTTP response data in a table
To quickly inspect HTTP response data, use [`requests.peek()`](/flux/v0.x/stdlib/experimental/http/requests/peek/)
to output HTTP response data in a table.

```js
import "experimental/http/requests"

response = requests.get(url: "http://example.com")

requests.peek(response: response)
```
