---
title: Troubleshoot issues writing data
seotitle: Troubleshoot issues writing data
list_title: Troubleshoot issues writing data
weight: 105
description: >
  Troubleshoot issues writing data. Discover how writes fail, including rate limit failures, timeouts, size of write payload, not conforming to an explicit schema bucket, and partial writes. Find response codes for failed writes. 
menu:
  influxdb_cloud:
    name: Load data source in UI
    parent: Write data
---

If you notice data is missing in your bucket, check the following:
- Do the data types match? For example, are you writing `string` data to an `int` field?
- other things to check?

Note: You may receive a 202 HTTP code that indicates a write has been accepted, but data hasn't been written.

## Review _monitoring bucket for rejected points

Review the data log for your organization (`org_id`) for `rejected_points_` points in the `_monitoring` bucket for that org_id.

#### Rejected writes

`rejected_points,bucket=01234f6701e34dd7,field=somefield,gotType=Float,measurement=somemeasurement,reason=type\ conflict\ in\ batch\ write,wantType=Integer count=1i 1627906197091972750`



