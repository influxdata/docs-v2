---
title: teams.endpoint() function
description: >
  The `teams.endpoint()` function sends a message to a Microsoft Teams channel
  using data from table rows.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/teams/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/teams/endpoint/
menu:
  flux_0_x_ref:
    name: teams.endpoint
    parent: teams
weight: 202
flux/v0.x/tags: [notification endpoints]
introduced: 0.70.0
---

The `teams.endpoint()` function sends a message to a Microsoft Teams channel
using data from table rows.

```js
import "contrib/sranka/teams"

teams.endpoint(
 url: "https://outlook.office.com/webhook/example-webhook"
)
```

## Parameters

### url {data-type="string"}
Incoming webhook URL.

## Usage
`teams.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns an object that must include the
following fields:

- `title`
- `text`
- `summary`

_For more information, see [`teams.message()` parameters](/v2.0/reference/flux/stdlib/contrib/teams/message/#parameters)._

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
