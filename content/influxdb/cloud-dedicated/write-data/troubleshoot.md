---
title: Troubleshoot issues writing data
seotitle: Troubleshoot issues writing data to InfluxDB
weight: 106
description: >
  Troubleshoot issues writing data.
  Find response codes for failed writes.
  Discover how writes fail, from exceeding rate or payload limits, to syntax errors and schema conflicts.
menu:
  influxdb_cloud_dedicated:
    name: Troubleshoot issues
    parent: Write data
influxdb/cloud-dedicated/tags: [write, line protocol, errors]
related:
  - /influxdb/cloud-dedicated/reference/syntax/line-protocol/
  - /influxdb/cloud-dedicated/write-data/best-practices/
  - /influxdb/cloud-dedicated/reference/internals/durability/
---

Learn how to avoid unexpected results and recover from errors when writing to {{% product-name %}}.

- [Handle write responses](#handle-write-responses)
  - [Review HTTP status codes](#review-http-status-codes)
- [Troubleshoot failures](#troubleshoot-failures)
- [Troubleshoot rejected points](#troubleshoot-rejected-points)

## Handle write responses

In {{% product-name %}}, writes are synchronous.
After InfluxDB validates the request and attempts to write the data, it responds with a _success_ or _error_ message that indicates the final status of the write.

A success response (HTTP `204` status code) acknowledges that all data in the batch is written and queryable.

If InfluxDB responds with an [HTTP error status code](#review-http-status-codes), one or more points weren't written.
The response body contains information about [rejected points](#troubleshoot-rejected-points).
Written points are queryable.

To ensure that InfluxDB handles writes in the order you request them, wait for the response before you send the next request.

### Review HTTP status codes

InfluxDB uses conventional HTTP status codes to indicate the success or failure of a request.
The `message` property of the response body may contain additional details about the error.
Write requests return the following status codes:

| HTTP response code              | Response body                                                                    | Description    |
| :-------------------------------| :---------------------------------------------------------------        | :------------- |
| `201 "Created"`                 | error details about rejected points, up to 100 points: `line` contains the first rejected line, `message` describes rejections                                                                       | If InfluxDB ingested some or all of the data |
| `400 "Bad request"`             | `message` contains the first malformed line                             | If request data is malformed |
| `401 "Unauthorized"`            |                                                                         | If the `Authorization` header is missing or malformed or if the [token](/influxdb/cloud-dedicated/admin/tokens/) doesn't have [permission](/influxdb/cloud-dedicated/reference/cli/influxctl/token/create/#examples) to write to the database. See [examples using credentials](/influxdb/cloud-dedicated/get-started/write/#write-line-protocol-to-influxdb) in write requests. |
| `404 "Not found"`               | requested **resource type** (for example, "organization" or "database"), and **resource name**     | If a requested resource (for example, organization or database) wasn't found |
| `500 "Internal server error"`   |                                                                         | Default status for an error |
| `503 "Service unavailable"`     |                                                                         | If the server is temporarily unavailable to accept writes. The `Retry-After` header contains the number of seconds to wait before trying the write again.

The `message` property of the response body may contain additional details about the error.
If your data did not write to the database, see how to [troubleshoot rejected points](#troubleshoot-rejected-points).

## Troubleshoot failures

If you notice data is missing in your database, do the following:

- Check the `message` property in the response body for details about the error.
- If the `message` describes a field error, [troubleshoot rejected points](#troubleshoot-rejected-points).
- Verify all lines contain valid syntax ([line protocol](/influxdb/cloud-dedicated/reference/syntax/line-protocol/)).
- Verify the timestamps in your data match the [precision parameter](/influxdb/cloud-dedicated/reference/glossary/#precision) in your request.
- Minimize payload size and network errors by [optimizing writes](/influxdb/cloud-dedicated/write-data/best-practices/optimize-writes/).

## Troubleshoot rejected points

When writing points from a batch, InfluxDB rejects points that have syntax errors or schema conflicts.

If some or all data in a batch is written successfully, InfluxDB responds with an HTTP `201` status code, indicating that the request succeeded.
If some or all points in the batch are rejected, the API response body contains the following properties:

- `code`: the status code description for rejected writes is `"invalid"`.
- `line`: the line number of the _first_ rejected point in the batch.
- `message`: a string that contains line-separated error messages, one message for each rejected point in the batch, up to 100 rejected points.

InfluxDB rejects points for the following reasons:

- a line protocol parsing error
- an invalid timestamp
- a schema conflict with existing tags or fields in the database

A schema conflict can occur when points that fall within the same partition (default partitioning is measurement and day) as existing bucket data have a different data type for an existing field.

For example, a _partial write_ may occur when InfluxDB writes all points that conform to a series in your bucket, but rejects points that have a different data type in a field.

### Example

The following example shows a response body for a write request that contains two rejected points:

```json
{
  "code": "invalid",
  "line": 2,
  "message": "failed to parse line protocol:
              errors encountered on line(s):
              error parsing line 2 (1-based): Invalid measurement was provided
              error parsing line 4 (1-based): Unable to parse timestamp value '123461000000000000000000000000'"
}
```

Check for [field data type](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#data-types-and-format) differences between the rejected data point and points within the same database and partition--for example, did you attempt to write `string` data to an `int` field?
