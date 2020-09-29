---
title: Delete a bucket
seotitle: Delete a bucket from InfluxDB
description: Delete a bucket from InfluxDB using the InfluxDB UI or the influx CLI
menu:
  influxdb_2_0:
    name: Delete a bucket
    parent: Manage buckets
weight: 203
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to delete a bucket.

## Delete a bucket in the InfluxDB UI

1. In the navigation menu on the left, select **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

2. Hover over the bucket you would like to delete.
3. Click **{{< icon "delete" >}} Delete Bucket** and **Confirm** to delete the bucket.

## Delete a bucket using the influx CLI

Use the [`influx bucket delete` command](/influxdb/v2.0/reference/cli/influx/bucket/delete)
to delete a bucket a bucket by name or ID.

### Delete a bucket by name
**To delete a bucket by name, you need:**

- Bucket name
- Bucket's organization name or ID

<!-- -->
```sh
# Syntax
influx bucket delete -n <bucket-name> -o <org-name>

# Example
influx bucket delete -n my-bucket -o my-org
```

### Delete a bucket by ID
**To delete a bucket by ID, you need:**

- Bucket ID _(provided in the output of `influx bucket list`)_

<!-- -->
```sh
# Syntax
influx bucket delete -i <bucket-id>

# Example
influx bucket delete -i 034ad714fdd6f000
```
