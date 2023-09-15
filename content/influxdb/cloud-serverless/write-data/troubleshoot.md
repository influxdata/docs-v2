---
title: Troubleshoot issues writing data
seotitle: Troubleshoot issues writing data to InfluxDB
weight: 106
description: >
  Troubleshoot issues writing data. Find response codes for failed writes. Discover how writes fail, from exceeding rate or payload limits, to syntax errors and schema conflicts.
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

<!-- TOC -->

- [Handle write responses](#handle-write-responses)
  - [Review HTTP status codes](#review-http-status-codes)
- [Troubleshoot failures](#troubleshoot-failures)
- [Troubleshoot rejected points](#troubleshoot-rejected-points)

<!-- /TOC -->

## Handle `write` responses

In {{% product-name %}}, writes are synchronous.
After InfluxDB validates the request and ingests the data, it sends a _success_ response (HTTP `204` status code) as an acknowledgement that the data is written and queryable.
To ensure that InfluxDB handles writes in the order you request them, wait for the acknowledgement before you send the next request.

If InfluxDB successfully writes all the request data to the database, it returns _success_ (HTTP `204` status code).
The first rejected point in a batch causes InfluxDB to reject the entire batch and respond with an [HTTP error status](#review-http-status-codes).

### Review HTTP status codes

InfluxDB uses conventional HTTP status codes to indicate the success or failure of a request.
The `message` property of the response body may contain additional details about the error.
Write requests return the following status codes:

| HTTP response code              | Message                                                                 | Description    |
| :-------------------------------| :-----------------------------------------------------------------------| :------------- |
| `204 "Success"`                 |                                                                         | If InfluxDB ingested the data |
| `400 "Bad request"`             | `message` contains the first malformed line                             | If request data is malformed |
| `401 "Unauthorized"`            |                                                                         | If the `Authorization` header is missing or malformed or if the [token](/influxdb/cloud-serverless/admin/tokens/) doesn't have [permission](/influxdb/cloud-serverless/reference/cli/influxctl/token/create/#examples) to write to the database. See [examples using credentials](/influxdb/cloud-serverless/get-started/write/#write-line-protocol-to-influxdb) in write requests. |
| `404 "Not found"`               | requested **resource type** (for example, "organization" or "database"), and **resource name**     | If a requested resource (for example, organization or database) wasn't found |
| `413 “Request too large”`       | cannot read data: points in batch is too large                          | If a request exceeds the maximum [global limit](/influxdb/cloud-serverless/admin/billing/limits/) |
| `429 “Too many requests”`       | `Retry-After` header: xxx (seconds to wait before retrying the request) | If a request exceeds your plan's [adjustable service quotas](/influxdb/cloud-serverless/admin/billing/limits/#adjustable-service-quotas) |
| `500 "Internal server error"`   |                                                                         | Default status for an error |
|`503` "Service unavailable"      |                                                                         | If the server is temporarily unavailable to accept writes. The `Retry-After` header describes when to try the write again.

The `message` property of the response body may contain additional details about the error.
If your data did not write to the database, see how to [troubleshoot rejected points](#troubleshoot-rejected-points).

## Troubleshoot failures

If you notice data is missing in your database, do the following:

- Check the `message` property in the response body for details about the error.
- If the `message` describes a field error, [troubleshoot rejected points](#troubleshoot-rejected-points).
- Verify all lines contain valid syntax ([line protocol](/influxdb/cloud-serverless/reference/syntax/line-protocol/)).
- Verify the timestamps in your data match the [precision parameter](/influxdb/cloud-serverless/reference/glossary/#precision) in your request.
- Minimize payload size and network errors by [optimizing writes](/influxdb/cloud-serverless/write-data/best-practices/optimize-writes/).

## Troubleshoot rejected points

InfluxDB rejects points for the following reasons:

- The **batch** contains another point with the same series, but one of the fields has a different value type.
- The **bucket** contains another point with the same series, but one of the fields has a different value type.

Check for [field data type](/influxdb/cloud-serverless/reference/syntax/line-protocol/#data-types-and-format) differences between the missing data point and other points that have the same [series](/influxdb/cloud-serverless/reference/glossary/#series)--for example, did you attempt to write `string` data to an `int` field?
