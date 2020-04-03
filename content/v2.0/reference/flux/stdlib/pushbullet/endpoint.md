---
title: pushbullet.endpoint() function
description: >
  The `pushbullet.endpoint()` function creates the endpoint for the Pushbullet API
  and sends a notification of type `note`.
menu:
  v2_0_ref:
    name: pushbullet.endpoint
    parent: Pushbullet
weight: 202
---

The `pushbullet.endpoint()` function creates the endpoint for the Pushbullet API
and sends a notification of type `note`.

_**Function type:** Output_

```js
import "pushbullet"

pushbullet.endpoint(
  url: "https://api.pushbullet.com/v2/pushes",
  token: "",
  mapFn: (r) => ({
    r with
    title: "Notification Title",
    text: "Value: ${string(v: r._value)}"
  })
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

### mapFn
A function that builds the object used to generate the API request.

_**Data type:** Function_

The returned object must include the following fields:

- `title`
- `text`

## Examples

##### Send the last reported status to Pushbullet
```js
import "pushbullet"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "PUSHBULLET_TOKEN")

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -10m)
    |> filter(fn: (r) => r._measurement == "statuses")
    |> last()

lastReported
  |> pushbullet.endpoint(
    token: token,
    mapFn: (r) => ({
      r with
      title: "Last reported status",
      text: "${lastReported._time}: ${lastReported.status}."
    })
  )
```
