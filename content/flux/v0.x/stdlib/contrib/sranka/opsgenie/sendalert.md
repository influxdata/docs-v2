---
title: opsgenie.sendAlert() function
description: >
  The `opsgenie.sendAlert()` function sends an alert message to Opsgenie.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/opsgenie/sendalert/
  - /influxdb/cloud/reference/flux/stdlib/contrib/opsgenie/sendalert/
menu:
  flux_0_x_ref:
    name: opsgenie.sendAlert
    parent: opsgenie
weight: 301
introduced: 0.84.0
---

The `opsgenie.sendAlert()` function sends an alert message to Opsgenie.

_**Function type:** Output_

```js
import "contrib/sranka/opsgenie"

opsgenie.sendAlert(
  url: "https://api.opsgenie.com/v2/alerts",
  apiKey: "YoUrSup3R5ecR37AuThK3y",
  message: "Example message",
  alias: "Example alias",
  description: "Example description",
  priority: "P3",
  responders: ["user:john@example.com", "team:itcrowd"],
  tags: ["tag1", "tag2"],
  entity: "example-entity",
  actions: ["action1", "action2"],
  details: "{}",
  visibleTo: []
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

### message
({{< req >}})
Alert message text.
130 characters or less.

_**Data type:** String_

### alias
Opsgenie alias usee to de-deduplicate alerts.
250 characters or less.
Defaults to [message](#message).

_**Data type:** String_

### description
Alert description.
15000 characters or less.

_**Data type:** String_

### priority
Opsgenie [alert priority](https://docs.opsgenie.com/docs/alert-priority-settings).
Valid values include:

- `P1`
- `P2`
- `P3` _(default)_
- `P4`
- `P5`

_**Data type:** String_

### responders
List of responder teams or users.
Use the `user:` prefix for users and `teams:` prefix for teams.

_**Data type:** Array of strings_

### tags
Alert tags.

_**Data type:** Array of strings_

### entity
Alert entity used to specify the alert domain.

_**Data type:** String_

### actions
List of actions available for the alert.

_**Data type:** Array of strings_

### details
Additional alert details.
Must be a JSON-encoded map of key-value string pairs.

_**Data type:** String_

### visibleTo
List of teams and users the alert will be visible to without sending notifications.
Use the `user:` prefix for users and `teams:` prefix for teams.

_**Data type:** Array of strings_

## Examples

##### Send the last reported status to a Opsgenie
```js
import "influxdata/influxdb/secrets"
import "contrib/sranka/opsgenie"

apiKey = secrets.get(key: "OPSGENIE_APIKEY")

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "statuses")
    |> last()
    |> findRecord(fn: (key) => true, idx: 0)

    opsgenie.sendAlert(
      apiKey: apiKey,
      message: "Disk usage is: ${lastReported.status}.",
      alias: "example-disk-usage",
      responders: ["user:john@example.com", "team:itcrowd"]
    )
```

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
