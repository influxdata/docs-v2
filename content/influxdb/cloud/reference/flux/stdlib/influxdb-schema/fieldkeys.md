---
title: schema.fieldKeys() function
description: The `schema.fieldKeys()` function returns field keys in a bucket.
menu:
  influxdb_cloud_ref:
    name: schema.fieldKeys
    parent: InfluxDB schema
weight: 301
influxdb/v2.0/tags: [fields]
aliases:
  - /influxdb/cloud/reference/flux/functions/influxdb-v1/fieldkeys
related:
  - /influxdb/cloud/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-field-keys, SHOW FIELD KEYS in InfluxQL
introduced: 0.88.0
---

The `schema.fieldKeys()` function returns [field keys](/influxdb/cloud/reference/glossary/#field-key) in a bucket.
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
Absolute start times are defined using [time values](/influxdb/cloud/reference/flux/language/types/#time-types).

_**Data type:** Duration_

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
[schema.tagValues](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/tagvalues/)_
