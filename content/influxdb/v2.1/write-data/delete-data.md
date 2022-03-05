---
title: Delete data
list_title: Delete data
description: >
  Use the `influx` CLI or the InfluxDB API `/api/v2/delete` endpoint to delete
  data from an InfluxDB Bucket.
menu:
  influxdb_2_1:
    name: Delete data
    parent: Write data
weight: 107
influxdb/v2.1/tags: [delete]
related:
  - /influxdb/v2.1/reference/syntax/delete-predicate/
  - /influxdb/v2.1/reference/cli/influx/delete/
---

Use the [`influx` CLI](/influxdb/v2.1/reference/cli/influx/) or the InfluxDB API
[`/api/v2/delete`](/influxdb/v2.1/api/#operation/PostDelete) endpoint to delete
data from an InfluxDB Bucket.

- [Delete data using the influx CLI](#delete-data-using-the-influx-cli)
- [Delete data using the API](#delete-data-using-the-api)

InfluxDB {{< current-version >}} supports deleting data by the following:

- time range
- measurement (`_measurement`)
- tag
- {{% cloud-only %}}field (`_field`){{% /cloud-only %}}

{{% oss-only %}}

{{% warn %}}
InfluxDB {{< current-version >}} does not support deleting data by field.
{{% /warn %}}

{{% /oss-only %}}

Once a delete request completes successfully, the deleted data is no longer queryable,
but will remain on disk until the compaction service runs.

## Delete data using the influx CLI

{{% note %}}
Use [InfluxDB CLI connection configurations](/influxdb/v2.1/reference/cli/influx/config/)
to provide your **InfluxDB host, organization, and API token**.
{{% /note %}}

1. Use the [`influx delete` command](/influxdb/v2.1/reference/cli/influx/delete/) to delete points from InfluxDB.
2. Use the `--bucket` flag to specify which bucket to delete data from.
3. Use the `--start` and `--stop` flags to define the time range to delete data from.
   Use [RFC3339 timestamps](/influxdb/v2.1/reference/glossary/#rfc3339-timestamp).
4. _(Optional)_ Use the `-p`, `--predicate` flag to include a [delete predicate](/influxdb/v2.1/reference/syntax/delete-predicate)
   that identifies which points to delete.

    {{% warn %}}
Deleting data without a [delete predicate](/influxdb/v2.1/reference/syntax/delete-predicate)
deletes all data in the specified bucket with timestamps between the specified `start` and `stop` times.
    {{% /warn %}}

### Examples

##### Delete points in a specific measurement with a specific tag value
```sh
influx delete --bucket example-bucket \
  --start '1970-01-01T00:00:00Z' \
  --stop $(date +"%Y-%m-%dT%H:%M:%SZ") \
  --predicate '_measurement="example-measurement" AND exampleTag="exampleTagValue"'
```

##### Delete all points in a specified time range
```sh
influx delete --bucket example-bucket \
  --start 2020-03-01T00:00:00Z \
  --stop 2020-11-14T00:00:00Z
```

## Delete data using the API
Use the InfluxDB API [`/api/v2/delete` endpoint](/influxdb/v2.1/api/#operation/PostDelete)
to delete points from InfluxDB.

{{< api-endpoint method="post" endpoint="http://localhost:8086/api/v2/delete" >}}

Include the following:

- **Request method:** `POST`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB API token
  - **Content-type:** `application/json`
- **Query parameters:**
  - **org** or **orgID:** organization name or [organization ID](/influxdb/v2.1/organizations/view-orgs/#view-your-organization-id)
  - **bucket** or **bucketID:** bucket name or [bucket ID](/influxdb/v2.1/organizations/buckets/view-buckets/)
- **Request body:** JSON object with the following fields:  
  {{< req type="key" >}}
  - {{< req "\*" >}} **start:** earliest time to delete data from ([RFC3339](/influxdb/v2.1/reference/glossary/#rfc3339-timestamp))
  - {{< req "\*" >}} **stop:** latest time to delete data from ([RFC3339](/influxdb/v2.1/reference/glossary/#rfc3339-timestamp))
  - **predicate:** [delete predicate](/influxdb/v2.1/reference/syntax/delete-predicate) statement

       {{% warn %}}
Deleting data without a [delete predicate](/influxdb/v2.1/reference/syntax/delete-predicate)
deletes all data in the specified bucket with timestamps between the specified `start` and `stop` times.
       {{% /warn %}}

### Examples

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

_For more information, see the [`/api/v2/delete` endpoint documentation](/influxdb/v2.1/api/#operation/PostDelete)._
