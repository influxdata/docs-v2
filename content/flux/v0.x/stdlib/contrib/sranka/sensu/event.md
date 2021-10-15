---
title: sensu.event() function
description: >
  The `sensu.event()` function sends a single event to the
  [Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event).
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/sensu/event/
  - /influxdb/cloud/reference/flux/stdlib/contrib/sensu/event/
flux/v0.x/tags: [single notification]
menu:
  flux_0_x_ref:
    name: sensu.event
    parent: sensu
weight: 301
related:
  - https://docs.sensu.io/sensu-go/latest/api/events/, Sensu Events API
  - https://docs.sensu.io/sensu-go/latest/api/apikeys/, Sensu APIKeys API
  - https://docs.sensu.io/sensu-go/latest/reference/handlers/, Sensu handlers
introduced: 0.90.0
---

The `sensu.event()` function sends a single event to the
[Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event).

```js
import "contrib/sranka/sensu"

sensu.event(
  url: "http://localhost:8080",
  apiKey: "mYSuP3rs3cREtApIK3Y",
  checkName: "checkName",
  text: "Event output text",
  handlers: [],
  status: 0,
  state: "passing",
  namespace: "default",
  entityName: "influxdb"
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

### checkName {data-type="string"}
({{< req >}})
Check name.
Use alphanumeric characters, underscores (`_`), periods (`.`), and hyphens (`-`).
All other characters are replaced with an underscore.

### text {data-type="string"}
({{< req >}})
Event text.
Mapped to `output` in the Sensu Events API request.

### handlers {data-type="array of strings"}
[Sensu handlers](https://docs.sensu.io/sensu-go/latest/reference/handlers/) to execute.
Default is `[]`.

### status {data-type="int"}
Event status code that indicates [state](#state).
Default is `0`.

| Status code     | State                   |
|:-----------     |:-----                   |
| `0`             | OK                      |
| `1`             | WARNING                 |
| `2`             | CRITICAL                |
| Any other value | UNKNOWN or custom state |

### state {data-type="string"}
Event state.
Default is `"passing"` for `0` [status](#status) and `"failing"` for other statuses.

The following values are accepted:

- `"failing"`
- `"passing"`
- `"flapping"`

### namespace {data-type="string"}
[Sensu namespace](https://docs.sensu.io/sensu-go/latest/reference/rbac/).
Default is `"default"`.

### entityName {data-type="string"}
Event source.
Use alphanumeric characters, underscores (`_`), periods (`.`), and hyphens (`-`).
All other characters are replaced with an underscore.
Default is `influxdb`.

## Examples

##### Send the last reported status to Sensu
```js
import "influxdata/influxdb/secrets"
import "contrib/sranka/sensu"

apiKey = secrets.get(key: "SENSU_API_KEY")

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "statuses")
    |> last()
    |> findRecord(fn: (key) => true, idx: 0)

    sensu.event(
      url: "http://localhost:8080",
      apiKey: apiKey,
      checkName: "diskUsage",
      text: "Disk usage is **${lastReported.status}**.",
    )
```
