---
title: webexteams.endpoint() function
description: >
  The `webexteams.endpoint()` function sends a single message to Webex using the
  [Webex messages API](https://developer.webex.com/docs/api/v1/messages/create-a-message).
menu:
  flux_0_x_ref:
    name: webexteams.endpoint
    parent: webexteams
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/webexteams/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/webexteams/endpoint/
flux/v0.x/tags: [notification endpoints]
---

The `webexteams.endpoint()` function returns a function that sends a message that
includes data from input rows to a Webex room.

```js
import "contrib/sranka/webexteams"

webexteams.endpoint(
  url: "https://webexapis.com",
  token: "token"
)
```

## Parameters

### url {data-type="string"}
Base URL of Webex API endpoint _(without a trailing slash)_.
Default is `https://webexapis.com`.

### token {data-type="string"}
({{< req >}})
[Webex API access token](https://developer.webex.com/docs/api/getting-started).

## Usage
`webexteams.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the
following properties:

- `roomId`
- `text`
- `markdown`

_For more information, see [`webexteams.message()` parameters](/flux/v0.x/stdlib/contrib/sranka/webexteams/message/#parameters)._

## Examples

##### Send the last reported status to Webex Teams
```js
import "contrib/sranka/webexteams"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "WEBEX_API_KEY")

from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses")
  |> last()
  |> tableFind(fn: (key) => true)
  |> webexteams.endpoint(token: token)(mapFn: (r) => ({
      roomId: "Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0",
      text: "",
      markdown: "Disk usage is **${r.status}**.", 
  })
```