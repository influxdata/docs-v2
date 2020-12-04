---
title: Delete data
list_title: Delete data
description: >
  Delete data in the InfluxDB CLI and API.
menu:
  influxdb_2_0:
    name: Delete data
    parent: Write data
weight: 106
influxdb/v2.0/tags: [delete]
related:
  - /influxdb/v2.0/reference/syntax/delete-predicate/
  - /influxdb/v2.0/reference/cli/influx/delete/
---

<!--
## Delete data in the InfluxDB UI

Delete data from buckets you've created. You cannot delete data from system buckets.

### Delete data from buckets

1. Click **Load Data** in the navigation bar.

    {{< nav-icon "load data" >}}

2. Select **Buckets**.
3. Next to the bucket with data you want to delete, click **Delete Data by Filter**.
4. In the **Delete Data** window that appears:
  - Select a **Target Bucket** to delete data from.
  - Enter a **Time Range** to delete data from.
  - Click **+ Add Filter** to filter by tag key and value pair.
  - Select **I understand that this cannot be undone**.
5. Click **Confirm Delete** to delete the selected data.

### Delete data from the Data Explorer

1. Click the **Data Explorer** icon in the sidebar.

    {{< nav-icon "data-explorer" >}}

2. Click **Delete Data** in the top navigation bar.
3. In the **Delete Data** window that appears:
  - Select a **Target Bucket** to delete data from.
  - Enter a **Time Range** to delete data from.
  - Click **+ Add Filter** to filter by tag key-value pairs.
  - Select **I understand that this cannot be undone**.
4. Click **Confirm Delete** to delete the selected data.
!-->

Use the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/) or the InfluxDB API
[`/api/v2/delete`](/influxdb/v2.0/api/#operation/PostDelete) endpoint to delete data.

- [Delete data using the influx CLI](#delete-data-using-the-influx-cli)
- [Delete data using the API](#delete-data-using-the-api)


## Delete data using the influx CLI

{{% note %}}
Use [InfluxDB CLI connection configurations](/influxdb/v2.0/reference/cli/influx/config/)
to provide your **InfluxDB host, organization, and authentication token**.
{{% /note %}}

1. Use the [`influx delete` command](/influxdb/v2.0/reference/cli/influx/delete/) to delete points from InfluxDB.
2. Use the `--bucket` flag to specify which bucket to delete data from.
3. Use the `--start` and `--stop` flags to define the time range to delete data from.
   Use [RFC3339 timestamps](/influxdb/v2.0/reference/glossary/#rfc3339-timestamp).
4. _(Optional)_ Use the `-p`, `--predicate` flag to include a [delete predicate](/influxdb/v2.0/reference/syntax/delete-predicate)
   that identifies which points to delete.

    {{% warn %}}
Deleting data without a [delete predicate](/influxdb/v2.0/reference/syntax/delete-predicate)
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
Use the InfluxDB API [`/api/v2/delete` endpoint](/influxdb/v2.0/api/#operation/PostDelete)
to delete points from InfluxDB.
Include the following:

- **Request method:** `POST`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB authentication token
  - **Content-type:** `application/json`
- **Query parameters:**
  - **org** or **orgID:** organization name or [organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id)
  - **bucket** or **bucketID:** bucket name or [bucket ID](/influxdb/v2.0/organizations/buckets/view-buckets/)
- **Request body:** JSON object with the following fields:  
  {{< req type="key" >}}
  - {{< req "\*" >}} **start:** earliest time to delete data from ([RFC3339](/influxdb/v2.0/reference/glossary/#rfc3339-timestamp))
  - {{< req "\*" >}} **stop:** latest time to delete data from ([RFC3339](/influxdb/v2.0/reference/glossary/#rfc3339-timestamp))
  - **predicate:** [delete predicate](/influxdb/v2.0/reference/syntax/delete-predicate) statement

       {{% warn %}}
Deleting data without a [delete predicate](/influxdb/v2.0/reference/syntax/delete-predicate)
deletes all data in the specified bucket with timestamps between the specified `start` and `stop` times.
       {{% /warn %}}

#### Examples

##### Delete points in a specific measurement with a specific tag value
```sh
curl --request POST http://localhost:8086/api/v2/delete/?org=example-org&bucket=example-bucket \
  --header 'Authorization: Token <YOURAUTHTOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
    "start": "2020-03-01T00:00:00Z",
    "stop": "2020-11-14T00:00:00Z",
    "predicate": "_measurement=\"example-measurement\" AND exampleTag=\"exampleTagValue\""
  }'
```

##### Delete all points in a specified time range
```sh
curl --request POST http://localhost:8086/api/v2/delete/?org=example-org&bucket=example-bucket \
  --header 'Authorization: Token <YOURAUTHTOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
    "start": "2020-03-01T00:00:00Z",
    "stop": "2020-11-14T00:00:00Z"
  }'
```

_For more information, see the [`/api/v2/delete` endpoint documentation](/influxdb/v2.0/api/#operation/PostDelete)._
