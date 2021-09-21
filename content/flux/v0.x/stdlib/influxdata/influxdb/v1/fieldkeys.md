---
title: v1.fieldKeys() function
description: The `v1.fieldKeys()` function returns field keys in a bucket.
menu:
  flux_0_x_ref:
    name: v1.fieldKeys
    parent: v1
weight: 301
flux/v0.x/tags: [metadata]
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/fieldkeys
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/fieldkeys/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/fieldkeys/
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-field-keys, SHOW FIELD KEYS in InfluxQL
introduced: 0.68.0
deprecated: 0.88.0
---

{{% warn %}}
`v1.fieldKeys()` was deprecated in **Flux v0.88.0** in favor of
[`schema.fieldKeys()`](/flux/v0.x/stdlib/influxdata/influxdb/schema/fieldkeys/).
{{% /warn %}}

The `v1.fieldKeys()` function returns [field keys](/{{< latest "influxdb" >}}/reference/glossary/#field-key) in a bucket.
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
[v1.tagValues]((/flux/v0.x/stdlib/influxdata/influxdb/v1/tagvalues/)_
