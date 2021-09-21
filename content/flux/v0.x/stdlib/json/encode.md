---
title: json.encode() function
description: The `json.encode()` function converts a value into JSON bytes.
aliases:
  - /influxdb/v2.0/reference/flux/functions/json/encode/
  - /influxdb/v2.0/reference/flux/stdlib/json/encode/
  - /influxdb/cloud/reference/flux/stdlib/json/encode/
menu:
  flux_0_x_ref:
    name: json.encode
    parent: json
weight: 202
flux/v0.x/tags: [type-conversions]
introduced: 0.40.0
---

The `json.encode()` function converts a value into JSON bytes.

```js
import "json"

json.encode(v: "some value")
// Returns [34 115 111 109 101 32 118 97 108 117 101 34]
```

This function encodes [Flux types](/flux/v0.x/spec/types/) as follows:

- `time` values in [RFC3339](/influxdb/cloud/reference/glossary/#rfc3339-timestamp) format
- `duration` values in number of milliseconds since the epoch
- `regexp` values as their string representation
- `bytes` values as base64-encoded strings
- `function` values are not encoded and produce an error

## Parameters

### v {data-type="record, array, dict, string, bool, duration, int, uint, float, time"}
The value to convert.
