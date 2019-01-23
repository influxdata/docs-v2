---
title: Create a bucket
seotitle: Create a bucket in InfluxDB
description: Create buckets to store time series data.
menu:
  v2_0:
    name: Create a bucket
    parent: Manage buckets
    weight: 1
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create a bucket.

## Create a bucket in the InfluxDB UI

1. Click the **Organizations** tab in the navigation bar.

    {{< img-hd src="/img/organizations-icon.png" title="Organizations icon" />}}

2. Click on the name of an organization, then select the **Buckets** tab.
3. Click **+ Create Bucket** in the upper right.
4. Enter a **Name** for the bucket.
5. Select **How often to clear data?**:  
    Select **Never** to retain data forever.  
    Select **Periodically** to define a specific retention policy.
5. Click **Create** to create the bucket.

## Create a bucket using the influx CLI

Use the the [`influx bucket create` command](/v2.0/reference/cli/influx/bucket/create)
to create a new bucket. A bucket requires the following:

- A name
- The name or ID of the organization to which it belongs
- A retention period in nanoseconds

```sh
# Pattern
influx bucket create -n <bucket-name> -o <org-name> -r <retention period in nanoseconds>

# Example
influx bucket create -n my-bucket -o my-org -r 604800000000000
```
