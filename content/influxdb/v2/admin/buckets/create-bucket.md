---
title: Create a bucket
seotitle: Create a bucket in InfluxDB
description: >
  Create buckets to store time series data in InfluxDB using the InfluxDB UI,
  `influx` CLI, or InfluxDB API.
menu:
  influxdb_v2:
    name: Create a bucket
    parent: Manage buckets
weight: 201
aliases:
  - /influxdb/v2/organizations/buckets/create-bucket/
related:
  - /influxdb/v2/reference/internals/data-retention/

---

Use the InfluxDB user interface (UI), the `influx` command line interface (CLI),
or the InfluxDB API to create a bucket.

{{% note %}}
#### Bucket limits
A single InfluxDB {{< current-version >}} OSS instance supports approximately 20 buckets actively being
written to or queried across all organizations depending on the use case.
Any more than that can adversely affect performance.
{{% /note %}}

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

1.  In the navigation menu on the left, select **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

2.  Click **{{< icon "plus" >}} Create Bucket** in the upper right.
3.  Enter a **Name** for the bucket
    _(see [Bucket naming restrictions](#bucket-naming-restrictions))_.
4.  Select when to **Delete Data**:
    - **Never** to retain data forever.  
    - **Older than** to choose a specific retention period.
5.  Click **Create** to create the bucket.

### Create a bucket in the Data Explorer

1.  In the navigation menu on the left, select **Explore (Data Explorer)**.

    {{< nav-icon "data-explorer" >}}

2.  In the **From** panel in the Flux Builder, select `+ Create Bucket`.
3.  Enter a **Name** for the bucket
    _(see [Bucket naming restrictions](#bucket-naming-restrictions))_.
4.  Select when to **Delete Data**:
    - **Never** to retain data forever.  
    - **Older than** to choose a specific retention period.
5.  Click **Create** to create the bucket.

{{% /tab-content %}}
<!------------------------------- END UI CONTENT ------------------------------>


<!----------------------------- BEGIN CLI CONTENT ----------------------------->
{{% tab-content %}}

Use the [`influx bucket create` command](/influxdb/v2/reference/cli/influx/bucket/create)
to create a new bucket.

Include the following flags with the command:

- `-n`, `--name`: Bucket name
    _(see [Bucket naming restrictions](#bucket-naming-restrictions))_
- `-o`, `--org` or `--org-id`: Organization name or ID
- `-r`, `--retention`: Bucket retention period (duration to keep data) in one of the following units:
  - nanoseconds (`ns`)
  - microseconds (`us` or `µs`)
  - milliseconds (`ms`)
  - seconds (`s`)
  - minutes (`m`)
  - hours (`h`)
  - days (`d`)
  - weeks (`w`)

  {{% note %}}
  The minimum retention period is **one hour**.
  {{% /note %}}

```sh
# Syntax
influx bucket create \
  --name <bucket-name> \
  --org <org-name> \
  --retention <retention-period-duration>

# Example
influx bucket create \
  --name my-bucket \
  --org my-org \
  --retention 72h
```

{{% /tab-content %}}
<!------------------------------ END CLI CONTENT ------------------------------>

<!----------------------------- BEGIN API CONTENT ----------------------------->
{{% tab-content %}}

To create a bucket with the InfluxDB HTTP API, send a request to the following endpoint:

{{< api-endpoint method="post" endpoint="https://localhost:8086/api/v2/buckets" api-ref="/influxdb/v2/api/#post-/api/v2/buckets" >}}

Include the following in your request:

- **Headers:**
  - **Authorization:** `Token` scheme with your InfluxDB [API token](/influxdb/v2/admin/tokens/)
  - **Content-type:** `application/json`
- **Request body:** JSON object with the following fields:  
  {{< req type="key" >}}
  - {{< req "\*" >}} **name:** Bucket name
    _(see [Bucket naming restrictions](#bucket-naming-restrictions))_
  - {{< req "\*" >}} **orgID:** InfluxDB organization ID
  - **description:** Bucket description
  - **retentionRules:** JSON array containing a single object
    with the following fields:
    - **type:** expire
    - **everySecond**: Number of seconds to retain data _(0 means forever)_
    - **shardGroupDuration**: Number of seconds to retain shard groups _(0 means forever)_

#### Example

The URL depends on the version and location of your InfluxDB {{< current-version >}}
instance _(see [InfluxDB URLs](/influxdb/v2/reference/urls/))_.

```sh
{{% get-shared-text "api/v2.0/buckets/oss/create.sh" %}}
```

_For information about **InfluxDB API options and response codes**, see
[InfluxDB API Buckets documentation](/influxdb/v2/api/#post-/api/v2/buckets)._

{{% /tab-content %}}
<!------------------------------ END API CONTENT ------------------------------>
{{< /tabs-wrapper >}}

## Bucket naming restrictions

Bucket names must adhere to the following naming restrictions:

- Must contain two or more characters
- Cannot start with an underscore (`_`)
- Cannot contain a double quote (`"`)
