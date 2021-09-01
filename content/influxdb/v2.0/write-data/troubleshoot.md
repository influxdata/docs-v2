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
influxdb/v2.0/tags: [write, line protocol, errors]
related:
  - /influxdb/v2.0/api/#tag/Write, InfluxDB API /write endpoint
  - /influxdb/v2.0/reference/internals
  - /influxdb/v2.0/reference/cli/influx/write
---
Learn how to handle and recover from errors when writing to InfluxDB.

- [Discover common failure scenarios](#common-failure-scenarios)
- [HTTP status codes](#http-status-codes)
- [Troubleshoot failures](#troubleshoot-failures)

## Common failure scenarios

Write requests made to InfluxDB may fail for a number of reasons.
Common failure scenarios that return an HTTP `4xx` or `5xx` error status code include the following:

- The request exceeded a rate limit.
- The API token was invalid.
- The client or server reached a timeout threshold.
- The size of the data payload was too large.
- The data was not formatted correctly.

Writes may fail partially or completely even though InfluxDB returns an HTTP `2xx` status code for a valid request. For example, a partial write may occur when InfluxDB writes all points that conform to the bucket schema, but rejects points that have the wrong data type in a field.

## HTTP status codes

InfluxDB uses conventional HTTP status codes to indicate the success or failure of a request.
Write requests return the following status codes:

- `204` Success. The sent data was correctly formatted and accepted for writing to the bucket. `204` doesn't indicate a successful write operation since writes are asynchronous. See how to [check for rejected points](#review-rejected-points).
- `400` Bad request. The error indicates the line protocol payload was malformed. The response body contains the first malformed line in the data. All payload data was rejected and not written.
- `401` Unauthorized. The error may indicate one of the following:
  - The Authorization: Token header is missing or malformed.
  - The API token value is missing from the header.
  - The token does not have sufficient permissions to write to this organization and bucket.
- `404` Not found. A requested resource was not found. The response body contains the requested resource type, e.g. organization name or bucket, and name.
- `413` Request entity too large. All payload data was rejected and not written.
- `429` Too many requests. The token is temporarily over quota. The Retry-After header describes when to try the write again.
- `500` Internal server error. The default HTTP status for an error.
- `503` Service unavailable. Server is temporarily unavailable to accept writes. The Retry-After header describes when to try the write again.

The `message` property of the response body may contain additional details about the error.

## Troubleshoot failures

If you notice data is missing in your bucket, check the following:
- Does the `message` property in the response body contain details about the error?
- Do all lines contain valid syntax, e.g. line protocol or CSV?
- Do the data types match? For example, did you attempt to write `string` data to an `int` field?
- Do the timestamps match the precision parameter?

### Review rejected points

Check for rejected data points if your write request succeeded, but not all your data was written to the bucket.
To get a log of rejected data points, query the [`rejected_points` measurement](/{{% latest "influxdb" %}}/reference/internals/system-buckets/#_monitoring-bucket-schema) in your organization's `_monitoring` bucket.

#### Rejected point example

```sh
rejected_points,bucket=01234f6701e34dd7,field=somefield,gotType=Float,
  measurement=somemeasurement,reason=type\ conflict\ in\ batch\ write,
  wantType=Integer count=1i 1627906197091972750
```
