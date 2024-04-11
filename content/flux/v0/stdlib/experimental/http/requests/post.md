---
title: requests.post() function
description: >
  `requests.post()` makes a http POST request. This identical to calling `request.do(method: "POST", ...)`.
menu:
  flux_v0_ref:
    name: requests.post
    parent: experimental/http/requests
    identifier: experimental/http/requests/post
weight: 301
flux/v0/tags: [http, inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/http/requests/requests.flux#L196-L213

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`requests.post()` makes a http POST request. This identical to calling `request.do(method: "POST", ...)`.

{{% warn %}}
#### Deprecated
Experimental `requests.post` is deprecated in favor of [`requests.post`](/flux/v0/stdlib/http/requests/post/).
{{% /warn %}}

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

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

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

### Make a POST request with a JSON body and decode JSON response

```js
import "experimental/http/requests"
import ejson "experimental/json"
import "json"
import "array"

response =
    requests.post(
        url: "https://goolnk.com/api/v1/shorten",
        body: json.encode(v: {url: "http://www.influxdata.com"}),
        headers: ["Content-Type": "application/json"],
    )

data = ejson.parse(data: response.body)

array.from(rows: [data])

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| result_url                |
| ------------------------- |
| https://goolnk.com/BnXAE6 |

{{% /expand %}}
{{< /expand-wrapper >}}
