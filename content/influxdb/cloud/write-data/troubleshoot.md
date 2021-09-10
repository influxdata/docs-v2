---
title: Troubleshoot issues writing data
seotitle: Troubleshoot issues writing data
list_title: Troubleshoot issues writing data
weight: 105
description: >
  Troubleshoot issues writing data. Find response codes for failed writes. Discover how writes fail, from exceeding rate or payload limits, to syntax errors and schema conflicts.
menu:
  influxdb_cloud:
    name: Troubleshoot issues
    parent: Write data
nfluxdb/cloud/tags: [write, line protocol, errors]
related:
  - /influxdb/cloud/api/#tag/Write, InfluxDB API /write endpoint
  - /influxdb/cloud/reference/internals
  - /influxdb/cloud/reference/cli/influx/write
---

Learn how to handle and recover from errors when writing to InfluxDB.

- [Discover common failure scenarios](#common-failure-scenarios)
- [Review HTTP status codes](#review-http-status-codes)
- [Troubleshoot failures](#troubleshoot-failures)

## Common failure scenarios

InfluxDB write requests may fail for a number of reasons.
Common failure scenarios that return an HTTP `4xx` or `5xx` error status code include the following:

- Exceeded a rate limit.
- API token was invalid.
- Client or server reached a timeout threshold.
- Size of the data payload was too large.
- Data was not formatted correctly.
- Data did not conform to the [explicit bucket schema](/influxdb/cloud/organizations/buckets/bucket-schema/).
  See how to troubleshoot specific [bucket schema errors](/influxdb/cloud/organizations/buckets/bucket-schema/#troubleshoot-errors).

Writes may fail partially or completely even though InfluxDB returns an HTTP `2xx` status code for a valid request.
For example, a partial write may occur when InfluxDB writes all points that conform to the bucket schema, but rejects points that have the wrong data type in a field.

## HTTP status codes

InfluxDB uses conventional HTTP status codes to indicate the success or failure of a request.
Write requests return the following status codes:

- `204` **Success**: InfluxDB validated the request data format and accepted the data for writing to the bucket.
    {{% note %}}
  `204` doesn't indicate a successful write operation since writes are asynchronous.
  If some of your data did not write to the bucket, see how to [troubleshoot rejected points](#troubleshoot-rejected-points).
    {{% /note %}}

- `400` **Bad request**: The line protocol data in the request was malformed.
   The response body contains the first malformed line in the data. All request data was rejected and not written.
- `401` **Unauthorized**: May indicate one of the following:
  - `Authorization: Token` header is missing or malformed.
  - API token value is missing from the header.
  - API token does not have sufficient permissions to write to the organization and bucket.
- `404` **Not found**: A requested resource (e.g. an organization or bucket) was not found. The response body contains the requested resource type, e.g. "organization", and resource name.
- `413` **Request entity too large**: The payload exceeded the 50MB limit. All request data was rejected and not written.
- `429` **Too many requests**: API token is temporarily over quota. The `Retry-After` header describes when to try the write request again.
- `500` **Internal server error**: Default HTTP status for an error.
- `503` **Service unavailable**: Server is temporarily unavailable to accept writes. The `Retry-After` header describes when to try the write again.

The `message` property of the response body may contain additional details about the error.

## Troubleshoot failures

If you notice data is missing in your bucket, check the following:

- Does the `message` property in the response body contain details about the error?
- Do all lines contain valid syntax, e.g. [line protocol](/influxdb/cloud/reference/syntax/line-protocol/) or [CSV](/influxdb/cloud/reference/syntax/annotated-csv/)?
- Do the data types match the [bucket schema](/influxdb/cloud/organizations/buckets/bucket-schema/)?
  For example, did you attempt to write `string` data to an `int` field?
- Do the timestamps match the precision parameter?

### Troubleshoot rejected points

InfluxDB may reject points even if the HTTP request returns "Success".
If some of your data did not write to the bucket, check for [field type](/influxdb/cloud/reference/key-concepts/data-elements/#field-value) differences between the missing data point and other points that have the same [series](/influxdb/cloud/reference/key-concepts/data-elements/#series).
For example, did you attempt to write `string` data to an `int` field?

InfluxDB rejects points for the following reasons:
- The **batch** contains another point with the same series, but one of the fields has a different value type.
- The **bucket** contains a saved point with the same series, but one of the fields has a different value type.

