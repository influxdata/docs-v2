---
title: Delete a bucket
seotitle: Delete a bucket from InfluxDB
description: Delete a bucket and its data.
menu:
  v2_0:
    name: Delete a bucket
    parent: Manage buckets
    weight: 3
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to delete a bucket.

## Delete a bucket in the InfluxDB UI

1. Click the **Organizations** tab in the navigation bar.

    {{< img-hd src="/img/organizations-icon.png" title="Organizations icon" />}}

2. Click on the name of an organization, then select the **Buckets** tab.
3. Hover over the bucket you would like to delete.
4. Click **Delete** and **Confirm** to delete the bucket.

## Delete a bucket using the influx CLI

Use the the [`influx bucket delete` command](/v2.0/reference/cli/influx/bucket/delete)
to delete a bucket. Deleting a bucket requires the following:

- The bucket ID _(provided in the output of `influx bucket find`)_.

```sh
# Pattern
influx bucket delete -i <bucket-id>

# Example
influx bucket delete -i 034ad714fdd6f000
```
