---
title: dynamic.jsonParse() function
description: >
  `dynamic.jsonParse()` takes JSON data as bytes and returns dynamic values.
menu:
  flux_v0_ref:
    name: dynamic.jsonParse
    parent: experimental/dynamic
    identifier: experimental/dynamic/jsonParse
weight: 201
flux/v0.x/tags: [type-conversions]
introduced: 0.186.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/dynamic/dynamic.flux#L44-L44

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`dynamic.jsonParse()` takes JSON data as bytes and returns dynamic values.

JSON input is converted to dynamic-typed values which may be converted to
a statically typed value with `dynamic.asArray()` or casting functions in the `dynamic` package.

##### Function type signature

```js
(data: bytes) => dynamic
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### data
({{< req >}})
JSON data (as bytes) to parse.



