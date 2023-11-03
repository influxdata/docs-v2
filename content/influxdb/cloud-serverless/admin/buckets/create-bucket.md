---
title: Create a bucket
seotitle: Create a bucket in InfluxDB Cloud Serverless
description: >
  Create buckets to store time series data in InfluxDB Cloud Serverless
  using the InfluxDB UI, influx CLI, or InfluxDB HTTP API.
menu:
  influxdb_cloud_serverless:
    name: Create a bucket
    parent: Manage buckets
weight: 201
related:
  - /influxdb/cloud-serverless/admin/buckets/manage-explicit-bucket-schemas/
aliases:
  - /influxdb/cloud-serverless/organizations/buckets/create-bucket/
alt_links:
  cloud: /influxdb/cloud/admin/buckets/create-bucket/
---

Use the InfluxDB user interface (UI), `influx` command line interface (CLI), or InfluxDB HTTP API
to create a bucket.

<!-- Invisible anchor for "Create a bucket" -->
<span id="create-a-bucket"></span>

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

<!------------------------------ BEGIN UI CONTENT ----------------------------->
{{% tab-content %}}

There are two places you can create a bucket in the UI.

- [Create a bucket from the Load Data menu](#create-a-bucket-from-the-load-data-menu)
- [Create a bucket in the Data Explorer](#create-a-bucket-in-the-data-explorer)

### Create a bucket from the Load Data menu

1. In the navigation menu on the left, select **Load Data** > **Buckets**.

{{< nav-icon "data" >}}

2. Click **{{< icon "plus" >}} Create Bucket** in the upper right.
3. Enter a **Name** for the bucket.
4. Select when to **Delete Data**:
    - **Never** to retain data forever.  
    - **Older than** to choose a specific retention period.
5. Click **Create** to create the bucket.

{{% /tab-content %}}
<!------------------------------- END UI CONTENT ------------------------------>

<!----------------------------- BEGIN CLI CONTENT ----------------------------->
{{% tab-content %}}

To create a bucket with the `influx` CLI, use the [`influx bucket create` command](/influxdb/cloud-serverless/reference/cli/influx/bucket/create)
and specify values for the following flags:

- `-o`, `--org`: Organization name
- `-n`, `--name`: Bucket name
- `-r`, `--retention`: Retention period duration

The following example creates a bucket with a retention period of 72 hours:

```sh
influx bucket create \
  --name my-bucket \
  --org {INFLUX_ORG} \
  --retention 72h
```

{{% /tab-content %}}
<!------------------------------ END CLI CONTENT ------------------------------>

<!----------------------------- BEGIN API CONTENT ----------------------------->
{{% tab-content %}}

To create a bucket with the InfluxDB HTTP API, send a request to the following endpoint:

{{< api-endpoint method="post" endpoint="https://{{< influxdb/host >}}/api/v2/buckets" api-ref="/influxdb/cloud-serverless/api/#operation/PostBuckets" >}}

Include the following in your request:

- **Headers:**
  - **Authorization:** `Token` scheme with your InfluxDB [API token](/influxdb/cloud/admin/tokens/)
  - **Content-type:** `application/json`
- **Request body:** JSON object with the following fields:  
  {{< req type="key" >}}
  - {{< req "\*" >}} **name:** Bucket name
  - **orgID:** InfluxDB organization ID
  - **description:** Bucket description
  - {{< req "\*" >}} **retentionRules:** JSON array containing a single object
    with the following fields:
    - **type:** expire
    - **everySecond**: Number of seconds to retain data _(0 means forever)_
    - **shardGroupDuration**: Number of seconds to retain shard groups _(0 means forever)_

The following example creates a bucket with a retention period of `86,400` seconds, or 24 hours:

```sh
{{% get-shared-text "api/v2.0/buckets/oss/create.sh" %}}
```

_For information about **InfluxDB API options and response codes**, see
[InfluxDB API Buckets reference documentation](/influxdb/cloud-serverless/api/#operation/PostBuckets)._

{{% /tab-content %}}
<!------------------------------ END API CONTENT ------------------------------>
{{< /tabs-wrapper >}}
