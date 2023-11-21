---
title: sensu.event() function
description: >
  `sensu.event()` sends a single event to the [Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event).
menu:
  flux_v0_ref:
    name: sensu.event
    parent: contrib/sranka/sensu
    identifier: contrib/sranka/sensu/event
weight: 301
flux/v0/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/sensu/sensu.flux#L109-L145

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sensu.event()` sends a single event to the [Sensu Events API](https://docs.sensu.io/sensu-go/latest/api/events/#create-a-new-event).



##### Function type signature

```js
(
    apiKey: string,
    checkName: string,
    text: A,
    url: string,
    ?entityName: string,
    ?handlers: B,
    ?namespace: string,
    ?state: string,
    ?status: C,
) => int where C: Equatable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
Base URL of [Sensu API](https://docs.sensu.io/sensu-go/latest/migrate/#architecture)
without a trailing slash.

Example: `http://localhost:8080`

### apiKey
({{< req >}})
Sensu [API Key](https://docs.sensu.io/sensu-go/latest/operations/control-access/).



### checkName
({{< req >}})
Check name.

Use alphanumeric characters, underscores (`_`), periods (`.`), and hyphens (`-`).
All other characters are replaced with an underscore.

### text
({{< req >}})
Event text.

Mapped to `output` in the Sensu Events API request.

### handlers

Sensu handlers to execute. Default is `[]`.



### status

Event status code that indicates [state](/flux/v0/stdlib/contrib/sranka/sensu/event/#state).
Default is `0`.

| Status code     | State                   |
| :-------------- | :---------------------- |
| 0               | OK                      |
| 1               | WARNING                 |
| 2               | CRITICAL                |
| Any other value | UNKNOWN or custom state |

### state

Event state.
Default is `"passing"` for `0` [status](/flux/v0/stdlib/contrib/sranka/sensu/event/#status) and `"failing"` for other statuses.

**Accepted values**:
- `"failing"`
- `"passing"`
- `"flapping"`

### namespace

[Sensu namespace](https://docs.sensu.io/sensu-go/latest/reference/rbac/).
Default is `"default"`.



### entityName

Event source.
Default is `influxdb`.

Use alphanumeric characters, underscores (`_`), periods (`.`), and hyphens (`-`).
All other characters are replaced with an underscore.


## Examples

### Send the last reported status to Sensu

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

