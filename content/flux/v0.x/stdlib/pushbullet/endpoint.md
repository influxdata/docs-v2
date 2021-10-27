---
title: pushbullet.endpoint() function
description: >
  The `pushbullet.endpoint()` function creates the endpoint for the Pushbullet API
  and sends a notification of type `note`.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/pushbullet/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/pushbullet/endpoint/
menu:
  flux_0_x_ref:
    name: pushbullet.endpoint
    parent: pushbullet
weight: 202
flux/v0.x/tags: [transformations, notification endpoints]
introduced: 0.66.0
---

The `pushbullet.endpoint()` function creates the endpoint for the Pushbullet API
and sends a notification of type `note`.
Output tables include a `_sent` column that indicates whether the
the row's notification was sent successfully (`true` or `false`).

```js
import "pushbullet"

pushbullet.endpoint(
  url: "https://api.pushbullet.com/v2/pushes",
  token: ""
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

## Usage
`pushbullet.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
A function that builds the record used to generate the API request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns a record that must include the
following fields (as defined in [`pushbullet.pushNote()`](/flux/v0.x/stdlib/pushbullet/pushnote/#title)):

- `title`
- `text`

## Examples

##### Send the last reported status to Pushbullet
```js
import "pushbullet"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "PUSHBULLET_TOKEN")
e = pushbullet.endpoint(token: token)

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -10m)
    |> filter(fn: (r) => r._measurement == "statuses")
    |> last()

lastReported
  |> e(mapFn: (r) => ({
      r with
      title: r.title,
      text: "${string(v: r._time)}: ${r.status}."
    })
  )()
```
