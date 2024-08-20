---
title: Troubleshoot issues writing data
seotitle: Troubleshoot issues writing data to InfluxDB
weight: 106
description: >
  Troubleshoot issues writing data.
  Find response codes for failed writes.
  Discover how writes fail, from exceeding rate or payload limits, to syntax errors and schema conflicts.
menu:
  influxdb_cloud_serverless:
    name: Troubleshoot issues
    parent: Write data
influxdb/cloud-serverless/tags: [write, line protocol, errors]
related:
  - /influxdb/cloud-serverless/reference/syntax/line-protocol/
  - /influxdb/cloud-serverless/write-data/best-practices/
  - /influxdb/cloud-serverless/reference/internals/durability/
---

Learn how to avoid unexpected results and recover from errors when writing to {{% product-name %}}.


- [Handle write responses](#handle-write-responses)
  - [Review HTTP status codes](#review-http-status-codes)
- [Troubleshoot failures](#troubleshoot-failures)
- [Troubleshoot rejected points](#troubleshoot-rejected-points)

## Handle write responses

{{% product-name %}} does the following when you send a write request:

  1. Validates the request.
  2. If successful, attempts to [ingest data](/influxdb/cloud-serverless/reference/internals/durability/#data-ingest) from the request body; otherwise, responds with an [error status](#review-http-status-codes).
  3. Ingests or rejects the entire batch and returns one of the following HTTP status codes:

     - `204 No Content`: some or all of the data is ingested and queryable
     - `400 Bad Request`: all data is rejected

     If points are rejected, the `204` or `400` response body contains error details about [rejected points](#troubleshoot-rejected-points), up to 100 points.

  Writes are synchronous--the response status indicates the final status of the write and all ingested data is queryable.

  To ensure that InfluxDB handles writes in the order you request them,
  wait for the response before you send the next request.

### Review HTTP status codes

InfluxDB uses conventional HTTP status codes to indicate the success or failure of a request.
The `message` property of the response body may contain additional details about the error.
{{< product-name >}} returns one the following HTTP status codes for a write request:

| HTTP response code              | Response body                                                                    | Description    |
| :-------------------------------| :---------------------------------------------------------------        | :------------- |
| `201 "Created"`                 | error details about rejected points, up to 100 points, `line` contains the first rejected line, `message` describes rejections | If some of the data is ingested and some of the data is rejected |
| `204 "No Content"`              | no response body                                                        | If InfluxDB ingested all of the data in the batch |
| `400 "Bad request"`             | `line` contains the first malformed line, `message` describes rejected points                             | If request data is malformed |
| `401 "Unauthorized"`            |                                                                         | If the `Authorization` header is missing or malformed or if the [token](/influxdb/cloud-serverless/admin/tokens/) doesn't have [permission](/influxdb/cloud-serverless/admin/tokens/create-token/) to write to the bucket. See [examples using credentials](/influxdb/cloud-serverless/get-started/write/#write-line-protocol-to-influxdb) in write requests. |
| `404 "Not found"`               | requested **resource type** (for example, "organization" or "bucket"), and **resource name**     | If a requested resource (for example, organization or bucket) wasn't found |
| `413 “Request too large”`       | cannot read data: points in batch is too large                          | If a request exceeds the maximum [global limit](/influxdb/cloud-serverless/admin/billing/limits/) |
| `422 "Unprocessable Entity"`    | `message` contains details about the error                              | If the data isn't allowed (for example, falls outside of the bucket's retention period).
| `429 “Too many requests”`       |                                                                         | If the number of requests exceeds the [adjustable service quota](/influxdb/cloud-serverless/admin/billing/limits/#adjustable-service-quotas). The `Retry-After` header contains the number of seconds to wait before trying the write again. | If a request exceeds your plan's [adjustable service quotas](/influxdb/cloud-serverless/admin/billing/limits/#adjustable-service-quotas)
| `500 "Internal server error"`   |                                                                         | Default status for an error |
| `503 "Service unavailable"`     |                                                                         | If the server is temporarily unavailable to accept writes. The `Retry-After` header contains the number of seconds to wait before trying the write again.

The `message` property of the response body may contain additional details about the error.
If your data did not write to the bucket, see how to [troubleshoot rejected points](#troubleshoot-rejected-points).

## Troubleshoot failures

If you notice data is missing in your database, do the following:

- Check the [HTTP status code](#review-http-status-codes) in the response.
- Check the `message` property in the response body for details about the error.
- If the `message` describes a field error, [troubleshoot rejected points](#troubleshoot-rejected-points).
- Verify all lines contain valid syntax ([line protocol](/influxdb/cloud-serverless/reference/syntax/line-protocol/)).
- Verify the timestamps in your data match the [precision parameter](/influxdb/cloud-serverless/reference/glossary/#precision) in your request.
- Minimize payload size and network errors by [optimizing writes](/influxdb/cloud-serverless/write-data/best-practices/optimize-writes/).

## Troubleshoot rejected points

When writing points from a batch, InfluxDB rejects points that have syntax errors or schema conflicts.
If InfluxDB processes the data in your batch and then rejects points, the [HTTP response](#handle-write-responses) body contains the following properties that describe rejected points:

- `code`: `"invalid"`
- `line`: the line number of the _first_ rejected point in the batch.
- `message`: a string that contains line-separated error messages, one message for each rejected point in the batch, up to 100 rejected points.

InfluxDB rejects points for the following reasons:

- a line protocol parsing error
- an invalid timestamp
- a schema conflict

Schema conflicts occur when you try to write data that contains any of the following:

- a wrong data type: the point falls within the same partition (default partitioning is measurement and day) as existing bucket data and contains a different data type for an existing field
- a tag and a field that use the same key

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

Check for [field data type](/influxdb/cloud-serverless/reference/syntax/line-protocol/#data-types-and-format) differences between the rejected data point and points within the same database and partition--for example, did you attempt to write `string` data to an `int` field?
