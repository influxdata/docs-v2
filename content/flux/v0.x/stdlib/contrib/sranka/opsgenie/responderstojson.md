---
title: opsgenie.respondersToJSON() function
description: >
  The `opsgenie.respondersToJSON()` function converts an array of
  [Opsgenie responder](https://docs.opsgenie.com/docs/alert-recipients-and-teams)
  strings to a string-encoded JSON array that can be embedded in an alert message.
menu:
  flux_0_x_ref:
    name: opsgenie.respondersToJSON
    parent: opsgenie
weight: 301
introduced: 0.84.0
---

The `opsgenie.respondersToJSON()` function converts an array of
[Opsgenie responder](https://docs.opsgenie.com/docs/alert-recipients-and-teams)
strings to a string-encoded JSON array that can be embedded in an alert message.

```js
import "contrib/sranka/opsgenie"

opsgenie.respondersToJSON(
  v: [
    "user:example-user",
    "team:example-team",
    "escalation:example-escalation",
    "schedule:example-schedule"
  ]
)

// Returns "[
//   {"type":"user","username":"example-user"},
//   {"type":"team","name":"example-team"},
//   {"type":"escalation","name":"example-escalation"},
//   {"type":"schedule","name":"example-schedule"}
// ]"
```

## Parameters

### v {data-type="array of strings"}
({{< req >}}) Array of Opsgenie responder strings.
Responder strings must begin with `user:`, `team:`, `escalation:`, or `schedule:`.

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
