---
title: Send notifications with Flux
description: >
  ...
menu:
  flux_0_x:
    name: Send notifications
weight: 8
flux/v0.x/tags: [notifications]
---

_Placeholder intro content_

{{< children >}}

## Notification packages
Notification related packages contain:

- one or more functions to send a single notification.
- an `endpoint` function to iterate over a stream of tables and send a notification
  for each input row.

## Notification conventions


- [Endpoint notification convention](#endpoint-notfication-convention)
- [Map notification convention](#map-notfication-convention)
- [One-off notification convention](#one-off-notification-convention)

### Endpoint notification convention
- endpoint function is primarily used to provide credentials
- mapFn
- Factory functions (functions that generate another function)
- The endpoint convention was established primarily to aid in building notification
  integrations into the InfluxDB UI.

```js
import "sampledata"
import "slack"

endpoint = slack.endpoint(
    url: "https://slack.com/api/chat.postMessage",
    token: "mySuPerSecRetTokEn"
)

data = sampledata.float()
    |> filter(fn: (r) => r._value > 18)
    |> max()

data 
    |> endpoint(mapFn: (r) => ({
        channel: "#my-channel",
        text: "Oh no! *${tag}* had a value of *${r._value}* at ${r._time}."
        color: "warning"
    }))
```

#### Notification endpoint functions
{{< list-all-functions filters="notification endpoints" >}}

### Map convention
Uses [`map`](/flux/v0.x/stdlib/universe/map/) to iterate over all input rows and
send a notification for each row.
Single notifications return the HTTP response code of the request.

```js
import "sampledata"
import "slack"

data = sampledata.float()
  |> filter(fn: (r) => r._value > 18)
  |> max()

data 
  |> map(fn: (r) => ({
      r with sent: slack.message(
          url: "https://slack.com/api/chat.postMessage",
          token: "mySuPerSecRetTokEn",
          channel: "#my-channel",
          text: "Oh no! *${r.tag}* had a value of *${r._value}* at ${r._time}."
          color: "warning"
      )
  }))
```

#### Single notification functions
{{< list-all-functions filters="single notification" >}}

### One-off notification convention
- Execute a single notification function directly
- Can used scalar data

```js
import "sampledata"
import "slack"

p = {fname: "John", lname: "Doe" age: 42 }

slack.message(
    url: "https://slack.com/api/chat.postMessage",
    token: "mySuPerSecRetTokEn",
    channel: "#my-channel",
    text: "*${p.fname} ${p.lname}* is *${r._value}* at ${r._time}."
    color: "warning"
)
```