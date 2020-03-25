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

## View buckets in the InfluxDB UI

1. Click **Load Data** in the navigation bar.

    {{< nav-icon "load data" >}}

2. Select **Buckets**.
3. Click on a bucket to open the **Data Explorer** with the bucket selected.

## View buckets using the influx CLI

Use the [`influx bucket list` command](/v2.0/reference/cli/influx/bucket/list)
to view a buckets in an organization.

```sh
influx bucket list
```

Other filtering options such as filtering by organization, name, or ID are available.
See the [`influx bucket list` documentation](/v2.0/reference/cli/influx/bucket/list)
for information about other available flags.
