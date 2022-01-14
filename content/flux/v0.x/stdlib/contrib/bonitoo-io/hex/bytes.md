---
title: hex.bytes() function
description: >
  `hex.bytes()` converts a hexadecimal string to bytes.
menu:
  flux_0_x_ref:
    name: hex.bytes
    parent: hex
weight: 302
related:
  - /flux/v0.x/data-types/basic/bytes/
flux/v0.x/tags: [type-conversions]
---

`hex.bytes()` decodes a hexadecimal string and converts the decoded value to bytes.

```js
import "contrib/bonitoo-io/hex"

hex.bytes(v: "6869")

// Returns [104 105] (the bytes representation of "hi")
```

## Parameters

### v {data-type="string"}
Value to convert.

## Examples

#### Convert a hexadecimal string to bytes
```js
import "contrib/bonitoo-io/hex"

hex.bytes(v: "FF5733")

// Returns [255 87 51] (bytes)
```