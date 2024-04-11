---
title: opsgenie.respondersToJSON() function
description: >
  `opsgenie.respondersToJSON()` converts an array of Opsgenie responder strings
  to a string-encoded JSON array that can be embedded in an alert message.
menu:
  flux_v0_ref:
    name: opsgenie.respondersToJSON
    parent: contrib/sranka/opsgenie
    identifier: contrib/sranka/opsgenie/respondersToJSON
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/opsgenie/opsgenie.flux#L23-L23

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`opsgenie.respondersToJSON()` converts an array of Opsgenie responder strings
to a string-encoded JSON array that can be embedded in an alert message.



##### Function type signature

```js
(v: [string]) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
(Required) Array of Opsgenie responder strings.
Responder strings must begin with
`user: `, `team: `, `escalation: `, or `schedule: `.



