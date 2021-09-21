---
title: pagerduty.dedupKey() function
description: >
  The `pagerduty.dedupKey()` function uses the group key of an input table to
  generate and store a deduplication key in the `_pagerdutyDedupKey` column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/pagerduty/dedupkey/
  - /influxdb/v2.0/reference/flux/stdlib/pagerduty/dedupkey/
  - /influxdb/cloud/reference/flux/stdlib/pagerduty/dedupkey/
menu:
  flux_0_x_ref:
    name: pagerduty.dedupKey
    parent: pagerduty
weight: 202
introduced: 0.43.0
---

The `pagerduty.dedupKey()` function uses the group key of an input table to
generate and store a deduplication key in the `_pagerdutyDedupKey` column.
The function sorts, newline-concatenates, SHA256-hashes, and hex-encodes
the group key to create a unique deduplication key for each input table.

```js
import "pagerduty"

pagerduty.dedupKey(
  exclude: ["_start", "_stop", "_level"]
)
```

## Parameters

### exclude {data-type="array of strings"}
Group key columns to exclude when generating the deduplication key.
Default is `["_start", "_stop", "_level"]`.

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
