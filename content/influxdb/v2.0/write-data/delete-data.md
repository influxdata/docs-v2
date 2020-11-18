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

Use the `influx` CLI or the InfluxDB API [`/delete`](/influxdb/v2.0/api/#/paths/~1delete/post) endpoint to delete data.

{{% note %}}
The `influx delete --predicate` flag is currently disabled and will be re-enabled in an upcoming release. Deleting data without a predicate deletes all data in the specified bucket with timestamps between the specified `start` and `stop` times.
{{% /note %}}

## Delete data using the influx CLI

1. Use the [`influx delete` command](/influxdb/v2.0/reference/cli/influx/delete/) to delete points from InfluxDB.
2. Specify your organization, bucket, and authentication token.
3. Define the time range to delete data from with the `--start` and `--stop` flags.

#### Example

```sh
influx delete -o my-org -b my-bucket -t $INFLUX_TOKEN \
 --start '1970-01-01T00:00:00.00Z' \
 --stop '2020-01-01T00:00:00.00Z' \
```

## Delete data using the API

1. Use the InfluxDB API `/delete` endpoint to delete points from InfluxDB.
2. Include your organization and bucket as query parameters in the request URL.
3. Use the `Authorization` header to provide your InfluxDB authentication token.
4. In your request payload, define the time range to delete data from with `start` and `stop`.

#### Example

```sh
curl --request POST http://localhost:8086/api/v2/delete/?org=myOrg&bucket=myBucket \
  --header 'Authorization: Token <YOURAUTHTOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "start": "1970-01-01T00:00:00.00Z",
  "stop": "2020-01-01T00:00:00.00Z"
  }'
```
   _For more information, see the [`/delete` API documentation](/influxdb/v2.0/api/#/paths/~1delete/post)._
