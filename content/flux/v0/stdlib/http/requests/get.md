---
title: requests.get() function
description: >
  `requests.get()` makes a http GET request. This identical to calling `request.do(method: "GET", ...)`.
menu:
  flux_v0_ref:
    name: requests.get
    parent: http/requests
    identifier: http/requests/get
weight: 201
flux/v0/tags: [http, inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/http/requests/requests.flux#L274-L288

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`requests.get()` makes a http GET request. This identical to calling `request.do(method: "GET", ...)`.



##### Function type signature

```js
(
    url: string,
    ?body: bytes,
    ?config: {A with timeout: duration, insecureSkipVerify: bool},
    ?headers: [string:string],
    ?params: [string:[string]],
) => {statusCode: int, headers: [string:string], duration: duration, body: bytes}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
URL to request. This should not include any query parameters.



### params

Set of key value pairs to add to the URL as query parameters.
Query parameters will be URL encoded.
All values for a key will be appended to the query.



### headers

Set of key values pairs to include on the request.



### body

Data to send with the request.



### config

Set of options to control how the request should be performed.




## Examples

- [Make a GET request](#make-a-get-request)
- [Make a GET request and decode the JSON response](#make-a-get-request-and-decode-the-json-response)

### Make a GET request

```js
import "http/requests"

response = requests.get(url: "http://example.com")

requests.peek(response: response)

```


### Make a GET request and decode the JSON response

```js
import "http/requests"
import "experimental/json"
import "array"

response = requests.get(url: "https://api.agify.io", params: ["name": ["nathaniel"]])

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
// We do not care about the count so only include name and age.
array.from(rows: [{name: data.name, age: data.age}])

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| name      | age  |
| --------- | ---- |
| nathaniel | 61   |

{{% /expand %}}
{{< /expand-wrapper >}}
