---
title: requests.peek() function
description: >
  `requests.peek()` converts an HTTP response into a table for easy inspection.
menu:
  flux_0_x_ref:
    name: requests.peek
    parent: requests
weight: 401
flux/v0.x/tags: [http]
introduced: 0.154.0
---

`requests.peek()` converts an HTTP response into a table for easy inspection.

```js
import "experimental/http/requests"

requests.peek(
    response: requests.get(url: "http://example.com")
)
```

The output table includes the following columns:

- **body**: response body as a string
- **statusCode**: returned status code as an integer
- **headers**: string representation of response headers
- **duration**: request duration in nanoseconds

{{% note %}}
To customize how the response data is structured in a table, use `array.from()`
with a function like `json.parse()`. Parse the response body into a set of values
and then use `array.from()` to construct a table from those values.
{{% /note %}}


## Parameters

### response {data-type="record"}
Response data from an HTTP request.

## Examples

### Inspect the response of an HTTP request
```js
import "experimental/http/requests"

response = requests.get(url: "https://api.agify.io", params: ["name": ["natalie"]])

requests.peek(response: response)
```

| statusCode | body | headers | duration |
| :--------- | :--- | :------ | -------: |
| 200 | {"name":"natalie","age":34,"count":20959} | _See [returned headers](#returned-headers) string below_ | 1212263875 |

##### Returned headers
```
[
    Access-Control-Allow-Headers: Content-Type, X-Genderize-Source,
    Access-Control-Allow-Methods: GET,
    Access-Control-Allow-Origin: *,
    Connection: keep-alive,
    Content-Length: 41,
    Content-Type: application/json; charset=utf-8,
    Date: Wed, 09 Feb 2022 20:00:00 GMT,
    Etag: W/"29-klDahUESBLxHyQ7NiaetCn2CvCI",
    Server: nginx/1.16.1,
    X-Rate-Limit-Limit: 1000,
    X-Rate-Limit-Remaining: 999,
    X-Rate-Reset: 12203
]
```
