---
title: pagerduty.dedupKey() function
description: >
  The `pagerduty.dedupKey()` function uses the group key of an input table to
  generate and store a deduplication key in the `_pagerdutyDedupKey` column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/pagerduty/dedupkey/
menu:
  influxdb_2_0_ref:
    name: pagerduty.dedupKey
    parent: PagerDuty
weight: 202
---

The `pagerduty.dedupKey()` function uses the group key of an input table to
generate and store a deduplication key in the `_pagerdutyDedupKey` column.
The function sorts, newline-concatenates, SHA256-hashes, and hex-encodes
the group key to create a unique deduplication key for each input table.

_**Function type:** Transformation_

```js
import "pagerduty"

pagerduty.dedupKey(
  exclude: ["_start", "_stop", "_level"]
)
```

## Parameters

### exclude
Exclude group key columns when generating the deduplication key.
Default is `["_start", "_stop", "_level"]`.

_**Data type:** Array of strings_

## Examples

##### Add a PagerDuty deduplication key to output data
```js
import "pagerduty"

from(bucket: "default")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "mem")
  |> pagerduty.dedupKey()
```

{{% expand "View function updates" %}}
#### v1.18.0
- Add `exclude` parameter to exclude group key columns when generating the deduplication key.
{{% /expand %}}
