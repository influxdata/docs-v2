---
title: v1.fieldKeys() function
description: The `v1.fieldKeys()` function returns field keys in a bucket.
menu:
  influxdb_2_0_ref:
    name: v1.fieldKeys
    parent: InfluxDB v1
weight: 301
influxdb/v2.0/tags: [fields]
related:
  - /influxdb/v2.0/query-data/flux/explore-schema/
  - https://docs.influxdata.com/influxdb/latest/query_language/schema_exploration#show-field-keys, SHOW FIELD KEYS in InfluxQL
---

The `v1.fieldKeys()` function returns field keys in a bucket.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/v1"

v1.fieldKeys(
  bucket: "example-bucket",
  predicate: (r) => true,
  start: -30d
)
```

## Parameters

### bucket
The bucket to list field keys from.

_**Data type:** String_

### predicate
The predicate function that filters field keys.
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

v1.fieldKeys(bucket: "my-bucket")
```

## Function definition
```js
package v1

fieldKeys = (bucket, predicate=(r) => true, start=-30d) =>
  tagValues(bucket: bucket, tag: "_field", predicate: predicate, start: start)
```

_**Used functions:**
[v1.tagValues](/v2.0/reference/flux/stdlib/influxdb-v1/tagvalues/)_
