---
title: Flux Microsoft Teams package
list_title: Microsoft Teams package
description: >
  The Flux Microsoft Teams package provides functions for sending messages to a
  [Microsoft Teams](https://www.microsoft.com/microsoft-365/microsoft-teams/group-chat-software)
  channel using an [incoming webhook](https://docs.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
  Import the `contrib/sranka/teams` package.
menu:
  influxdb_cloud_ref:
    name: Teams
    parent: Contributed
weight: 202
influxdb/v2.0/tags: [functions, teams, microsoft, package]
---

The Flux Microsoft Teams package provides functions for sending messages to a
[Microsoft Teams](https://www.microsoft.com/microsoft-365/microsoft-teams/group-chat-software)
channel using an [incoming webhook](https://docs.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
Import the `contrib/sranka/teams` package:

```js
import "contrib/sranka/teams"
```

{{< children type="functions" show="pages" >}}

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
