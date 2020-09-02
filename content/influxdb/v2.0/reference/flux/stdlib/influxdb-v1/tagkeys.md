---
title: v1.tagKeys() function
description: The v1.tagKeys() function returns a list of tag keys for all series that match the predicate.
aliases:
  - /v2.0/reference/flux/functions/influxdb-v1/tagkeys/
menu:
  influxdb_2_0_ref:
    name: v1.tagKeys
    parent: InfluxDB v1
weight: 301
influxdb/v2.0/tags: [tags]
related:
  - /influxdb/v2.0/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/schema_exploration#show-tag-keys, SHOW TAG KEYS in InfluxQL
---

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
The bucket from which to list tag keys.

_**Data type:** String_

### predicate
The predicate function that filters tag keys.
_Defaults to `(r) => true`._

_**Data type:** Function_

### start
The oldest time to include in results.
_Defaults to `-30d`._

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using timestamps.

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
