---
title: View buckets
seotitle: View buckets in InfluxDB
description: View a list of all the buckets for an organization in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  v2_0:
    name: View buckets
    parent: Manage buckets
weight: 202
---

## View a list of buckets

## View buckets in the InfluxDB UI

1. In the navigation menu on the left, select **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

    A list of buckets with their retention policies and IDs appears.

2. Click a bucket to open it in the **Data Explorer**.
3. Click the bucket ID to copy it to the clipboard. <img>

## View buckets using the influx CLI

Use the [`influx bucket list` command](/v2.0/reference/cli/influx/bucket/list)
to view a buckets in an organization.

```sh
influx bucket list
```

Other filtering options such as filtering by organization, name, or ID are available.
See the [`influx bucket list` documentation](/v2.0/reference/cli/influx/bucket/list)
for information about other available flags.
