---
title: Create a bucket
seotitle: Create a bucket in InfluxDB Cloud
description: >
  Create buckets to store time series data in InfluxDB Cloud using the InfluxDB
  UI, influx CLI, or InfluxDB HTTP API.
menu:
  influxdb_cloud:
    name: Create a bucket
    parent: Manage buckets
weight: 201
aliases:
  - /influxdb/cloud/organizations/buckets/create-bucket/
alt_links:
  cloud-serverless: /influxdb3/cloud-serverless/admin/buckets/create-bucket/
  cloud-dedicated: /influxdb3/cloud-dedicated/admin/databases/create/
  clustered: /influxdb3/clustered/admin/databases/create/
---

Use the InfluxDB user interface (UI), the `influx` command line interface (CLI),
or the InfluxDB HTTP API to create a bucket.

By default, buckets have an `implicit` **schema-type** and a schema that conforms to your data.
To require measurements to have specific columns and data types and prevent non-conforming write requests,
[create a bucket with the `explicit` schema-type](#create-a-bucket-that-enforces-explicit-schemas).

- [Create a bucket](#create-a-bucket)
- [Create a bucket that enforces explicit schemas](#create-a-bucket-that-enforces-explicit-schemas)
- [Bucket naming restrictions](#bucket-naming-restrictions)

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

1.  In the navigation menu on the left, select **Load Data** > **Buckets**.

{{< nav-icon "data" >}}

2.  Click **{{< icon "plus" >}} Create Bucket** in the upper right.
3.  Enter a **Name** for the bucket
    _(see [Bucket naming restrictions](#bucket-naming-restrictions))_.
4.  Select when to **Delete Data**:
    - **Never** to retain data forever.  
    - **Older than** to choose a specific retention period.
5.  Click **Create** to create the bucket.

### Create a bucket in the Data Explorer

1.  In the navigation menu on the left, select **Explore* (**Data Explorer**).

{{< nav-icon "data-explorer" >}}

2.  In the **From** panel in the Flux Builder, select `+ Create Bucket`.
3.  Enter a **Name** for the bucket _(see [Bucket naming restrictions](#bucket-naming-restrictions))_.
4.  Select when to **Delete Data**:
    - **Never** to retain data forever.  
    - **Older than** to choose a specific retention period.
5.  Click **Create** to create the bucket.

{{% /tab-content %}}
<!------------------------------- END UI CONTENT ------------------------------>

<!----------------------------- BEGIN CLI CONTENT ----------------------------->
{{% tab-content %}}

## Create a bucket using the influx CLI

To create a bucket with the `influx` CLI, use the [`influx bucket create` command](/influxdb/cloud/reference/cli/influx/bucket/create)
and specify values for the following flags:

- `-o`, `--org`: Organization name
- `-n`, `--name`: Bucket name
  _(see [Bucket naming restrictions](#bucket-naming-restrictions))_
- `-r`, `--retention`: Retention period duration

The following example creates a bucket with a retention period of `72` hours:

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

{{< api-endpoint method="post" endpoint="https://cloud2.influxdata.com/api/v2/buckets" api-ref="/influxdb/cloud/api/#post-/api/v2/buckets" >}}

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
[InfluxDB API Buckets reference documentation](/influxdb3/cloud-serverless/api/#post-/api/v2/buckets)._

{{% /tab-content %}}
<!------------------------------ END API CONTENT ------------------------------>

{{< /tabs-wrapper >}}

## Create a bucket that enforces explicit schemas

A bucket with the `explicit` schema-type enforces [measurement schemas that you define for the bucket](/influxdb/cloud/admin/organizations/buckets/bucket-schema/) and rejects writes that don't conform to any of the schemas.

Use the **`influx` CLI** or **InfluxDB HTTP API** to create a bucket with the `explicit` schema-type.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN CLI CONTENT ----------------------------->

Use the `influx bucket create` command and specify the `--schema-type=explicit` flag:

```sh
{{< get-shared-text "bucket-schema/bucket-schema-type.sh" >}}
```

{{% /tab-content %}}
{{% tab-content %}}

<!----------------------------- BEGIN API CONTENT ----------------------------->

Use the HTTP API [`/api/v2/buckets`](/influxdb/cloud/api/#post-/api/v2/buckets)
endpoint and set the `schemaType` property value to `explicit` in the request body--for example:

{{< api-endpoint method="post" endpoint="https://cloud2.influxdata.com/api/v2/buckets" api-ref="/influxdb/cloud/api/#post-/api/v2/buckets" >}}

```js
{
  "orgID": "{INFLUX_ORG_ID}",
  "name": "my-explicit-bucket",
  "description": "My Explicit Bucket",
  "rp": "string",
  "retentionRules": [
    {
      "type": "expire",
      "everySeconds": 86400,
      "shardGroupDurationSeconds": 0
    }
  ],
  "schemaType": "explicit"
}
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

Next, see how to [create an explicit bucket schema](/influxdb/cloud/admin/organizations/buckets/bucket-schema/) for a measurement.

## Bucket naming restrictions

Bucket names must adhere to the following naming restrictions:

- Must contain two or more characters
- Cannot start with an underscore (`_`)
- Cannot contain a double quote (`"`)
