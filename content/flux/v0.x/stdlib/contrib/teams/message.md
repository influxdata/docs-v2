---
title: teams.message() function
description: >
  The `teams.message()` function sends a single message to a Microsoft Teams channel using
  an [incoming webhook](https://docs.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/teams/message/
  - /influxdb/cloud/reference/flux/stdlib/contrib/teams/message/
menu:
  flux_0_x_ref:
    name: teams.message
    parent: Teams
weight: 202
introduced: 0.70.0
---

The `teams.message()` function sends a single message to a Microsoft Teams channel using
an [incoming webhook](https://docs.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).

_**Function type:** Output_

```js
import "contrib/sranka/teams"

teams.message(
  url: "https://outlook.office.com/webhook/example-webhook",
  title: "Example message title",
  text: "Example message text",
  summary: "",
)
```

## Parameters

### url
Incoming webhook URL.

_**Data type:** String_

### title
Message card title.

_**Data type:** String_

### text
Message card text.

_**Data type:** String_

### summary
Message card summary.
Default is `""`.
If no summary is provided, Flux generates the summary from the message text.

_**Data type:** String_

## Examples

##### Send the last reported status to a Microsoft Teams channel
```js
import "contrib/sranka/teams"

lastReported =
  from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "statuses")
    |> last()
    |> findRecord(fn: (key) => true, idx: 0)

teams.message(
  url: "https://outlook.office.com/webhook/example-webhook",
  title: "Disk Usage"
  text: "Disk usage is: *${lastReported.status}*.",
  summary: "Disk usage is ${lastReported.status}"
)
```

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
