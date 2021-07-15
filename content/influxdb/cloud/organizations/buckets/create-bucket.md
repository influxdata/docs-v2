---
title: Create a bucket
seotitle: Create a bucket in InfluxDB
description: Create buckets to store time series data in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_cloud:
    name: Create a bucket
    parent: Manage buckets
weight: 201
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create a bucket.

## Create a bucket in the InfluxDB UI

There are two places you can create a bucket in the UI.

### Create a bucket from the Load Data menu

1. In the navigation menu on the left, select **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

2. Click **{{< icon "plus" >}} Create Bucket** in the upper right.
3. Enter a **Name** for the bucket.
4. Select when to **Delete Data**:
    - **Never** to retain data forever.  
    - **Older than** to choose a specific retention period.
5. Click **Create** to create the bucket.

### Create a bucket in the Data Explorer

1. In the navigation menu on the left, select **Explore* (**Data Explorer**).

    {{< nav-icon "data-explorer" >}}

2. In the **From** panel in the Flux Builder, select `+ Create Bucket`.
3. Enter a **Name** for the bucket.
4. Select when to **Delete Data**:
    - **Never** to retain data forever.  
    - **Older than** to choose a specific retention period.
5. Click **Create** to create the bucket.

## Create a bucket using the influx CLI

Use the [`influx bucket create` command](/influxdb/cloud/reference/cli/influx/bucket/create)
to create a new bucket. A bucket requires the following:

- bucket name
- organization name or ID
- retention period (duration to keep data) in one of the following units:
  - nanoseconds (`ns`)
  - microseconds (`us` or `µs`)
  - milliseconds (`ms`)
  - seconds (`s`)
  - minutes (`m`)
  - hours (`h`)
  - days (`d`)
  - weeks (`w`)

```sh
# Syntax
influx bucket create -n <bucket-name> -o <org-name> -r <retention-period-duration>

# Example
influx bucket create -n my-bucket -o my-org -r 72h
```
### Create a bucket with an explicit schema

{{% bucket-schema/type %}}

  1.
      ```sh
     {{< get-shared-text "bucket-schema/bucket-schema-type.sh" >}}
     ```

  2. Create a bucket schema. For more information, see [Manage bucket schemas](/influxdb/cloud/organizations/buckets/bucket-schema/).

      ```sh
      influx bucket-schema create \
        --bucket my_schema_bucket \
        --name temperature \
        --columns-file schema.json
      ```
