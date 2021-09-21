---
title: toDuration() function
description: The `toDuration()` function converts all values in the `_value` column to durations.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/toduration
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/toduration/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/toduration/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/toduration/
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
related:
  - /flux/v0.x/data-types/basic/duration/
  - /flux/v0.x/stdlib/universe/duration/
introduced: 0.7.0
removed: 0.37.0
---

{{% warn %}}
**`toDuration()` was removed in Flux 0.37.**
{{% /warn %}}

The `toDuration()` function converts all values in the `_value` column to durations.

```js
toDuration()
```

_**Supported data types:** String | Integer | Uinteger_

{{% note %}}
`duration()` assumes **numeric** input values are **nanoseconds**.
**String** input values must use [duration literal representation](/flux/v0.x/spec/lexical-elements/#duration-literals).
{{% /note %}}

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).
