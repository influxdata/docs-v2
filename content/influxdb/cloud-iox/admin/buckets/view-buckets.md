---
title: View buckets
seotitle: View buckets in InfluxDB Cloud
description: View a list of all the buckets for an organization in InfluxDB Cloud using the InfluxDB UI, influx CLI, or InfluxDB HTTP API.
menu:
  influxdb_cloud_iox:
    name: View buckets
    parent: Manage buckets
weight: 202
aliases:
  - /influxdb/cloud-iox/organizations/buckets/view-buckets/
---

## View buckets in the InfluxDB UI

1. In the navigation menu on the left, select **Load Data** > **Buckets**.

    {{< nav-icon "data" >}}

    A list of buckets with their retention policies and IDs appears.

2. Click a bucket to open it in the **Data Explorer**.
3. Click the bucket ID to copy it to the clipboard.

## View buckets using the influx CLI

Use the [`influx bucket list` command](/influxdb/cloud-iox/reference/cli/influx/bucket/list)
to view buckets in an organization.

```sh
influx bucket list
```

Other filtering options such as filtering by a name or ID are available.
See the [`influx bucket list` documentation](/influxdb/cloud-iox/reference/cli/influx/bucket/list)
for information about other available flags.

## View buckets using the InfluxDB HTTP API

Send a request to the InfluxDB HTTP API [`/api/v2/buckets` endpoint](/influxdb/cloud-iox/api/#operation/GetBuckets) to view buckets in an organization.

{{% api-endpoint method="get" endpoint="https://cloud2.influxdata.com/api/v2/buckets" %}}


