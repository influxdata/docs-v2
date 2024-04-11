---
title: http.basicAuth() function
description: >
  `http.basicAuth()` returns a Base64-encoded basic authentication header
  using a specified username and password combination.
menu:
  flux_v0_ref:
    name: http.basicAuth
    parent: http
    identifier: http/basicAuth
weight: 101

introduced: 0.44.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/http/http.flux#L79-L79

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`http.basicAuth()` returns a Base64-encoded basic authentication header
using a specified username and password combination.



##### Function type signature

```js
(p: string, u: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### u
({{< req >}})
Username to use in the basic authentication header.



### p
({{< req >}})
Password to use in the basic authentication header.




## Examples

### Set a basic authentication header in an HTTP POST request

```js
import "http"

username = "myawesomeuser"
password = "mySupErSecRetPasSW0rD"

http.post(
    url: "http://myawesomesite.com/api/",
    headers: {Authorization: http.basicAuth(u: username, p: password)},
    data: bytes(v: "Something I want to send."),
)

```

