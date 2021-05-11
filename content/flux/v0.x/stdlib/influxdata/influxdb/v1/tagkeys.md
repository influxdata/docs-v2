---
title: v1.tagKeys() function
description: The v1.tagKeys() function returns a list of tag keys for all series that match the predicate.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/tagkeys/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/tagkeys/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/tagkeys/
menu:
  flux_0_x_ref:
    name: v1.tagKeys
    parent: v1
weight: 301
flux/v0.x/tags: [metadata]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-tag-keys, SHOW TAG KEYS in InfluxQL
introduced: 0.16.0
deprecated: 0.88.0
---

{{% warn %}}
`v1.tagkeys()` was deprecated in **Flux v0.88.0** in favor of
[`schema.tagkeys()`](/flux/v0.x/stdlib/influxdata/influxdb/schema/tagkeys/).
{{% /warn %}}

The `v1.tagKeys()` function returns a list of tag keys for all series that match the [`predicate`](#predicate).
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/v1"

v1.tagKeys(
  bucket: "example-bucket",
  predicate: (r) => true,
  start: -30d
)
```

## Parameters

### bucket {data-type="string"}
Bucket to return tag keys from.

### predicate {data-type="function"}
Predicate function that filters tag keys.
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

v1.tagKeys(bucket: "my-bucket")
```


## Function definition
```js
package v1

tagKeys = (bucket, predicate=(r) => true, start=-30d) =>
  from(bucket: bucket)
    |> range(start: start)
    |> filter(fn: predicate)
    |> keys()
    |> keep(columns: ["_value"])
    |> distinct()
```

_**Used functions:**
[from](/flux/v0.x/stdlib/universe/from/),
[range](/flux/v0.x/stdlib/universe/range/),
[filter](/flux/v0.x/stdlib/universe/filter/),
[keys](/flux/v0.x/stdlib/universe/keys/),
[keep](/flux/v0.x/stdlib/universe/keep/),
[distinct](/flux/v0.x/stdlib/universe/distinct/)_
