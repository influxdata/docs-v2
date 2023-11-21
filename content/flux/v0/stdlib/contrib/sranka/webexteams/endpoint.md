---
title: webexteams.endpoint() function
description: >
  `webexteams.endpoint()` returns a function that sends a message that includes data from input rows to a Webex room.
menu:
  flux_v0_ref:
    name: webexteams.endpoint
    parent: contrib/sranka/webexteams
    identifier: contrib/sranka/webexteams/endpoint
weight: 301
flux/v0/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/webexteams/webexteams.flux#L117-L138

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`webexteams.endpoint()` returns a function that sends a message that includes data from input rows to a Webex room.

### Usage
`webexteams.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

#### mapFn
A function that builds the object used to generate the POST request. Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the following fields:

- `roomId`
- `text`
- `markdown`

For more information, see `webexteams.message` parameters.

##### Function type signature

```js
(
    token: string,
    ?url: string,
) => (
    mapFn: (r: A) => {B with text: E, roomId: D, markdown: C},
) => (<-tables: stream[A]) => stream[{A with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url

Base URL of Webex API endpoint (without a trailing slash).
Default is `https://webexapis.com`.



### token
({{< req >}})
[Webex API access token](https://developer.webex.com/docs/api/getting-started).




## Examples

### Send the last reported status to Webex Teams

```js
import "contrib/sranka/webexteams"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "WEBEX_API_KEY")

from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "statuses")
    |> last()
    |> tableFind(fn: (key) => true)
    |> webexteams.endpoint(token: token)(
        mapFn: (r) =>
            ({
                roomId:
                    "Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0",
                text: "",
                markdown: "Disk usage is **${r.status}**.",
            }),
    )()

```

