---
title: json.encode() function
description: >
  `json.encode()` converts a value into JSON bytes.
menu:
  flux_v0_ref:
    name: json.encode
    parent: json
    identifier: json/encode
weight: 101
flux/v0/tags: [type-conversions]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/json/json.flux#L38-L38

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`json.encode()` converts a value into JSON bytes.

This function encodes Flux types as follows:

- **time** values in [RFC3339](/influxdb/cloud/reference/glossary/#rfc3339-timestamp) format
- **duration** values in number of milliseconds since the Unix epoch
- **regexp** values as their string representation
- **bytes** values as base64-encoded strings
- **function** values are not encoded and produce an error

##### Function type signature

```js
(v: A) => bytes
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to convert.




## Examples

### Encode a value as JSON bytes

```js
import "json"

jsonData = {foo: "bar", baz: 123, quz: [4, 5, 6]}

json.encode(
    v: jsonData,
)// Returns [123 34 98 97 122 34 58 49 50 51 44 34 102 111 111 34 58 34 98 97 114 34 44 34 113 117 122 34 58 91 52 44 53 44 54 93 125]


```

