---
title: pushbullet.pushNote() function
description: >
  The `pushbullet.pushNote()` function sends a push notification of type `note`
  to the Pushbullet API.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/pushbullet/pushnote/
  - /influxdb/cloud/reference/flux/stdlib/pushbullet/pushnote/
menu:
  influxdb_2_0_ref:
    name: pushbullet.pushNote
    parent: Pushbullet
weight: 202
introduced: 0.66.0
---

The `pushbullet.pushNote()` function sends a push notification of type `note`
to the Pushbullet API.

_**Function type:** Output_

```js
import "pushbullet"

pushbullet.pushNote(
  url: "https://api.pushbullet.com/v2/pushes",
  token: "",
  title: "This is a push notification!",
  text: "This push notification came from Flux."
)
```

## Parameters

### url
Pushbullet API URL.
Defaults to `https://api.pushbullet.com/v2/pushes`.

_**Data type:** String_

### token
[Pushbullet API token](https://get.pushbullet.help/hc/en-us/articles/215770388-Create-and-regenerate-API-tokens)
to use when interacting with Pushbullet.
Defaults to `""`.

_**Data type:** String_

### title
({{< req >}})
Title of the notification.

_**Data type:** String_

### text
({{< req >}})
Text to display in the notification.

_**Data type:** String_

## Examples

##### Send the last reported status to Pushbullet
```js
import "pushbullet"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "PUSHBULLET_TOKEN")

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "statuses")
    |> last()
    |> tableFind(fn: (key) => true)
    |> getRecord(idx: 0)

pushbullet.pushNote(
  token: token,
  title: "Last reported status",
  text: "${lastReported._time}: ${lastReported.status}."
)
```
