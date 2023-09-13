---
title: teams package
description: >
  The `teams` package (Microsoft Teams) provides functions
  for sending messages to a [Microsoft Teams](https://www.microsoft.com/microsoft-365/microsoft-teams/group-chat-software)
  channel using an [incoming webhook](https://docs.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
menu:
  flux_v0_ref:
    name: teams 
    parent: contrib/sranka
    identifier: contrib/sranka/teams
weight: 31
cascade:

  introduced: 0.70.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/teams/teams.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `teams` package (Microsoft Teams) provides functions
for sending messages to a [Microsoft Teams](https://www.microsoft.com/microsoft-365/microsoft-teams/group-chat-software)
channel using an [incoming webhook](https://docs.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
Import the `contrib/sranka/teams` package:

```js
import "contrib/sranka/teams"
```



## Options

```js
option teams.summaryCutoff = 70
```
 
### summaryCutoff

`summaryCutoff` is the limit for message summaries.
Default is `70`.




## Functions

{{< children type="functions" show="pages" >}}
