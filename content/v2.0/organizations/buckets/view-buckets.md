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

1. Click the **Organizations** tab in the navigation bar.

    {{< nav-icon "orgs" >}}

2. Select the **Buckets** tab. 
3. Click on a bucket to view details.

## View buckets using the influx CLI

Use the [`influx bucket find` command](/v2.0/reference/cli/influx/bucket/find)
to view a buckets in an organization. Viewing bucket requires the following:


```sh
influx bucket find
```

Other filtering options such as filtering by organization, name, or ID are available.
See the [`influx bucket find` documentation](/v2.0/reference/cli/influx/bucket/find)
for information about other available flags.
