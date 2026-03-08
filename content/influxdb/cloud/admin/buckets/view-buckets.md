---
title: View buckets
seotitle: View buckets in InfluxDB
description: View a list of all the buckets for an organization in InfluxDB using the InfluxDB UI, influx CLI, or InfluxDB HTTP API.
menu:
  influxdb_cloud:
    name: View buckets
    parent: Manage buckets
weight: 202
aliases:
  - /influxdb/cloud/organizations/buckets/view-buckets/
alt_links:
  cloud-serverless: /influxdb3/cloud-serverless/admin/buckets/view-buckets/
  cloud-dedicated: /influxdb3/cloud-dedicated/admin/databases/list/
  clustered: /influxdb3/clustered/admin/databases/list/
---

## View buckets in the InfluxDB UI

1. In the navigation menu on the left, select **Load Data** > **Buckets**.

    {{< nav-icon "data" >}}

    A list of buckets with their retention policies and IDs appears.

2. Click a bucket to open it in the **Data Explorer**.
3. Click the bucket ID to copy it to the clipboard.

## View buckets using the influx CLI

Use the [`influx bucket list` command](/influxdb/cloud/reference/cli/influx/bucket/list)
to view buckets in an organization.

```sh
influx bucket list
```

Other filtering options such as filtering by a name or ID are available.
See the [`influx bucket list` documentation](/influxdb/cloud/reference/cli/influx/bucket/list)
for information about other available flags.

## View buckets using the InfluxDB HTTP API

Send a request to the InfluxDB HTTP API [`/api/v2/buckets` endpoint](/influxdb/cloud/api/#get-/api/v2/buckets) to view buckets in an organization.

{{% api-endpoint method="get" endpoint="https://cloud2.influxdata.com/api/v2/buckets" api-ref="/influxdb/cloud/api/#get-/api/v2/buckets" %}}