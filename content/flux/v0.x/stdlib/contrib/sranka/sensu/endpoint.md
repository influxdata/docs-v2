---
title: sensu.endpoint() function
description: >
  The `sensu.endpoint()` function sends an event to the
  [Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event)
  using data from table rows.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/sensu/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/sensu/endpoint/
menu:
  flux_0_x_ref:
    name: sensu.endpoint
    parent: sensu
weight: 301
related:
  - https://docs.sensu.io/sensu-go/latest/api/events/, Sensu Events API
  - https://docs.sensu.io/sensu-go/latest/api/apikeys/, Sensu APIKeys API
  - https://docs.sensu.io/sensu-go/latest/reference/handlers/, Sensu handlers
flux/v0.x/tags: [notification endpoints]
introduced: 0.90.0
---

The `sensu.endpoint()` function sends an event to the
[Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event)
using data from table rows.

```js
import "contrib/sranka/sensu"

sensu.endpoint(
    url: "http://localhost:8080",
    apiKey: "mYSuP3rs3cREtApIK3Y",
    handlers: [],
    namespace: "default",
    entityName: "influxdb",
)
```

## Parameters

### url {data-type="string"}
({{< req >}})
Base URL of [Sensu API](https://docs.sensu.io/sensu-go/latest/migrate/#architecture)
**without a trailing slash**. Example: `http://localhost:8080`.

### apiKey {data-type="string"}
({{< req >}})
Sensu [API Key](https://docs.sensu.io/sensu-go/latest/operations/control-access/).

### handlers {data-type="array of strings"}
[Sensu handlers](https://docs.sensu.io/sensu-go/latest/reference/handlers/) to execute.
Default is `[]`.

### namespace {data-type="string"}
[Sensu namespace](https://docs.sensu.io/sensu-go/latest/reference/rbac/).
Default is `default`.

### entityName {data-type="string"}
Event source.
Use alphanumeric characters, underscores (`_`), periods (`.`), and hyphens (`-`).
All other characters are replaced with an underscore.
Default is `influxdb`.

## Usage
`sensu.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
A function that builds the object used to generate the POST request.
Requires an `r` parameter.

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
endpoint = sensu.endpoint(url: "http://localhost:8080", apiKey: apiKey)

crit_statuses =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_statuses
    |> endpoint(mapFn: (r) => ({checkName: "critStatus", text: "Status is critical", status: 2}))()
```
