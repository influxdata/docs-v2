---
title: schema.tagValues() function
description: The `schema.tagValues()` function returns a list unique values for a given tag.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-schema/tagvalues/
menu:
  influxdb_2_0_ref:
    name: schema.tagValues
    parent: InfluxDB Schema
weight: 301
influxdb/v2.0/tags: [tags]
related:
  - /influxdb/v2.0/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/schema_exploration#show-tag-values, SHOW TAG VALUES in InfluxQL
---

The `schema.tagValues()` function returns a list unique values for a given tag.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/schema"

schema.tagValues(
  bucket: "example-bucket",
  tag: "host",
  predicate: (r) => true,
  start: -30d
)
```

## Parameters

### bucket
The bucket from which to list tag values.

_**Data type:** String_

### tag
The tag for which to return unique values.

_**Data type:** String_

### predicate
The predicate function that filters tag values.
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
import "influxdata/influxdb/schema"

schema.tagValues(
  bucket: "my-bucket",
  tag: "host",
)
```

## Function definition
```js
package schema

tagValues = (bucket, tag, predicate=(r) => true, start=-30d) =>
  from(bucket: bucket)
    |> range(start: start)
    |> filter(fn: predicate)
    |> group(columns: [tag])
    |> distinct(column: tag)
    |> keep(columns: ["_value"])
```

_**Used functions:**
[from](/influxdb/v2.0/reference/flux/stdlib/built-in/inputs/from/),
[range](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/range/),
[filter](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/filter/),
[group](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/group/),
[distinct](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/distinct/),
[keep](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/keep/)_
