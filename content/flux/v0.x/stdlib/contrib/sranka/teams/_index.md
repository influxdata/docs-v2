---
title: Flux Microsoft Teams package
list_title: teams package
description: >
  The Flux `teams` (Microsoft Teams) package provides functions for sending messages to a
  [Microsoft Teams](https://www.microsoft.com/microsoft-365/microsoft-teams/group-chat-software)
  channel using an [incoming webhook](https://docs.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
  Import the `contrib/sranka/teams` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/teams/
  - /influxdb/cloud/reference/flux/stdlib/contrib/teams/
menu:
  flux_0_x_ref:
    name: teams
    parent: sranka
weight: 201
flux/v0.x/tags: [functions, teams, microsoft, package]
introduced: 0.70.0
---

The Flux `teams` (Microsoft Teams) package provides functions for sending messages to a
[Microsoft Teams](https://www.microsoft.com/microsoft-365/microsoft-teams/group-chat-software)
channel using an [incoming webhook](https://docs.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
Import the `contrib/sranka/teams` package:

```js
import "contrib/sranka/teams"
```

## Options
The `contrib/sranka/teams` package provides the following options:

```js
import "contib/sranka/teams"

option teams.summaryCutoff = 70
```

### summaryCutoff {data-type="int"}
Character limit for message summaries. Default is `70`.

## Functions

{{< children type="functions" show="pages" >}}
