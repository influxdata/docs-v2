---
title: teams.message() function
description: >
  `teams.message()` sends a single message to a Microsoft Teams channel using an
  [incoming webhook](https://docs.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
menu:
  flux_v0_ref:
    name: teams.message
    parent: contrib/sranka/teams
    identifier: contrib/sranka/teams/message
weight: 301
flux/v0.x/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/teams/teams.flux#L55-L81

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`teams.message()` sends a single message to a Microsoft Teams channel using an
[incoming webhook](https://docs.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).



##### Function type signature

```js
(text: string, title: A, url: string, ?summary: string) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
Incoming webhook URL.



### title
({{< req >}})
Message card title.



### text
({{< req >}})
Message card text.



### summary

Message card summary.
Default is `""`.

If no summary is provided, Flux generates the summary from the message text.


## Examples

### Send the last reported status to a Microsoft Teams channel

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
    title: "Disk Usage",
    text: "Disk usage is: *${lastReported.status}*.",
    summary: "Disk usage is ${lastReported.status}",
)

```

