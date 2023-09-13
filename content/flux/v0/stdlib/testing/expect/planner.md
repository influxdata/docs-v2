---
title: expect.planner() function
description: >
  `expect.planner()` will cause the present testcase to
  expect the given planner rules will be invoked
  exactly as many times as the number given.
menu:
  flux_v0_ref:
    name: expect.planner
    parent: testing/expect
    identifier: testing/expect/planner
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/expect/expect.flux#L19-L19

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`expect.planner()` will cause the present testcase to
expect the given planner rules will be invoked
exactly as many times as the number given.

The key is the name of the planner rule.

##### Function type signature

```js
(rules: [string:int]) => {}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### rules
({{< req >}})
Mapping of rules names to expected counts.



