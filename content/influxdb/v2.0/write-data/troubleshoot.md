---
title: Troubleshoot issues writing data
seotitle: Troubleshoot issues writing data
list_title: Troubleshoot issues writing data
weight: 106 >
  Troubleshoot issues writing data. Discover how writes fail, including rate limit failures, timeouts, size of write payload, not conforming to an explicit schema bucket, and partial writes. Find response codes for failed writes, and suggestions to fix. 
menu:
  influxdb_2_0:
    name: Troubleshoot issues
    parent: Write data
---

Discover causes of failed writes, find HTTP status code definitions, and see ways to resolve failures.

Write failure scenarios include:

- Rate limit failures
- Timeouts
- Size of HTTP headers
- Partial writes (circumstances writes rejected at a batch level vs. a partial success...and I believe this leads into this new content).

The following HTTP status codes may occur for failed writes:

- `204` Success. The sent data was correctly formatted and accepted for writing to the bucket. `204` doesn't indicate a successful write operation since writes are asynchronous. See how to [check for rejected writes](#review-rejected-writes).
- `400` Bad request. The error indicates the line protocol payload was malformed. The response body contains the first malformed line in the data. All payload data was rejected and not written.
- `401` Unauthorized. The error may indicate one of the following:

  - The Authorization: Token header is missing or malformed.
  - The API token value is missing from the header.
  - The token does not have sufficient permissions to write to this organization and bucket.
- `404` Not found. A requested resource was not found. The response body contains the requested resource type, e.g. organization name or bucket, and name.
- `413` Request entity too large. The payload exceeded the 50MB limit. All payload data was rejected and not written.
- `429` Too many requests. The token is temporarily over quota. The Retry-After header describes when to try the write again.
- `500` Internal server error. The default HTTP status for an error.
- `503` Service unavailable. Server is temporarily unavailable to accept writes. The Retry-After header describes when to try the write again.

If you notice data is missing in your bucket, check the following:
- Do all lines contain valid syntax, e.g. line protocol or CSV? 
- Do the data types match? For example, did you attempt to write `string` data to an `int` field?
- Do the timestamps match the precision parameter? 

## Review rejected writes 

To get a log of rejected data points, query the [`rejected_points` measurement](/{{% latest "influxdb" %}}/reference/internals/system-buckets/#_monitoring-bucket-schema) in your organization's `_monitoring` bucket. If your write request returns HTTP status `2xx`, but not all your data points were written, review `rejected_points` to troubleshoot write errors.

### Rejected point example

```sh
rejected_points,bucket=01234f6701e34dd7,field=somefield,gotType=Float,
  measurement=somemeasurement,reason=type\ conflict\ in\ batch\ write,
  wantType=Integer count=1i 1627906197091972750
```

