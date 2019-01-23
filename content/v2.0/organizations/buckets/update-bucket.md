---
title: Update a bucket
seotitle: Update a bucket in InfluxDB
description: placeholder
menu:
  v2_0:
    name: Update a bucket
    parent: Manage buckets
    weight: 2
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to update a bucket.

## Update a bucket in the InfluxDB UI

1. Click the **Organizations** tab in the navigation bar.

    {{< img-hd src="/img/organizations-icon.png" title="Organizations icon" />}}

2. Click on the name of an organization, then select the **Buckets** tab. All of the organization's buckets appear.
3. To update a bucket's name or retention policy, click the name of the bucket from the list.
4. Click **Update** to save.

## Update a bucket using the influx CLI

Use the the [`influx bucket update` command](/v2.0/reference/cli/influx/bucket/update)
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
