---
title: Update a bucket
seotitle: Update a bucket in InfluxDB
description: Update a bucket's name or retention policy in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  v2_0:
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
- Client libraries

If you change a bucket name, be sure to update the bucket in the above places as well.


## Update a bucket in the InfluxDB UI

1. Click the **Settings** tab in the navigation bar.

    {{< nav-icon "settings" >}}

2. Select the **Buckets** tab.
3. To update a bucket's name or retention policy, click the name of the bucket from the list.
4. Click **Update** to save.

## Update a bucket using the influx CLI

Use the [`influx bucket update` command](/v2.0/reference/cli/influx/bucket/update)
to update a bucket. Updating a bucket requires the following:

- The bucket ID _(provided in the output of `influx bucket find`)_
- The name or ID of the organization to which the bucket belongs

##### Update the name of a bucket
```sh
# Pattern
influx bucket update -i <bucket-id> -o <org-name> -n <new-bucket-name>

# Example
influx bucket update -i 034ad714fdd6f000 -o my-org -n my-new-bucket
```

##### Update a bucket's retention policy
```sh
# Pattern
influx bucket update -i <bucket-id> -o <org-name> -r <retention period in nanoseconds>

# Example
influx bucket update -i 034ad714fdd6f000 -o my-org -r 1209600000000000
```
