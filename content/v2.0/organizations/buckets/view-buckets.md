---
title: View buckets
seotitle: View buckets in InfluxDB
description: placeholder
menu:
  v2_0:
    name: View buckets
    parent: Manage buckets
    weight: 2
---

## View buckets in the InfluxDB UI

1. Click the **Organizations** tab in the navigation bar.

    {{< img-hd src="/img/organizations-icon.png" title="Organizations icon" />}}

2. Click on the name of an organization, then select the **Buckets** tab. All of the organization's buckets appear.

_Complete content coming soon_

## View buckets using the influx CLI

Use the the [`influx bucket find` command](/v2.0/reference/cli/influx/bucket/find)
to view a buckets in an organization. Viewing bucket requires the following:


```sh
influx bucket find
```

Other filtering options such as filtering by organization, name, or ID are available.
See the [`influx bucket find` documentation](/v2.0/reference/cli/influx/bucket/find)
for information about other available flags.
