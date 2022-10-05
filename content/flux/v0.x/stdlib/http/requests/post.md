---
title: requests.post() function
description: >
  `requests.post()` makes a http POST request. This identical to calling `request.do(method: "POST", ...)`.
menu:
  flux_0_x_ref:
    name: requests.post
    parent: http/requests
    identifier: http/requests/post
weight: 201
flux/v0.x/tags: [http, inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/http/requests/requests.flux#L202-L216

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`requests.post()` makes a http POST request. This identical to calling `request.do(method: "POST", ...)`.



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

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

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

- [Make a POST request with a JSON body and decode JSON response](#make-a-post-request-with-a-json-body-and-decode-json-response)
- [Make a POST request with query parameters](#make-a-post-request-with-query-parameters)

### Make a POST request with a JSON body and decode JSON response

```js
import "http/requests"
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

### Make a POST request with query parameters

```js
import "http/requests"

response =
    requests.post(url: "http://example.com", params: ["start": ["100"], "interval": ["1h", "1d"]])

// Full URL: http://example.com?start=100&interval=1h&interval=1d
requests.peek(response: response)

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| statusCode  | body                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | headers                                                                                                                                                                                                                                                                                                                                            | duration  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 200         | <!doctype html>
<html>
<head>
    <title>Example Domain</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
        font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        
    }
    div {
        width: 600px;
        margin: 5em auto;
        padding: 2em;
        background-color: #fdfdff;
        border-radius: 0.5em;
        box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);
    }
    a:link, a:visited {
        color: #38488f;
        text-decoration: none;
    }
    @media (max-width: 700px) {
        div {
            margin: 0 auto;
            width: auto;
        }
    }
    </style>    
</head>

<body>
<div>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples in documents. You may use this
    domain in literature without prior coordination or asking for permission.</p>
    <p><a href="https://www.iana.org/domains/example">More information...</a></p>
</div>
</body>
</html>
                                                                                             | [
    Accept-Ranges: bytes, 
    Cache-Control: max-age=604800, 
    Content-Length: 1256, 
    Content-Type: text/html; charset=UTF-8, 
    Date: Mon, 03 Oct 2022 21:20:24 GMT, 
    Etag: "3147526947", 
    Expires: Mon, 10 Oct 2022 21:20:24 GMT, 
    Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT, 
    Server: EOS (vny/0452)
]                     | 97985198  |

{{% /expand %}}
{{< /expand-wrapper >}}
