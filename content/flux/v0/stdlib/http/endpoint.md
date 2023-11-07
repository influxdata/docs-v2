---
title: http.endpoint() function
description: >
  `http.endpoint()` iterates over input data and sends a single POST request per input row to
  a specficied URL.
menu:
  flux_v0_ref:
    name: http.endpoint
    parent: http
    identifier: http/endpoint
weight: 101
flux/v0/tags: [notification endpoints]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/http/http.flux#L155-L170

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`http.endpoint()` iterates over input data and sends a single POST request per input row to
a specficied URL.

This function is designed to be used with `monitor.notify()`.

`http.endpoint()` outputs a function that requires a `mapFn` parameter.
`mapFn` is the function that builds the record used to generate the POST request.
It accepts a table row (`r`) and returns a record that must include the
following properties:

- `headers`
- `data`

_For information about properties, see `http.post`._

##### Function type signature

```js
(
    url: string,
) => (mapFn: (r: A) => {B with headers: C, data: bytes}) => (<-tables: stream[A]) => stream[{A with _sent: string}] where C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
URL to send the POST reqeust to.




## Examples

### Send an HTTP POST request for each row

```js
import "http"
import "sampledata"

endpoint =
    http.endpoint(url: "http://example.com/")(
        mapfn: (r) =>
            ({
                headers: {header1: "example1", header2: "example2"},
                data: bytes(v: "The value is ${r._value}"),
            }),
    )

sampledata.int()
    |> endpoint()

```

