
Learn how to avoid unexpected results and recover from errors when writing to InfluxDB.

{{% show-in "v2,cloud" %}}

- [Handle `write` and `delete` responses](#handle-write-and-delete-responses)
- [Troubleshoot failures](#troubleshoot-failures)
- [Troubleshoot rejected points](#troubleshoot-rejected-points)

{{% /show-in %}}

## Handle `write` and `delete` responses

{{% show-in "cloud" %}}

In InfluxDB Cloud, writes and deletes are asynchronous and eventually consistent.
Once InfluxDB validates your request and [queues](/influxdb/cloud/reference/internals/durability/#backup-on-write) the write or delete, it sends a _success_ response (HTTP `204` status code) as an acknowledgement.
To ensure that InfluxDB handles writes and deletes in the order you request them, wait for the acknowledgement before you send the next request.
Because writes are asynchronous, keep the following in mind:

- Data might not yet be queryable when you receive _success_ (HTTP `204` status code).
- InfluxDB may still reject points after you receive _success_ (HTTP `204` status code).

{{% /show-in %}}

{{% show-in "v2" %}}

{{% product-name %}} does the following when you send a write request:

  1. Validates the request.
  2. If successful, attempts to [ingest data](/influxdb/v2/reference/internals/durability/#data-ingest) from the request body; otherwise, responds with an [error status](#review-http-status-codes).
  3. Ingests or rejects data from the batch and returns one of the following HTTP status codes:

     - `204 No Content`: All of the data is ingested and queryable.
     - `422 Unprocessable Entity`: Some or all of the data has been rejected. Data that has not been rejected is ingested and queryable.

     The response body contains error details about [rejected points](#troubleshoot-rejected-points).

  Writes are synchronous--the response status indicates the final status of the write and all ingested data is queryable.

  To ensure that InfluxDB handles writes in the order you request them,
  wait for the response before you send the next request.

{{% /show-in %}}

### Review HTTP status codes

InfluxDB uses conventional HTTP status codes to indicate the success or failure of a request.
Write requests return the following status codes:

{{% show-in "cloud" %}}

| HTTP response code              | Message                                                                 | Description    |
| :-------------------------------| :---------------------------------------------------------------        | :------------- |
| `204 "Success"`                 |                                                                         | If InfluxDB validated the request data format and queued the data for writing to the bucket |
| `400 "Bad request"`             | `message` contains the first malformed line                             | If data is malformed    |
| `401 "Unauthorized"`            |                                                                         | If the [`Authorization: Token` header](/influxdb/cloud/api-guide/api_intro/#authentication) is missing or malformed or if the [API token](/influxdb/cloud/api-guide/api_intro/#authentication) doesn't have [permission](/influxdb/cloud/admin/tokens/) to write to the bucket |
| `404 "Not found"`               | requested **resource type** (for example, "organization") and **resource name**     | If a requested resource, such as an organization or bucket, wasn't found |
| `413 "Request too large"`       | cannot read data: points in batch is too large                          | If a **write** request exceeds the maximum [global limit](/influxdb/cloud/account-management/limits/#global-limits) |
| `429 “Too many requests”`       | `Retry-After` header: xxx (seconds to wait before retrying the request) | If a **read** or **write** request exceeds your plan's [adjustable service quotas](/influxdb/cloud/account-management/limits/#adjustable-service-quotas) or if a **delete** request exceeds the maximum [global limit](/influxdb/cloud/account-management/limits/#global-limits) |
| `500 "Internal server error"`   |                                                                         | Default status for an error |
| `503 “Service unavailable“` | Series cardinality exceeds your plan's service quota                        | If **series cardinality** exceeds your plan's [adjustable service quotas](/influxdb/cloud/account-management/limits/#adjustable-service-quotas) |

{{% /show-in %}}

{{% show-in "v2" %}}

- `204` **Success**: All request data was written to the bucket.
- `400` **Bad request**: 
        The response body contains the first malformed line in the data. All request data was rejected and not written.
- `401` **Unauthorized**: May indicate one of the following:
  - [`Authorization: Token` header](/influxdb/v2/api-guide/api_intro/#authentication) is missing or malformed.
  - [API token](/influxdb/v2/api-guide/api_intro/#authentication) value is missing from the header.
  - API token does not have sufficient permissions to write to the organization and the bucket. For more information about token types and permissions, see [Manage API tokens](/influxdb/v2/admin/tokens/).
- `404` **Not found**: A requested resource, such as an organization or bucket, was not found. The response body contains the requested resource type (for example, "organization") and resource name.
- `413` **Request entity too large**: All request data was rejected and not written. InfluxDB OSS only returns this error if the [Go (golang) `ioutil.ReadAll()`](https://pkg.go.dev/io/ioutil#ReadAll) function raises an error.
- `422` **Unprocessable entity**: The request was well-formed, but some or all the points were rejected due to semantic errors--for example, schema conflicts or retention policy violations.
- `500` **Internal server error**: Default HTTP status for an error.
- `503` **Service unavailable**: Server is temporarily unavailable to accept writes. The `Retry-After` header describes when to try the write again.

{{% /show-in %}}

The `message` property of the response body may contain additional details about the error.
If some of your data did not write to the bucket, see how to [troubleshoot rejected points](#troubleshoot-rejected-points).

{{% show-in "cloud" %}}

### Troubleshoot partial writes

For example, a partial write may occur when InfluxDB writes all points that conform to the bucket schema, but rejects points that have the wrong data type in a field.
To check for writes that fail asynchronously, create a [task](/influxdb/cloud/process-data/manage-tasks/) to [check the _monitoring bucket for rejected points](#review-rejected-points).
To resolve partial writes and rejected points, see [troubleshoot failures](#troubleshoot-failures).

{{% /show-in %}}

## Troubleshoot failures

{{% show-in "v2" %}}

If you notice data is missing in your bucket, do the following:

- Check the [HTTP status code](#review-http-status-codes) in the response.
- Check the `message` property in the response body for details about the error--for example, `partial write` indicates [rejected points](#troubleshoot-rejected-points).
- Verify all lines contain valid syntax ([line protocol](/influxdb/v2/reference/syntax/line-protocol/) or [CSV](/influxdb/v2/reference/syntax/annotated-csv/)).
- Verify the timestamps match the [precision parameter](/influxdb/v2/write-data/#timestamp-precision) in your request.
- Minimize payload size and network errors by [optimizing writes](/influxdb/v2/write-data/best-practices/optimize-writes/).

{{% /show-in %}}

{{% show-in "cloud" %}}
If you notice data is missing in your bucket, do the following:

- Check the `message` property in the response body for details about the error--for example, `partial write error` indicates [rejected points](#troubleshoot-rejected-points).
- Check for [rejected points](#troubleshoot-rejected-points) in your organization's `_monitoring` bucket.
- Verify all lines contain valid syntax ([line protocol](/influxdb/cloud/reference/syntax/line-protocol/) or [CSV](/influxdb/cloud/reference/syntax/annotated-csv/)). See how to [find parsing errors](#find-parsing-errors).
- Verify the data types match the [series](/influxdb/cloud/reference/key-concepts/data-elements/#series) or [bucket schema](/influxdb/cloud/admin/buckets/bucket-schema/). See how to resolve [explicit schema rejections](#resolve-explicit-schema-rejections).
- Verify the timestamps match the [precision parameter](/influxdb/cloud/write-data/#timestamp-precision).
- Minimize payload size and network errors by [optimizing writes](/influxdb/cloud/write-data/best-practices/optimize-writes/).

{{% /show-in %}}

## Troubleshoot rejected points

{{% show-in "v2" %}}

When writing points from a batch, InfluxDB rejects points that have syntax errors or schema conflicts.

If InfluxDB processes the data in your batch and then rejects points, the [HTTP response](#handle-write-responses) body contains the following properties that describe rejected points:

- `code`: `"unprocessable entity"`
- `message`: a string that describes the reason points were rejected and may provide details, such as database, retention policy, and which bound was violated.

For example, the following `message` indicates that points were rejected because the timestamps fall outside the `1d` retention policy:

```text
failure writing points to database: partial write: dropped 4 points outside retention policy of duration 24h0m0s - oldest point home,room=Living\\ Room at 1970-01-01T00:00:01.541Z dropped because it violates a Retention Policy Lower Bound at 2025-05-20T19:06:17.612973Z, newest point home,room=Living\\ Room at 1970-01-01T00:00:01.5410006Z dropped because it violates a Retention Policy Lower Bound at 2025-05-20T19:06:17.612973Z dropped=4 for database: 9f282d63c7d3a5c0 for retention policy: autogen
```

InfluxDB rejects points for the following reasons:

- a line protocol parsing error
- an invalid timestamp
- a schema conflict
- retention policy violation

Schema conflicts occur when you try to write data that contains any of the following:

- The **batch** contains another point with the same series, but one of the fields has a different value type.
- The **bucket** contains another point with the same series, but one of the fields has a different value type.

Check for [field type](/influxdb/v2/reference/key-concepts/data-elements/#field-value) differences between the missing data point and other points that have the same [series](/influxdb/v2/reference/key-concepts/data-elements/#series)--for example, did you attempt to write `string` data to an `int` field?

{{% /show-in %}}

{{% show-in "cloud" %}}

When you receive an HTTP `204` (Success) status code, InfluxDB has validated your request format and queued your data for writing.
However, {{% product-name %}} processes data asynchronously, which means points may still be rejected after you receive a success response.

InfluxDB may reject points for several reasons:
- Line protocol parsing errors
- Invalid timestamps
- Data type conflicts with existing schema
- Retention policy violations
- Series cardinality exceeding your plan's limits

To verify if your data was successfully written, query your data or check the `_monitoring` bucket for rejected points.

- [Review rejected points](#review-rejected-points)
  - [Find parsing errors](#find-parsing-errors)
  - [Find data type conflicts and schema rejections](#find-data-type-conflicts-and-schema-rejections)
- [Resolve data type conflicts](#resolve-data-type-conflicts)
- [Resolve explicit schema rejections](#resolve-explicit-schema-rejections)

### Review rejected points

To get a log of rejected points, query the [`rejected_points` measurement](/influxdb/cloud/reference/internals/system-buckets/#_monitoring-bucket-schema) in your organization's `_monitoring` bucket.
To more quickly locate `rejected_points`, keep the following in mind:

- If your line protocol batch contains single lines with multiple [fields](/influxdb/cloud/reference/syntax/line-protocol/#field-set), InfluxDB logs an entry for each point (each unique field) that is rejected.
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
| `reason`      | Brief description of the problem. See specific reasons in [data type conflicts and schema rejections](#find-data-type-conflicts-and-schema-rejections)   |
| `gotType`     | Received [field](/influxdb/cloud/reference/key-concepts/data-elements/#field-value) type: `Boolean`, `Float`, `Integer`, `String`, or `UnsignedInteger`   |
| `wantType`    | Expected [field](/influxdb/cloud/reference/key-concepts/data-elements/#field-value) type: `Boolean`, `Float`, `Integer`, `String`, or `UnsignedInteger`   |
| `<timestamp>` | Time the rejected point was logged                                                                                                                        |

#### Find parsing errors

If InfluxDB can't parse a line (for example, due to syntax problems), the response `message` might not provide details.
To find parsing error details, query `rejected_points` entries that contain the `error` field.

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

If you write to a bucket with an
[explicit schema](/influxdb/cloud/admin/buckets/bucket-schema/),
the data must conform to the schema. Otherwise, InfluxDB rejects the data.

Do the following to interpret explicit schema rejections:

- [Detect a measurement mismatch](#detect-a-measurement-mismatch)
- [Detect a field type mismatch](#detect-a-field-type-mismatch)

#### Detect a measurement mismatch

InfluxDB rejects a point if the [measurement](/influxdb/cloud/reference/key-concepts/data-elements/#measurement) doesn't match the **name** of a [bucket schema](/influxdb/cloud/admin/buckets/bucket-schema/).
The `rejected_points` entry contains the following `reason` tag value:

| Reason                              | Meaning                                                                                                                |
|:------                              |:-------
| `measurement not allowed by schema` | The **bucket** is configured to use explicit schemas and none of the schemas matches the **measurement** of the point. |

Consider the following [line protocol](/influxdb/cloud/reference/syntax/line-protocol) data.

```
airSensors,sensorId=TLM0201 temperature=73.97,humidity=35.23,co=0.48 1637014074
```

The line has an `airSensors` measurement and three fields (`temperature`, `humidity`, and `co`).
If you try to write this data to a bucket that has the [`explicit` schema type](/influxdb/cloud/admin/buckets/bucket-schema/) and doesn't have an `airSensors` schema, the `/api/v2/write` InfluxDB API returns an error and the following data:

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

#### Detect a field type mismatch

InfluxDB rejects a point if the [measurement](/influxdb/cloud/reference/key-concepts/data-elements/#measurement) matches the **name** of a bucket schema and the field data types don't match.
The `rejected_points` entry contains the following reason:

| Reason                              | Meaning                                                                                              |
|:------------------------------------|:-----------------------------------------------------------------------------------------------------|
| `field type mismatch with schema`   | The point has the same measurement as a configured schema and they have different field value types. |

Consider a bucket that has the following `airSensors` [`explicit bucket schema`](/influxdb/cloud/admin/buckets/bucket-schema/):

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

The following [line protocol](/influxdb/cloud/reference/syntax/line-protocol/) data has an `airSensors` measurement, a `sensorId` tag, and three fields (`temperature`, `humidity`, and `co`).

```
airSensors,sensorId=L1 temperature=90.5,humidity=70.0,co=0.2 1637014074
airSensors,sensorId=L1 temperature="90.5",humidity=70.0,co=0.2 1637014074
```

In the example data above, the second point has a `temperature` field value with the _string_ data type.
Because the `airSensors` schema requires `temperature` to have the _float_ data type,
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

{{% /show-in %}}