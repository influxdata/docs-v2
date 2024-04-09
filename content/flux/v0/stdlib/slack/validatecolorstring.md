---
title: slack.validateColorString() function
description: >
  `slack.validateColorString()` ensures a string contains a valid hex color code.
menu:
  flux_v0_ref:
    name: slack.validateColorString
    parent: slack
    identifier: slack/validateColorString
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/slack/slack.flux#L26-L26

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`slack.validateColorString()` ensures a string contains a valid hex color code.



##### Function type signature

```js
(color: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### color
({{< req >}})
Hex color code.




## Examples

### Validate a hex color code string

```js
import "slack"

slack.validateColorString(color: "#fff")

```

