---
title: webexteams.message() function
description: >
  `webexteams.message()` sends a single message to Webex
  using the [Webex messages API](https://developer.webex.com/docs/api/v1/messages/create-a-message).
menu:
  flux_v0_ref:
    name: webexteams.message
    parent: contrib/sranka/webexteams
    identifier: contrib/sranka/webexteams/message
weight: 301
flux/v0.x/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/webexteams/webexteams.flux#L51-L68

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`webexteams.message()` sends a single message to Webex
using the [Webex messages API](https://developer.webex.com/docs/api/v1/messages/create-a-message).



##### Function type signature

```js
(
    markdown: A,
    roomId: B,
    text: C,
    token: string,
    ?url: string,
) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url

Base URL of Webex API endpoint (without a trailing slash).
Default is `https://webexapis.com`.



### token
({{< req >}})
[Webex API access token](https://developer.webex.com/docs/api/getting-started).



### roomId
({{< req >}})
Room ID to send the message to.



### text
({{< req >}})
Plain text message.



### markdown
({{< req >}})
[Markdown formatted message](https://developer.webex.com/docs/api/basics#formatting-messages).




## Examples

### Send the last reported status to Webex Teams

```js
import "contrib/sranka/webexteams"
import "influxdata/influxdb/secrets"

apiToken = secrets.get(key: "WEBEX_API_TOKEN")

lastReported =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses")
        |> last()
        |> findRecord(fn: (key) => true, idx: 0)

webexteams.message(
    token: apiToken,
    roomId: "Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0",
    text: "Disk usage is ${lastReported.status}.",
    markdown: "Disk usage is **${lastReported.status}**.",
)

```

