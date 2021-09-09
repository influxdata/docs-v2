---
title: Troubleshoot issues writing data
seotitle: Troubleshoot issues writing data
list_title: Troubleshoot issues writing data
weight: 106 >
  Troubleshoot issues writing data. Discover how writes fail, including rate limit failures, timeouts, size of write payload, not conforming to an explicit bucket schema, and partial writes. Find response codes for failed writes, and suggestions to fix.
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

- Request exceeded a rate limit.
- API token was invalid.
- Client or server reached a timeout threshold.
- Size of the data payload was too large.
- Data was not formatted correctly.

Writes may fail partially or completely even though InfluxDB returns an HTTP `2xx` status code for a valid request. For example, a partial write may occur when InfluxDB writes all points that conform to the bucket schema, but rejects points that have the wrong data type in a field.

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
  - API token does not have sufficient permissions to write to the organization and the bucket.
- `404` **Not found**: A requested resource (e.g. an organization or bucket) was not found. The response body contains the requested resource type, e.g. "organization", and resource name.
- `413` **Request entity too large**: All request data was rejected and not written. InfluxDB only returns this error if the Go (golang) [`ioutil.ReadAll()`](https://pkg.go.dev/io/ioutil#ReadAll) function raises an error. 
- `500` **Internal server error**: Default HTTP status for an error.
- `503` **Service unavailable**: Server is temporarily unavailable to accept writes. The `Retry-After` header describes when to try the write again.

The `message` property of the response body may contain additional details about the error.

## Troubleshoot failures

If you notice data is missing in your bucket, check the following:

- Does the `message` property in the response body contain details about the error?
- Do all lines contain valid syntax, e.g. [line protocol](/influxdb/v2.0/reference/syntax/line-protocol/) or [CSV](/influxdb/v2.0/reference/syntax/annotated-csv/)?
- Do the timestamps match the precision parameter?

### Troubleshoot rejected points

InfluxDB may reject points even if the HTTP request returns "Success".
If some of your data did not write to the bucket, check for [field type](/influxdb/v2.0/reference/key-concepts/data-elements/#field-value) differences between the missing data point and other points that have the same [series](/influxdb/v2.0/reference/key-concepts/data-elements/#series).
For example, did you attempt to write `string` data to an `int` field?

InfluxDB rejects points for the following reasons:
- The **batch** contains another point with the same series, but one of the fields has a different value type.
- The **bucket** contains another point with the same series, but one of the fields has a different value type.
