---
title: sensu.event() function
description: >
  The `sensu.event()` function sends a single event to the
  [Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event).
menu:
  influxdb_cloud_ref:
    name: sensu.event
    parent: Sensu
weight: 202
related:
  - https://docs.sensu.io/sensu-go/latest/api/events/, Sensu Events API
  - https://docs.sensu.io/sensu-go/latest/api/apikeys/, Sensu APIKeys API
  - https://docs.sensu.io/sensu-go/latest/reference/handlers/, Sensu handlers
---

The `sensu.event()` function sends a single event to the
[Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event).

_**Function type:** Output_

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

### url
<span class="req">Required</span>
Base URL of [Sensu API](https://docs.sensu.io/sensu-go/latest/migrate/#architecture)
**without a trailing slash**. Example: `http://localhost:8080`.

_**Data type:** String_

### apiKey
<span class="req">Required</span>
Sensu [API Key](https://docs.sensu.io/sensu-go/latest/operations/control-access/).

_**Data type:** String_

### checkName
<span class="req">Required</span>
Check name.
Use alphanumeric characters, underscores (`_`), periods (`.`), and hyphens (`-`).
All other characters are replaced with an underscore.

_**Data type:** String_

### text
<span class="req">Required</span>
Event text.
Mapped to `output` in the Sensu Events API request.

_**Data type:** String_

### handlers
[Sensu handlers](https://docs.sensu.io/sensu-go/latest/reference/handlers/) to execute.
Default is `[]`.

_**Data type:** Array of strings_

### status
Event status code that indicates [state](#state).
Default is `0`.

_**Data type:** Integer_

| Status code     | State                   |
|:-----------     |:-----                   |
| `0`             | OK                      |
| `1`             | WARNING                 |
| `2`             | CRITICAL                |
| Any other value | UNKNOWN or custom state |

### state
Event state.
Default is `"passing"` for `0` [status](#status) and `"failing"` for other statuses.

_**Data type:** string_

The following values are accepted:

- `"failing"`
- `"passing"`
- `"flapping"`

### namespace
[Sensu namespace](https://docs.sensu.io/sensu-go/latest/reference/rbac/).
Default is `"default"`.

_**Data type:** String_

### entityName
Event source.
Use alphanumeric characters, underscores (`_`), periods (`.`), and hyphens (`-`).
All other characters are replaced with an underscore.
Default is `influxdb`.

_**Data type:** String_

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

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
