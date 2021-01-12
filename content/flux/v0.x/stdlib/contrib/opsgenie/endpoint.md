---
title: opsgenie.endpoint() function
description: >
  The `opsgenie.endpoint()` function sends an alert message to Opsgenie using data from table rows.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/opsgenie/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/opsgenie/endpoint/
menu:
  flux_0_x_ref:
    name: opsgenie.endpoint
    parent: Opsgenie
weight: 202
introduced: 0.84.0
---

The `opsgenie.endpoint()` function sends an alert message to Opsgenie using data from table rows.

_**Function type:** Output_

```js
import "contrib/sranka/opsgenie"

opsgenie.endpoint(
  url: "https://api.opsgenie.com/v2/alerts",
  apiKey: "YoUrSup3R5ecR37AuThK3y",
  entity: "example-entity"
)
```

## Parameters

### url
Opsgenie API URL.
Defaults to `https://api.opsgenie.com/v2/alerts`.

_**Data type:** String_

### apiKey
({{< req >}})
Opsgenie API authorization key.

_**Data type:** String_

### entity
Alert entity used to specify the alert domain.

_**Data type:** String_

## Usage
`opsgenie.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn
A function that builds the record used to generate the POST request.
Requires an `r` parameter.

_**Data type:** Function_

`mapFn` accepts a table row (`r`) and returns a record that must include the
following fields:

- `message`
- `alias`
- `description`
- `priority`
- `responders`
- `tags`
- `actions`
- `details`
- `visibleTo`

_For more information, see [`opsgenie.sendAlert()`](/influxdb/v2.0/reference/flux/stdlib/contrib/opsgenie/sendalert/)._

## Examples

##### Send critical statuses to Opsgenie
```js
import "influxdata/influxdb/secrets"
import "contrib/sranka/opsgenie"

apiKey = secrets.get(key: "OPSGENIE_APIKEY")
endpoint = opsgenie.endpoint(apiKey: apiKey)

crit_statuses = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_statuses
  |> endpoint(mapFn: (r) => ({
    message: "Great Scott!- Disk usage is: ${r.status}.",
      alias: "disk-usage-${r.status}",
      description: "",
      priority: "P3",
      responders: ["user:john@example.com", "team:itcrowd"],
      tags: [],
      entity: "my-lab",
      actions: [],
      details: "{}",
      visibleTo: []
    })
  )()
```

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
