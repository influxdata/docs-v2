---
title: v1.tagValues() function
description: The `v1.tagValues()` function returns a list unique values for a given tag.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/tagvalues/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/tagvalues/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/tagvalues/
menu:
  flux_0_x_ref:
    name: v1.tagValues
    parent: v1
weight: 301
flux/v0.x/tags: [metadata]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-tag-values, SHOW TAG VALUES in InfluxQL
introduced: 0.16.0
deprecated: 0.88.0
---

{{% warn %}}
`v1.tagValues()` was deprecated in **Flux v0.88.0** in favor of
[`schema.tagValues()`](/flux/v0.x/stdlib/influxdata/influxdb/schema/tagvalues/).
{{% /warn %}}

The `v1.tagValues()` function returns a list of unique values for a given tag.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/v1"

v1.tagValues(
    bucket: "example-bucket",
    tag: "host",
    predicate: (r) => true,
    start: -30d,
)
```

## Parameters

### bucket {data-type="string"}
Bucket to return unique tag values from.

### tag {data-type="string"}
Tag to return unique values from.

### predicate {data-type="function"}
Predicate function that filters tag values.
_Default is `(r) => true`._

### start {data-type="duration, time"}
Oldest time to include in results.
_Default is `-30d`._

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using [time values](/flux/v0.x/spec/types/#time-types).

## Examples
```js
import "influxdata/influxdb/v1"

v1.tagValues(bucket: "my-bucket", tag: "host")
```
