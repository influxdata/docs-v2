---
title: opsgenie.sendAlert() function
description: >
  `opsgenie.sendAlert()` sends an alert message to Opsgenie.
menu:
  flux_v0_ref:
    name: opsgenie.sendAlert
    parent: contrib/sranka/opsgenie
    identifier: contrib/sranka/opsgenie/sendAlert
weight: 301
flux/v0/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/opsgenie/opsgenie.flux#L78-L120

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`opsgenie.sendAlert()` sends an alert message to Opsgenie.



##### Function type signature

```js
(
    apiKey: string,
    message: string,
    ?actions: A,
    ?alias: string,
    ?description: string,
    ?details: B,
    ?entity: string,
    ?priority: string,
    ?responders: [string],
    ?tags: C,
    ?url: string,
    ?visibleTo: [string],
) => int where B: Stringable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### url

Opsgenie API URL. Defaults to `https://api.opsgenie.com/v2/alerts`.



### apiKey
({{< req >}})
(Required) Opsgenie API authorization key.



### message
({{< req >}})
(Required) Alert message text.
130 characters or less.



### alias

Opsgenie alias usee to de-deduplicate alerts.
250 characters or less.
Defaults to [message](/flux/v0/stdlib/contrib/sranka/opsgenie/sendalert/#message).



### description

Alert description. 15000 characters or less.



### priority

Opsgenie alert priority.

Valid values include:
- `P1`
- `P2`
- `P3` (default)
- `P4`
- `P5`

### responders

List of responder teams or users.
Use the `user: ` prefix for users and `teams: ` prefix for teams.



### tags

Alert tags.



### entity

Alert entity used to specify the alert domain.



### actions

List of actions available for the alert.



### details

Additional alert details. Must be a JSON-encoded map of key-value string pairs.



### visibleTo

List of teams and users the alert will be visible to without sending notifications.
Use the `user: ` prefix for users and `teams: ` prefix for teams.




## Examples

### Send the last reported status to a Opsgenie

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
    responders: ["user:john@example.com", "team:itcrowd"],
)

```

