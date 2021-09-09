---
title: Troubleshoot issues writing data
seotitle: Troubleshoot issues writing data
list_title: Troubleshoot issues writing data
weight: 105
description: >
  Troubleshoot issues writing data. Find response codes for failed writes. Discover how writes fail, from exceeding rate or payload limits, to syntax errors and schema conflicts. Find suggestions to fix failures.
menu:
  influxdb_cloud:
    name: Troubleshoot issues
    parent: Write data
influxdb/cloud/tags: [write, line protocol, errors]
related:
  - /influxdb/cloud/api/#tag/Write, InfluxDB API /write endpoint
  - /influxdb/cloud/reference/internals
  - /influxdb/cloud/reference/cli/influx/write
---

Learn how to handle and recover from errors when writing to InfluxDB.

- [Discover common failure scenarios](#discover-common-failure-scenarios)
- [Review HTTP status codes](#review-http-status-codes)
- [Troubleshoot failures](#troubleshoot-failures)
- [Troubleshoot rejected points](#troubleshoot-rejected-points)

## Discover common failure scenarios

Write requests made to InfluxDB may fail for a number of reasons.
Common failure scenarios that return an HTTP `4xx` or `5xx` error status code include the following:

- API token was invalid. See how to [manage API tokens](/influxdb/cloud/security/tokens/).
- Exceeded a rate limit.
- Payload size was too large.
- Client or server reached a timeout threshold.
- Data was not formatted correctly. See how to [find parsing errors](#find-parsing-errors)
- Data did not conform to the [explicit bucket schema](/influxdb/cloud/organizations/buckets/bucket-schema/).
  See how to resolve [explicit schema rejections](#resolve-explicit-schema-rejections).

To find the causes of a specific error, [review HTTP status codes](#review-http-status-codes).

### Troubleshoot partial writes

Writes may fail partially or completely even though InfluxDB returns an HTTP `2xx` status code for a valid request.
To resolve partial writes and rejected points, see [troubleshoot failures](#troubleshoot-failures).

## Review HTTP status codes

InfluxDB uses conventional HTTP status codes to indicate the success or failure of a request.
Write requests return the following status codes:

- `204` **Success**: InfluxDB validated the request data format and accepted the data for writing to the bucket.
    {{% note %}}
  `204` doesn't indicate a successful write operation given writes are asynchronous. If some of your data did not write to the bucket, see how to [check for rejected points](#review-rejected-points).
    {{% /note %}}
- `400` **Bad request**: InfluxDB rejected some or all of the request data.
  `code` and `message` in the response body provide details about the problem.
  For more information, see how to [troubleshoot rejected points](#troubleshoot-rejected-points).
- `401` **Unauthorized**: May indicate one of the following:
  -  [`Authorization: Token` header](/influxdb/cloud/api-guide/api_intro/#authentication) is missing or malformed.
  - [API token](/influxdb/cloud/api-guide/api_intro/#authentication) value is missing from the header.
  - API token does not have sufficient permissions to write to the organization and bucket.
    For more information about token types and permissions, see [Manage API tokens](/influxdb/cloud/security/tokens/)
- `404` **Not found**: A requested resource (e.g. an organization or bucket) was not found.
  The response body contains the requested resource type, e.g. "organization", and resource name.
- `413` **Request entity too large**: The write request payload exceeded the size limit (**50 MB *uncompressed*** data or **250 MB *decompressed***).
- `429` **Too many requests**: API token is temporarily over quota. The `Retry-After` header describes when to try the write request again.
- `500` **Internal server error**: Default HTTP status for an error.
- `503` **Service unavailable**: Server is temporarily unavailable to accept writes. The `Retry-After` header describes when to try the write again.

The `message` property of the response body may contain additional details about the error.

## Troubleshoot failures

If you notice data is missing in your bucket, do the following:

- Check the `message` property in the response body for details about the error, e.g. `partial write error` indicates [rejected points](#troubleshoot-rejected-points).
- Check for [rejected points](#troubleshoot-rejected-points) in your organization's `_monitoring` bucket.
- Verify all lines contain valid syntax, e.g. [line protocol](/influxdb/cloud/reference/syntax/line-protocol/) or [CSV](/influxdb/cloud/reference/syntax/annotated-csv/).
- Verify the data types match the [series](/influxdb/cloud/reference/key-concepts/data-elements/#series) or [bucket schema](/influxdb/cloud/organizations/buckets/bucket-schema/).
- Verify the timestamps match the [precision parameter](/influxdb/cloud/write-data/#timestamp-precision).
- Minimize payload size and network errors by [optimizing writes](/influxdb/cloud/write-data/best-practices/optimize-writes/).

## Troubleshoot rejected points

InfluxDB may have rejected points even if the HTTP request returned "Success".
InfluxDB logs rejected data points and associated errors to your organization's `_monitoring` bucket.

- [Review rejected points](#review-rejected-points)
  - [Find parsing errors](#find-parsing-errors)
  - [Find data type conflicts and schema rejections](#find-data-type-conflicts-and-schema-rejections)
- [Resolve data type conflicts](#resolve-data-type-conflicts)
- [Resolve explicit schema rejections](#resolve-explicit-schema-rejections)

### Review rejected points

To get a log of rejected points, query the [`rejected_points` measurement](/influxdb/cloud/reference/internals/system-buckets/#_monitoring-bucket-schema) in your organization's `_monitoring` bucket.
To more quickly locate `rejected_points`, keep the following in mind:

- If your batch contains single lines with multiple [fields](/influxdb/cloud/reference/syntax/line-protocol/#field-set), InfluxDB logs an entry for each point (each unique field) that failed.
- Each entry contains a `reason` tag that describes why the point was rejected.
- Entries for [data type conflicts and schema rejections](#find-data-type-conflicts-and-schema-rejections) have a `count` field value of `1`.
- Entries for [parsing errors](#find-parsing-errors) contain an `error` field (and don't contain a `count` field).

#### rejected_points schema

| Name          | Value                                                                                                                                                     |
|:------        |:-----                                                                                                                                                     |
| `_measurement`| `rejected_points`                                                                                                                                         |
| `_field`      | [`count`](#find-data-type-conflicts-and-schema-rejections) or [`error`](#find-parsing-errors)                                                             |
| `_value`      | [`1`](#find-data-type-conflicts-and-schema-rejections) or [error details](#find-parsing-errors)                                                           |
| `bucket`      | ID of the bucket that rejected the point                                                                                                                  |
| `measurement` | Measurement name of the point                                                                                                                             |
| `field`       | Name of the field that caused the rejection                                                                                                               |
| `reason`      | Brief description of the problem. See specific reasons in [field type conflicts and schema rejections](#find-field-type-conflicts-and-schema-rejections). |
| `gotType`     | Received [field](/influxdb/cloud/reference/key-concepts/data-elements/#field-value) type: `Boolean`, `Float`, `Integer`, `String`, or `UnsignedInteger`   |
| `wantType`    | Expected [field](/influxdb/cloud/reference/key-concepts/data-elements/#field-value) type: `Boolean`, `Float`, `Integer`, `String`, or `UnsignedInteger`   |
| `<timestamp>` | Time the rejected point was logged                                                                                                                        |

#### Find parsing errors

If InfluxDB can't parse a line (e.g. due to syntax problems), the response `message` might not provide details.
To find parsing error details, query `rejected_points` entries that contain the `error` field (instead of the `count` field).

```js
from(bucket: "_monitoring")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "rejected_points")
  |> filter(fn: (r) => r._field == "error")
```

#### Find data type conflicts and schema rejections

To find `rejected_points` caused by [data type conflicts](#resolve-data-type-conflicts) or [schema rejections](#resolve-explicit-schema-rejections),
query for the `count` field.

```js
from(bucket: "_monitoring")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "rejected_points")
  |> filter(fn: (r) => r._field == "count")
```

### Resolve data type conflicts

When you write to a bucket that has the `implicit` schema type, InfluxDB compares new points to points that have the same [series](/influxdb/cloud/reference/key-concepts/data-elements/#series).
If a point has a field with a different data type than the series, InfluxDB rejects the point and logs a `rejected_points` entry.
The `rejected_points` entry contains one of the following reasons:

| Reason                              | Meaning                                                                                                       |
|:------                              |:-------                                                                                                       |
| `type conflict in batch write`      | The **batch** contains another point with the same series, but one of the fields has a different value type.  |
| `type conflict with existing data`  | The **bucket** contains another point with the same series, but one of the fields has a different value type. |

### Resolve explicit schema rejections

Buckets with the [`explicit` schema type] use [explicit bucket schemas](/influxdb/cloud/organizations/buckets/bucket-schema/).
When you write to a bucket that uses explicit bucket schemas,
InfluxDB rejects data that don't conform to one of the configured schemas.

Learn how to interpret `rejected_points` logging for [explicit bucket schemas](/influxdb/cloud/organizations/buckets/bucket-schema/).

- [Detect a measurement mismatch](#detect-a-measurement-mismatch)
- [Detect a field type mismatch](#detect-a-field-type-mismatch)

##### Detect a measurement mismatch

InfluxDB rejects a point if the [measurement](/influxdb/cloud/reference/key-concepts/data-elements/#measurement) doesn't match the **name** of a [bucket schema](/influxdb/cloud/organizations/buckets/bucket-schema/).
The `rejected_points` entry contains the following `reason` tag value:

| Reason                              | Meaning                                                                                                                |
|:------                              |:-------          
| `measurement not allowed by schema` | The **bucket** is configured to use explicit schemas and none of the schemas matches the **measurement** of the point. |

Consider the following [line protocol](/influxdb/cloud/reference/syntax/line-protocol) data.

```
airSensors,sensorId=TLM0201 temperature=73.97,humidity=35.23,co=0.48 1637014074
```

The line has an `airSensors` measurement and three fields (`temperature`, `humidity`, and `co`).
If you try to write this data to a bucket that has the [`explicit` schema type](/influxdb/cloud/organizations/buckets/bucket-schema/) and doesn't have an `airSensors` schema, the `/api/v2/write` InfluxDB API returns an error and the following data:

```json
{
  "code": "invalid",
  "message": "3 out of 3 points rejected (check rejected_points in your _monitoring bucket for further information)"
}
```

InfluxDB logs three `rejected_points` entries, one for each field.

| _measurement    | _field | _value | field       | measurement | reason                            |
|:----------------|:-------|:-------|:------------|:------------|:----------------------------------|
| rejected_points | count  | 1      | humidity    | airSensors  | measurement not allowed by schema |
| rejected_points | count  | 1      | co          | airSensors  | measurement not allowed by schema |
| rejected_points | count  | 1      | temperature | airSensors  | measurement not allowed by schema |

##### Detect a field type mismatch

InfluxDB rejects a point if the [measurement](/influxdb/cloud/reference/key-concepts/data-elements/#measurement) matches the **name** of a bucket schema and the field data types don't match.
The `rejected_points` entry contains the following reason:

| Reason                              | Meaning                                                                                              |
|:------------------------------------|:-----------------------------------------------------------------------------------------------------|
| `field type mismatch with schema`   | The point has the same measurement as a configured schema and they have different field value types. |

Consider a bucket that has the following `airSensors` [`explicit bucket schema`](/influxdb/cloud/organizations/buckets/bucket-schema/):

```json
{
 "name": "airSensors",
 "columns": [
   {
     "name": "time",
     "type": "timestamp"
   },
   {
     "name": "sensorId",
     "type": "tag"
   },
   {
     "name": "temperature",
     "type": "field",
     "dataType": "float"
   },
   {
     "name": "humidity",
     "type": "field",
     "dataType": "float"
   },
   {
     "name": "co",
     "type": "field",
     "dataType": "float"
   }
 ]
}
```

The following [line protocol](/influxdb/cloud/reference/syntax/line-protocol) data has an `airSensors` measurement, a `sensorId` tag, and three fields (`temperature`, `humidity`, and `co`).

```
airSensors,sensorId=L1 temperature=90.5,humidity=70.0,co=0.2 1637014074
airSensors,sensorId=L1 temperature="90.5",humidity=70.0,co=0.2 1637014074
```

In the example data, one of the points has a `temperature` field value with the _string_ data type.
However, the `airSensors` schema requires `temperature` to have the _float_ data type.
If you try to write the example data to the `airSensors` bucket schema,
InfluxDB returns a `400` error and a message that describes the result:

```json
{
  "code": "invalid",
  "message": "partial write error (5 accepted): 1 out of 6 points rejected (check rejected_points in your _monitoring bucket for further information)"
}
```

InfluxDB logs the following `rejected_points` entry to the `_monitoring` bucket:

| _measurement      | _field | _value | bucket             | field         | gotType  | measurement | reason                            | wantType |
|:------------------|:-------|:-------|:-------------------|:--------------|:---------|:------------|:----------------------------------|:---------|
| rejected_points   | count  | 1      | a7d5558b880a93da   | temperature   | String   | airSensors  | field type mismatch with schema   | Float    |
