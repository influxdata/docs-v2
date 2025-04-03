
Use the [`influx` CLI](/influxdb/version/reference/cli/influx/) or the InfluxDB API
[`/api/v2/delete`](/influxdb/version/api/#operation/PostDelete) endpoint to delete
data from an InfluxDB bucket.

- [Delete data using the influx CLI](#delete-data-using-the-influx-cli)
- [Delete data using the API](#delete-data-using-the-api)

InfluxDB {{< current-version >}} supports deleting data by the following:

- time range
- measurement (`_measurement`)
- tag
{{% show-in "cloud,cloud-serverless" %}}- field (`_field`){{% /show-in %}}

{{% show-in "v2" %}}

{{% warn %}}
#### Cannot delete data by field
InfluxDB {{< current-version >}} does not support deleting data **by field**.
{{% /warn %}}

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

In InfluxDB Cloud, writes and deletes are asynchronous and eventually consistent.
Once InfluxDB validates your request and queues the delete,
it sends a _success_ response (HTTP `204` status code) as an acknowledgement.
To ensure that InfluxDB handles writes and deletes in the order you request them, wait for the acknowledgement before you send the next request.
Once InfluxDB executes a queued delete, the deleted data is no longer queryable,
but will remain on disk until the compaction service runs.

{{% /show-in %}}

{{% show-in "v2" %}}

Once a delete request completes successfully, the deleted data is no longer queryable,
but will remain on disk until the compaction service runs.

{{% /show-in %}}

## Delete data using the influx CLI

{{% note %}}
Use [InfluxDB CLI connection configurations](/influxdb/version/reference/cli/influx/config/)
to provide your **InfluxDB host, organization, and API token**.
{{% /note %}}

1. Use the [`influx delete` command](/influxdb/version/reference/cli/influx/delete/) to delete points from InfluxDB.
2. Use the `--bucket` flag to specify which bucket to delete data from.
3. Use the `--start` and `--stop` flags to define the time range to delete data from.
   Use [RFC3339 timestamps](/influxdb/version/reference/glossary/#rfc3339-timestamp).
4. _(Optional)_ Use the `-p`, `--predicate` flag to include a [delete predicate](/influxdb/version/reference/syntax/delete-predicate)
   that identifies which points to delete.

    {{% warn %}}
Deleting data without a [delete predicate](/influxdb/version/reference/syntax/delete-predicate)
deletes all data in the specified bucket with timestamps between the specified `start` and `stop` times.
    {{% /warn %}}

### Examples

- [Delete points in a specific measurement with a specific tag value](#delete-points-in-a-specific-measurement-with-a-specific-tag-value)
- [Delete all points in a specified time range](#delete-all-points-in-a-specified-time-range)
{{% show-in "cloud,cloud-serverless" %}}
- [Delete points for a specific field in a specified time range](#delete-points-for-a-specific-field-in-a-specified-time-range)
{{% /show-in %}}

##### Delete points in a specific measurement with a specific tag value
```sh
influx delete --bucket example-bucket \
  --start '1970-01-01T00:00:00Z' \
  --stop $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
  --predicate '_measurement="example-measurement" AND exampleTag="exampleTagValue"'
```

##### Delete all points in a specified time range
```sh
influx delete --bucket example-bucket \
  --start 2020-03-01T00:00:00Z \
  --stop 2020-11-14T00:00:00Z
```

{{% show-in "cloud,cloud-serverless" %}}

##### Delete points for a specific field in a specified time range
```sh
influx delete --bucket example-bucket \
  --start 2022-01-01T00:00:00Z \
  --stop 2022-02-01T00:00:00Z \
  --predicate '_field="example-field"'
```

{{% /show-in %}}

## Delete data using the API
Use the InfluxDB API [`/api/v2/delete` endpoint](/influxdb/version/api/#operation/PostDelete)
to delete points from InfluxDB.

{{< api-endpoint method="post" endpoint="http://localhost:8086/api/v2/delete" api-ref="/influxdb/version/api/#operation/PostDelete" >}}

Include the following:

- **Request method:** `POST`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB API token
  - **Content-type:** `application/json`
- **Query parameters:**
  - **org** or **orgID:** organization name or [organization ID](/influxdb/version/admin/organizations/view-orgs/#view-your-organization-id)
  - **bucket** or **bucketID:** bucket name or [bucket ID](/influxdb/version/admin/buckets/view-buckets/)
- **Request body:** JSON object with the following fields:  
  {{< req type="key" >}}
  - {{< req "\*" >}} **start:** earliest time to delete data from ([RFC3339](/influxdb/version/reference/glossary/#rfc3339-timestamp))
  - {{< req "\*" >}} **stop:** latest time to delete data from ([RFC3339](/influxdb/version/reference/glossary/#rfc3339-timestamp))
  - **predicate:** [delete predicate](/influxdb/version/reference/syntax/delete-predicate) statement

       {{% warn %}}
Deleting data without a [delete predicate](/influxdb/version/reference/syntax/delete-predicate)
deletes all data in the specified bucket with timestamps between the specified `start` and `stop` times.
       {{% /warn %}}

### Examples

- [Delete points in a specific measurement with a specific tag value](#delete-points-in-a-specific-measurement-with-a-specific-tag-value-1)
- [Delete all points in a specified time range](#delete-all-points-in-a-specified-time-range-1)
{{% show-in "cloud,cloud-serverless" %}}
- [Delete points for a specific field in a specified time range](#delete-points-for-a-specific-field-in-a-specified-time-range-1)
{{% /show-in %}}

##### Delete points in a specific measurement with a specific tag value
```sh
curl --request POST http://localhost:8086/api/v2/delete?org=example-org&bucket=example-bucket \
  --header 'Authorization: Token YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "start": "2020-03-01T00:00:00Z",
    "stop": "2020-11-14T00:00:00Z",
    "predicate": "_measurement=\"example-measurement\" AND exampleTag=\"exampleTagValue\""
  }'
```

##### Delete all points in a specified time range
```sh
curl --request POST http://localhost:8086/api/v2/delete?org=example-org&bucket=example-bucket \
  --header 'Authorization: Token YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "start": "2020-03-01T00:00:00Z",
    "stop": "2020-11-14T00:00:00Z"
  }'
```

{{% show-in "cloud,cloud-serverless" %}}

##### Delete points for a specific field in a specified time range
```sh
curl --request POST http://localhost:8086/api/v2/delete?org=example-org&bucket=example-bucket \
  --header 'Authorization: Token YOUR_API_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "start": "2022-01-01T00:00:00Z",
    "stop": "2022-02-01T00:00:00Z",
    "predicate": "_field=\"example-field\""
  }'
```

{{% /show-in %}}

_For more information, see the [`/api/v2/delete` endpoint documentation](/influxdb/version/api/#operation/PostDelete)._

To delete a bucket see [Delete a bucket](/influxdb/version/admin/buckets/delete-bucket/).
