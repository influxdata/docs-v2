---
title: schema.fieldKeys() function
description: The `schema.fieldKeys()` function returns field keys in a bucket.
menu:
  flux_0_x_ref:
    name: schema.fieldKeys
    parent: schema
weight: 301
flux/v0.x/tags: [metadata]
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/fieldkeys
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-schema/fieldkeys/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-schema/fieldkeys/
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-field-keys, SHOW FIELD KEYS in InfluxQL
introduced: 0.88.0
---

The `schema.fieldKeys()` function returns [field keys](/influxdb/v2.0/reference/glossary/#field-key) in a bucket.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/schema"

schema.fieldKeys(
  bucket: "example-bucket",
  predicate: (r) => true,
  start: -30d
)
```

## Parameters

### bucket {data-type="string"}
The bucket to list field keys from.

### predicate {data-type="function"}
The predicate function that filters field keys.
_Default is `(r) => true`._

### start {data-type="duration, time"}
The oldest time to include in results.
_Default is `-30d`._

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using [time values](/flux/v0.x/spec/types/#time-types).

## Examples
```js
import "influxdata/influxdb/schema"

schema.fieldKeys(bucket: "my-bucket")
```

## Function definition
```js
package schema

fieldKeys = (bucket, predicate=(r) => true, start=-30d) =>
  tagValues(bucket: bucket, tag: "_field", predicate: predicate, start: start)
```

_**Used functions:**
[schema.tagValues](/flux/v0.x/stdlib/influxdata/influxdb/schema/tagvalues/)_
