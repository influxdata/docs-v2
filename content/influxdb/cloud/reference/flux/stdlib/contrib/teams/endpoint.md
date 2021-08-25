---
title: teams.endpoint() function
description: >
  The `teams.endpoint()` function sends a message to a Microsoft Teams channel
  using data from table rows.
menu:
  influxdb_cloud_ref:
    name: teams.endpoint
    parent: Microsoft Teams
weight: 202
---

The `teams.endpoint()` function sends a message to a Microsoft Teams channel
using data from table rows.

_**Function type:** Output_

```js
import "contrib/sranka/teams"

teams.endpoint(
 url: "https://outlook.office.com/webhook/example-webhook"
)
```

## Parameters

### url
Incoming webhook URL.

_**Data type:** String_

## Usage
`teams.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

_**Data type:** Function_

`mapFn` accepts a table row (`r`) and returns an object that must include the
following fields:

- `title`
- `text`
- `summary`

_For more information, see [`teams.message()` parameters](/influxdb/v2.0/reference/flux/stdlib/contrib/teams/message/#parameters)._

## Examples

##### Send critical statuses to a Microsoft Teams channel
```js
import "contrib/sranka/teams"

url = "https://outlook.office.com/webhook/example-webhook"
endpoint = teams.endpoint(url: url)

crit_statuses = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_statuses
  |> endpoint(mapFn: (r) => ({
      title: "Disk Usage"
      text: "Disk usage is: **${r.status}**.",
      summary: "Disk usage is ${r.status}"
    })
  )()
```

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
