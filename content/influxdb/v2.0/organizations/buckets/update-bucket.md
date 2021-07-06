---
title: Update a bucket
seotitle: Update a bucket in InfluxDB
description: Update a bucket's name or retention period in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_2_0:
    name: Update a bucket
    parent: Manage buckets
weight: 202
---

Use the `influx` command line interface (CLI) or the InfluxDB user interface (UI) to update a bucket.

Note that updating an bucket's name will affect any assets that reference the bucket by name, including the following:

  - Queries
  - Dashboards
  - Tasks
  - Telegraf configurations
  - Templates

If you change a bucket name, be sure to update the bucket in the above places as well.

## Update a bucket's name in the InfluxDB UI

1. In the navigation menu on the left, select **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

2. Click **Settings** under the bucket you want to rename.
3. Click **Rename**.
3. Review the information in the window that appears and click **I understand, let's rename my bucket**.
4. Update the bucket's name and click **Change Bucket Name**.

## Update a bucket's retention period in the InfluxDB UI

1. In the navigation menu on the left, select **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

2. Click **Settings** next to the bucket you want to update.
3. In the window that appears, edit the bucket's retention period.
4. Click **Save Changes**.

## Update a bucket using the influx CLI

Use the [`influx bucket update` command](/influxdb/v2.0/reference/cli/influx/bucket/update)
to update a bucket. Updating a bucket requires the following:

- The bucket ID _(provided in the output of `influx bucket list`)_
- The name or ID of the organization the bucket belongs to.

##### Update the name of a bucket

```sh
# Syntax
influx bucket update -i <bucket-id> -o <org-name> -n <new-bucket-name>

# Example
influx bucket update -i 034ad714fdd6f000 -o my-org -n my-new-bucket
```

##### Update a bucket's retention period

Valid retention period duration units are nanoseconds (`ns`), microseconds (`us` or `µs`), milliseconds (`ms`), seconds (`s`), minutes (`m`), hours (`h`), days (`d`), or weeks (`w`).

```sh
# Syntax
influx bucket update -i <bucket-id> -r <retention period in nanoseconds>

# Example
influx bucket update -i 034ad714fdd6f000 -r 1209600000000000 -t $INFLUX_TOKEN
```
