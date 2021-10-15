---
title: pushbullet.pushData() function
description: >
  The `pushbullet.pushData()` function sends a push notification to the Pushbullet API.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/pushbullet/pushdata/
  - /influxdb/cloud/reference/flux/stdlib/pushbullet/pushdata/
menu:
  flux_0_x_ref:
    name: pushbullet.pushData
    parent: pushbullet
weight: 202
flux/v0.x/tags: [single notification]
introduced: 0.66.0
---

The `pushbullet.pushData()` function sends a push notification to the
[Pushbullet API](https://docs.pushbullet.com/).

```js
import "pushbullet"

pushbullet.pushData(
  url: "https://api.pushbullet.com/v2/pushes",
  token: "",
  data: {
    "type": "link",
    "title": "This is a notification!",
    "body": "This notification came from Flux.",
    "url": "http://example.com"
  }
)
```

## Parameters

### url {data-type="string"}
Pushbullet API URL.
Defaults to `https://api.pushbullet.com/v2/pushes`.

### token {data-type="string"}
[Pushbullet API token](https://get.pushbullet.help/hc/en-us/articles/215770388-Create-and-regenerate-API-tokens)
to use when interacting with Pushbullet.
Defaults to `""`.

### data {data-type="record"}
({{< req >}})
Data to send to the Pushbullet API.
The function JSON-encodes data before sending it to Pushbullet.

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

pushbullet.pushData(
  token: token,
  data: {
    "type": "link",
    "title": "Last reported status",
    "body": "${lastReported._time}: ${lastReported.status}."
    "url": "${lastReported.statusURL}"
  }
)
```
