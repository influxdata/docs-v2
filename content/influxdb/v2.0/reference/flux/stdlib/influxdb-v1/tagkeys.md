---
title: v1.tagKeys() function
description: The v1.tagKeys() function returns a list of tag keys for all series that match the predicate.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/tagkeys/
menu:
  influxdb_2_0_ref:
    name: v1.tagKeys
    parent: InfluxDB v1
weight: 301
influxdb/v2.0/tags: [tags]
related:
  - /influxdb/v2.0/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-tag-keys, SHOW TAG KEYS in InfluxQL
introduced: 0.16.0
deprecated: 0.88.0
---

{{% warn %}}
`v1.tagkeys()` was deprecated in **Flux v0.88.0** in favor of
[`schema.tagkeys()`](/influxdb/v2.0/reference/flux/stdlib/influxdb-schema/tagkeys/).
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

### bucket
Bucket to return tag keys from.

_**Data type:** String_

### predicate
Predicate function that filters tag keys.
_Defaults to `(r) => true`._

_**Data type:** Function_

### start
Oldest time to include in results.
_Defaults to `-30d`._

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using [time values](/influxdb/v2.0/reference/flux/language/types/#time-types).

_**Data type:** Duration_

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
[from](/influxdb/v2.0/reference/flux/stdlib/built-in/inputs/from/),
[range](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/range/),
[filter](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/filter/),
[keys](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/keys/),
[keep](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/keep/),
[distinct](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/distinct/)_
