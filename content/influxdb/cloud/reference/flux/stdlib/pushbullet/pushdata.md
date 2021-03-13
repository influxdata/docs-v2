---
title: pushbullet.pushData() function
description: >
  The `pushbullet.pushData()` function sends a push notification to the Pushbullet API.
menu:
  influxdb_cloud_ref:
    name: pushbullet.pushData
    parent: Pushbullet
weight: 202
---

The `pushbullet.pushData()` function sends a push notification to the
[Pushbullet API](https://docs.pushbullet.com/).

_**Function type:** Output_

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

### url
Pushbullet API URL.
Defaults to `https://api.pushbullet.com/v2/pushes`.

_**Data type:** String_

### token
[Pushbullet API token](https://get.pushbullet.help/hc/en-us/articles/215770388-Create-and-regenerate-API-tokens)
to use when interacting with Pushbullet.
Defaults to `""`.

_**Data type:** String_

### data
({{< req >}})  
Data to send to the Pushbullet API.
The function JSON-encodes data before sending it to Pushbullet.

_**Data type:** Record_



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
