---
title: Troubleshoot notebooks
description: Common issues with the notebooks feature.
weight: 102
influxdb/v2.0/tags:
menu:
  influxdb_2_0:
    name: Troubleshoot notebooks
    parent: Notebooks
---
{{% note %}}
**Notebooks is currently an early access feature.**
[Submit a request](https://w2.influxdata.com/notebooks-early-access/ ) to be added to the queue, and we will send you a confirmation when you’ve been added to early access.
{{% /note %}}

### No measurements appear in my bucket even there's data in it.
Try changing the time range. You might have measurements prior to the time range you selected. For example, if the time range says 1h and you have written data for 1 day then you wouldn’t see any measurements in your bucket until you change the time range.

### "No bucket exists" error message appears.
This error appears when the Buckets API endpoint returns a list of bucket and you don’t have access to that bucket.

### Metric selector crashes.
This can occur with high cardinality buckets when there's too much data. 
