---
title: View buckets
seotitle: View buckets in InfluxDB Cloud Serverless
description: >
  View a list of all the buckets for an organization in InfluxDB Cloud Serverless
  using the InfluxDB UI, influx CLI, or InfluxDB HTTP API.
menu:
  influxdb3_cloud_serverless:
    name: View buckets
    parent: Manage buckets
weight: 202
aliases:
  - /influxdb3/cloud-serverless/organizations/buckets/view-buckets/
  - /influxdb3/cloud-serverless/admin/buckets/view/
alt_links:
  cloud: /influxdb/cloud/admin/buckets/view-buckets/
---

## View buckets in the InfluxDB UI

1. In the navigation menu on the left, select **Load Data** > **Buckets**.

    {{< nav-icon "data" >}}

    A list of buckets with their retention policies and IDs appears.

2. Click a bucket to open it in the **Data Explorer**.
3. Click the bucket ID to copy it to the clipboard.

## View buckets using the influx CLI

Use the [`influx bucket list` command](/influxdb3/cloud-serverless/reference/cli/influx/bucket/list)
to view buckets in an organization.

```sh
influx bucket list
```

Other filtering options such as filtering by a name or ID are available.
See the [`influx bucket list` documentation](/influxdb3/cloud-serverless/reference/cli/influx/bucket/list)
for information about other available flags.

## View buckets using the InfluxDB HTTP API

Send a request to the InfluxDB HTTP API [`/api/v2/buckets` endpoint](/influxdb3/cloud-serverless/api/#get-/api/v2/buckets) to view buckets in an organization.

{{% api-endpoint method="get" endpoint="https://{{< influxdb/host >}}/api/v2/buckets" api-ref="/influxdb3/cloud-serverless/api/#get-/api/v2/buckets" %}}


