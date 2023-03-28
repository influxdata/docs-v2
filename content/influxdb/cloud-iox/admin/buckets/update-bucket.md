---
title: Update a bucket
seotitle: Update a bucket in InfluxDB
description: Update a bucket's name or retention period in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_cloud_iox:
    name: Update a bucket
    parent: Manage buckets
weight: 202
aliases:
    - /influxdb/cloud-iox/organizations/buckets/update-bucket/
---

Use the InfluxDB user interface (UI), the `influx` command line interface (CLI), or the InfluxDB HTTP API to update a bucket.

Note that updating a bucket's name will affect any resources that reference the bucket by name, including the following:

  - Queries
  - Dashboards
  - Tasks
  - Telegraf configurations
  - Templates

If you change a bucket name, be sure to update the bucket name in the above places and any resources that reference it.

## Update a bucket's name in the InfluxDB UI

1. In the navigation menu on the left, select **Load Data** > **Buckets**.

    {{< nav-icon "data" >}}

2. Click **{{< caps >}}Settings{{< /caps >}}** to the right of the bucket you want to rename.
3. Click **{{< caps >}}Rename{{< /caps >}}**.
3. Review the information in the window that appears and click **{{< caps >}}I understand, let's rename my bucket{{< /caps >}}**.
4. Update the bucket's name and click **Change Bucket Name**.

## Update a bucket's retention period in the InfluxDB UI

1. In the navigation menu on the left, select **Load Data** > **Buckets**.

    {{< nav-icon "data" >}}

2. Click **{{< caps >}}Settings{{< /caps >}}** next to the bucket you want to update.
3. In the window that appears, under **Delete data**, select a retention period:

    - **{{< caps >}}Never{{< /caps >}}**: data in the bucket is retained indefinitely.
    - **{{< caps >}}Older Than{{< /caps >}}**: select a predefined retention period from the dropdown menu.

    {{% note %}}
Use the [`influx bucket update` command](#update-a-buckets-retention-period)
or the [InfluxDB HTTP API `PATCH /api/v2/buckets` endpoint](/influxdb/cloud-iox/api/#operation/PatchBucketsID) to set a custom retention period.
    {{% /note %}}
5. Click **{{< caps >}}Save Changes{{< /caps >}}**.

## Update a bucket using the influx CLI

Use the [`influx bucket update` command](/influxdb/cloud-iox/reference/cli/influx/bucket/update)
to update a bucket.
Updating a bucket requires the following:

- The bucket ID _(provided in the output of `influx bucket list`)_

{{< cli/influx-creds-note >}}

##### Update the name of a bucket

```sh
# Syntax
influx bucket update -i <bucket-id> -n <new-bucket-name>

# Example
influx bucket update -i 034ad714fdd6f000 -n my-new-bucket
```

##### Update a bucket's retention period

Valid retention period duration units:

- nanoseconds (`ns`)
- microseconds (`us` or `µs`)
- milliseconds (`ms`)
- seconds (`s`)
- minutes (`m`)
- hours (`h`)
- days (`d`)
- weeks (`w`)

{{% note %}}
The minimum retention period is **one hour**.
{{% /note %}}

```sh
# Syntax
influx bucket update -i <bucket-id> -r <retention period with units>

# Example
influx bucket update -i 034ad714fdd6f000 -r 1209600000000000ns
```

## Update a bucket using the HTTP API

Use the InfluxDB HTTP API [`PATCH /api/v2/buckets` endpoint](/influxdb/cloud-iox/api/#operation/PatchBucketsID)
to update a bucket.

Updating a bucket requires the following:

- The bucket ID _(provided in the output of the `GET /api/v2/buckets/` endpoint)_

You can update the following bucket properties:
- name
- description
- retention rules

1. To find the bucket ID, send a request to the HTTP API [`GET /api/v2/buckets/` endpoint](/influxdb/cloud-iox/api/#operation/GetBuckets) to retrieve the list of buckets. <!-- @TODO: provide API auth note about tokens and read access to buckets -->

    {{< api-endpoint method="get" endpoint="https://cloud2.influxdata.com/api/v2/buckets" >}}

2. Send a request to the HTTP API [PATCH `/api/v2/buckets/{BUCKET_ID}` endpoint](/influxdb/cloud-iox/api/#operation/PatchBucketsID).

    In the URL path, specify the ID of the bucket from the previous step that you want to update.
    In the request body, set the properties that you want to update--for example:

    {{< api-endpoint method="patch" endpoint="https://cloud2.influxdata.com/api/v2/buckets/{BUCKET_ID}" >}}

    ```js
    {
      "name": "air_sensor",
      "description": "bucket holding air sensor data",
      "retentionRules": [
          {
              "type": "expire",
              "everySeconds": 2592000
          }
      ]
    }
    ```
