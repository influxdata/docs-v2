---
title: sensu.endpoint() function
description: >
  The `sensu.endpoint()` function sends an event to the
  [Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event)
  using data from table rows.
menu:
  influxdb_cloud_ref:
    name: sensu.endpoint
    parent: Sensu
weight: 202
related:
  - https://docs.sensu.io/sensu-go/latest/api/events/, Sensu Events API
  - https://docs.sensu.io/sensu-go/latest/api/apikeys/, Sensu APIKeys API
  - https://docs.sensu.io/sensu-go/latest/reference/handlers/, Sensu handlers
---

The `sensu.endpoint()` function sends an event to the
[Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event)
using data from table rows.

_**Function type:** Output_

```js
import "contrib/sranka/sensu"

sensu.endpoint(
  url: "http://localhost:8080",
  apiKey: "mYSuP3rs3cREtApIK3Y",
  handlers: [],
  namespace: "default",
  entityName: "influxdb"
)
```

## Parameters

### url
({{< req >}})
Base URL of [Sensu API](https://docs.sensu.io/sensu-go/latest/migrate/#architecture)
**without a trailing slash**. Example: `http://localhost:8080`.

_**Data type:** String_

### apiKey
({{< req >}})
Sensu [API Key](https://docs.sensu.io/sensu-go/latest/operations/control-access/).

_**Data type:** String_

### handlers
[Sensu handlers](https://docs.sensu.io/sensu-go/latest/reference/handlers/) to execute.
Default is `[]`.

_**Data type:** Array of strings_

### namespace
[Sensu namespace](https://docs.sensu.io/sensu-go/latest/reference/rbac/).
Default is `default`.

_**Data type:** String_

### entityName
Event source.
Use alphanumeric characters, underscores (`_`), periods (`.`), and hyphens (`-`).
All other characters are replaced with an underscore.
Default is `influxdb`.

_**Data type:** String_

## Usage
`sensu.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

_**Data type:** Function_

`mapFn` accepts a table row (`r`) and returns an object that must include the
following fields:

- `checkName`
- `text`
- `status`

_For more information, see [`sensu.event()` parameters](/v2.0/reference/flux/stdlib/contrib/sensu/event/#parameters)._

## Examples

##### Send critical status events to Sensu
```js
import "influxdata/influxdb/secrets"
import "contrib/sranka/sensu"

token = secrets.get(key: "TELEGRAM_TOKEN")
endpoint = sensu.endpoint(
  url: "http://localhost:8080",
  apiKey: apiKey
)

crit_statuses = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_statuses
  |> endpoint(mapFn: (r) => ({
      checkName: "critStatus",
      text: "Status is critical",
      status: 2
    })
  )()
```

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}