---
title: webexteams.message() function
description: >
  The `webexteams.message()` function sends a single message to Webex using the
  [Webex messages API](https://developer.webex.com/docs/api/v1/messages/create-a-message).
menu:
  flux_0_x_ref:
    name: webexteams.message
    parent: webexteams
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/webexteams/message/
  - /influxdb/cloud/reference/flux/stdlib/contrib/webexteams/message/
---

The `webexteams.message()` function sends a single message to Webex using the
[Webex messages API](https://developer.webex.com/docs/api/v1/messages/create-a-message).

```js
import "contrib/sranka/webexteams"

webexteams.message(,
  url: "https://webexapis.com"
  token: "My5uP3rs3cRe7T0k3n",
  roomId: "Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0",
  text: "Example plain text message",
  markdown: "Example [markdown message](https://developer.webex.com/docs/api/basics)." 
)
```

## Parameters 

### url {data-type="string"}
Base URL of Webex API endpoint _(without a trailing slash)_.
Default is `https://webexapis.com`.

### token {data-type="string"}
({{< req >}})
[Webex API access token](https://developer.webex.com/docs/api/getting-started).

### roomId {data-type="string"}
({{< req >}})
Room ID to send the message to.

### text {data-type="string"}
({{< req >}})
Plain text message.

### markdown {data-type="string"}
({{< req >}})
[Markdown formatted message](https://developer.webex.com/docs/api/basics#formatting-messages).

## Examples

##### Send the last reported status to Webex Teams
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
  markdown: "Disk usage is **${lastReported.status}**."
)
```
