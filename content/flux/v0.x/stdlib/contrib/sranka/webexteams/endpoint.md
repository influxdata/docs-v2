---
title: webexteams.endpoint() function
description: >
  `webexteams.endpoint()` returns a function that sends a message that includes data from input rows to a Webex room.
menu:
  flux_0_x_ref:
    name: webexteams.endpoint
    parent: contrib/sranka/webexteams
    identifier: contrib/sranka/webexteams/endpoint
weight: 301
tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/webexteams/webexteams.flux#L114-L135

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`webexteams.endpoint()` returns a function that sends a message that includes data from input rows to a Webex room.



##### Function type signature

```js
(
    token: string,
    ?url: string,
) => (
    mapFn: (r: A) => {B with text: E, roomId: D, markdown: C},
) => (<-tables: stream[A]) => stream[{A with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### url

Base URL of Webex API endpoint (without a trailing slash).
Default is `https://webexapis.com`.



### token
({{< req >}})
[Webex API access token](https://developer.webex.com/docs/api/getting-started).



