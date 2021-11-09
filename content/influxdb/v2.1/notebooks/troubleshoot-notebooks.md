---
title: Troubleshoot notebooks
description: Common issues with the notebooks feature.
weight: 106
influxdb/v2.1/tags: [notebooks]
menu:
  influxdb_2_1:
    name: Troubleshoot notebooks
    parent: Notebooks
---

### No measurements appear in my bucket even though there's data in it.
Try changing the time range. You might have measurements prior to the time range you selected. For example, if the selected time range is `Past 1h` and the last write happened 16 hours ago, you'd need to change the time range to `Past 24h` (or more) to see your data.

### "No bucket exists" error message appears.
This error appears when the Buckets API endpoint returns a list of bucket and you don’t have access to that bucket. Verify that you have access permissions to the bucket that you're trying to query or write to.

### Metric selector crashes.
This can occur with high-cardinality buckets when there's too much data for the browser. To decrease the amount of data in your bucket, see how to [resolve high series cardinality](/influxdb/v2.1/write-data/best-practices/resolve-high-cardinality/).
