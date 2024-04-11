---
title: requests.do() function
description: >
  `requests.do()` makes an http request.
menu:
  flux_v0_ref:
    name: requests.do
    parent: experimental/http/requests
    identifier: experimental/http/requests/do
weight: 301
flux/v0/tags: [http, inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/http/requests/requests.flux#L139-L157

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`requests.do()` makes an http request.

{{% warn %}}
#### Deprecated
Experimental `requests.do` is deprecated in favor of [`requests.do`](/flux/v0/stdlib/http/requests/do/).
{{% /warn %}}

The returned response contains the following properties:

- statusCode: HTTP status code returned from the request.
- body: Contents of the request. A maximum size of 100MB will be read from the response body.
- headers: Headers present on the response.
- duration: Duration of request.

##### Function type signature

```js
(
    method: string,
    url: string,
    ?body: bytes,
    ?config: {A with timeout: duration, insecureSkipVerify: bool},
    ?headers: [string:string],
    ?params: [string:[string]],
) => {statusCode: int, headers: [string:string], duration: duration, body: bytes}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### method
({{< req >}})
method of the http request.
Supported methods: DELETE, GET, HEAD, PATCH, POST, PUT.



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
- [Make a GET request that needs authorization](#make-a-get-request-that-needs-authorization)
- [Make a GET request with query parameters](#make-a-get-request-with-query-parameters)

### Make a GET request

```js
import "experimental/http/requests"

response = requests.do(url: "http://example.com", method: "GET")

requests.peek(response: response)

```


### Make a GET request that needs authorization

```js
import "experimental/http/requests"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "TOKEN")

response =
    requests.do(
        method: "GET",
        url: "http://example.com",
        headers: ["Authorization": "token ${token}"],
    )

requests.peek(response: response)

```


### Make a GET request with query parameters

```js
import "experimental/http/requests"

response = requests.do(method: "GET", url: "http://example.com", params: ["start": ["100"]])

requests.peek(response: response)

```

