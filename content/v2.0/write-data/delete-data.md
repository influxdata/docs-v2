---
title: Delete data
list_title: Delete data
description: >
  Delete data in the InfluxDB UI.
menu:
  v2_0:
    name: Delete data
    parent: Write data
weight: 104
v2.0/tags: [delete]
related:
  - /v2.0/reference/syntax/delete-predicate/
  - /v2.0/reference/cli/influx/delete/
---

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
  - Click **+ Add Filter** to filter by tag key and value pair.
  - Select **I understand that this cannot be undone**.
4. Click **Confirm Delete** to delete the selected data.

## Delete data using the influx CLI
Use the [`influx delete` command](/v2.0/reference/cli/influx/delete/) to delete points from InfluxDB.
Specify your organization, bucket, and authentication token.
Define the time range to delete data from with the `--start` and `--stop` flags.
Specify which points to delete using the `--predicate` or `-p` flag and
[Delete predicate syntax](/v2.0/reference/syntax/delete-predicate/).

```sh
influx delete -o my-org -b my-bucket -t $INFLUX_TOKEN \
  --start '1970-01-01T00:00:00.00Z' \
  --stop '2020-01-01T00:00:00.00Z' \
  --predicate '_measurement="sensors" and sensorID="abc123"'
```

{{% warn %}}
Running `influx delete` without the `-p` or `--predicate` flag deletes all data with
timestamps between the specified `--start` and `--stop` times in the specified bucket.
{{% /warn %}}

## Delete data using the API
Use the InfluxDB API `/delete` endpoint to delete points from InfluxDB.
Include your organization and bucket as query parameters in the request URL.
Use the `Authorization` header to provide your InfluxDB authentication token.
In your request payload, define the time range to delete data from with `start` and `stop`.
Specify which points to delete using the `predicate` and
[Delete predicate syntax](/v2.0/reference/syntax/delete-predicate/).

```sh
curl -XPOST http://localhost:9999/api/v2/delete/?org=my-org&bucket=mybucket \
  -H 'Authorization: Token <YOURAUTHTOKEN>' \
  -d '{
        "start": "1970-01-01T00:00:00.00Z",
        "stop": "2020-01-01T00:00:00.00Z",
        "predicate": "_measurement=\"sensors\" and sensorID=\"abc123\""
      }'
```

_For more information, see the [`/delete` API documentation](/v2.0/api/#/paths/~1delete/post)._

{{% warn %}}
Using the `/delete` endpoint without a `predicate` deletes all data with
timestamps between the specified `start` and `stop` times in the specified bucket.
{{% /warn %}}
