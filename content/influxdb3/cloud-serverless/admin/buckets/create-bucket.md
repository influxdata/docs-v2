---
title: Create a bucket
seotitle: Create a bucket in InfluxDB Cloud Serverless
description: >
  Create buckets to store time series data in InfluxDB Cloud Serverless
  using the InfluxDB UI, influx CLI, or InfluxDB HTTP API.
  Map DBRPs to buckets for querying with InfluxQL and using the InfluxDB API `/write` and `/query` endpoints.
menu:
  influxdb3_cloud_serverless:
    name: Create a bucket
    parent: Manage buckets
weight: 201
related:
  - /influxdb3/cloud-serverless/query-data/influxql/dbrp/
  - /influxdb3/cloud-serverless/guides/migrate-data/migrate-1x-to-v3/
  - /influxdb3/cloud-serverless/guides/api-compatibility/v1/
aliases:
  - /influxdb3/cloud-serverless/organizations/buckets/create-bucket/
  - /influxdb3/cloud-serverless/admin/buckets/create/
alt_links:
  cloud: /influxdb/cloud/admin/buckets/create-bucket/
---

Use the InfluxDB user interface (UI), `influx` command line interface (CLI), or InfluxDB HTTP API to create a bucket.

- [Bucket naming restrictions](#bucket-naming-restrictions)
- [Table and column limits](#table-and-column-limits)
  - [Auto-generate buckets on write](#auto-generate-buckets-on-write)
  - [Create a bucket](#create-a-bucket)
- [Retention period syntax](#retention-period-syntax)
- [/api/v2 retentionRules syntax](#apiv2-retentionrules-syntax)
  - [retentionRules example](#retentionrules-example)

## Bucket naming restrictions

Bucket names must adhere to the following naming restrictions:

- Must contain two or more characters
- Cannot start with an underscore (`_`)
- Cannot contain a double quote (`"`)

Names must be unique within the organization.
When you send a request such as writing or querying, {{% product-name %}} uses the bucket name and token in your request to find the bucket within the organization.

## Table and column limits

In {{< product-name >}}, table (measurement) and column are limited per bucket.
Each measurement is represented by a table.
Time, fields, and tags are each represented by a column.

**Maximum number of tables**: 500
**Maximum number of columns**: 200

### Auto-generate buckets on write

InfluxDB can [automatically create DBRP mappings and associated buckets](/influxdb3/cloud-serverless/guides/api-compatibility/v1/#automatic-dbrp-mapping) for you during the following operations:

- Writing to the [v1 `/write` endpoint](/influxdb3/cloud-serverless/guides/api-compatibility/v1/#write-data)
- [Migrating from InfluxDB 1.x to {{% product-name %}}](/influxdb3/cloud-serverless/guides/migrate-data/migrate-1x-to-v3/)


<!-- Invisible anchor for "Create a bucket" -->
### Create a bucket

Create a bucket using the InfluxDB UI, `influx` CLI, or InfluxDB HTTP API.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

There are two places you can create a bucket in the UI.

- [Create a bucket from the Load Data menu](#create-a-bucket-from-the-load-data-menu)
- [Create a bucket in the Data Explorer](#create-a-bucket-in-the-data-explorer)

#### Create a bucket from the Load Data menu

1. In the navigation menu on the left, select **Load Data** > **Buckets**.

{{< nav-icon "data" >}}

2. Click **{{< icon "plus" >}} Create Bucket** in the upper right.
3. Enter a **Name** for the bucket.
4. Select when to **Delete Data**:
    - **Never** to retain data forever.
    - **Older than** to choose a specific retention period.
5. Click **Create** to create the bucket.

#### Create a bucket in the Data Explorer

1.  In the navigation menu on the left, select **Explore* (**Data Explorer**).

{{< nav-icon "data-explorer" >}}

2.  In the header bar, toggle the "Switch to old Data Explorer" button to the "on" position to display the Flux Builder.
3.  In the **From** panel in the Flux Builder, select `+ Create Bucket`.
4.  Enter a **Name** for the bucket
    _(see [Bucket naming restrictions](#bucket-naming-restrictions))_.
5.  Select when to **Delete Data**:
    - **Never** to retain data forever.
    - **Older than** to choose a specific retention period.
6.  Click **Create** to create the bucket.
<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN CLI CONTENT ----------------------------->
To create a bucket with the `influx` CLI, use the [`influx bucket create` command](/influxdb3/cloud-serverless/reference/cli/influx/bucket/create)
and specify values for the following flags:

- `-o`, `--org`: Organization name
- `-n`, `--name`: Bucket name
- `-r`, `--retention`: [Retention period duration](#retention-period-syntax)

The following example creates a bucket with a retention period of 72 hours:

<!--test
```sh
influx bucket delete \
  --name BUCKET_NAME
```
-->

<!--pytest-codeblocks:cont-->

{{% code-placeholders "ORG|BUCKET_NAME|72h" %}}
```sh
influx bucket create \
  --name BUCKET_NAME \
  --retention 72h
```
{{% /code-placeholders %}}

## Retention period syntax

Retention rules specify the bucket retention period, the duration that data is stored before it expires.
The retention period also defines the minimum timestamp that you can write to the bucket; the bucket rejects data older than the retention period.

Use the `--retention` flag to specify a
[retention period](/influxdb3/cloud-serverless/admin/databases/#retention-periods)
for the bucket.
The retention period value is a time duration value made up of a numeric value
plus a duration unit.
For example, `30d` means 30 days.
A zero duration (`0d`) retention period is infinite and data won't expire.
The retention period value cannot be negative or contain whitespace.

{{< flex >}}
{{% flex-content %}}

##### Valid durations units include

- **m**: minute
- **h**: hour
- **d**: day
- **w**: week
- **mo**: month
- **y**: year

{{% /flex-content %}}
{{% flex-content %}}

##### Example retention period values

- `0d`: infinite/none
- `3d`: 3 days
- `6w`: 6 weeks
- `1mo`: 1 month (30 days)
- `1y`: 1 year
- `30d30d`: 60 days
- `2.5d`: 60 hours

{{% /flex-content %}}
{{< /flex >}}
<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

To create a bucket with the InfluxDB HTTP API, send a request to the following endpoint:

{{< api-endpoint method="post" endpoint="https://{{< influxdb/host >}}/api/v2/buckets" api-ref="/influxdb3/cloud-serverless/api/#post-/api/v2/buckets" >}}

Include the following in your request:

- **Headers:**
  - **Authorization:** `Token` scheme with your InfluxDB [API token](/influxdb3/cloud-serverless/admin/tokens/)
  - **Content-type:** `application/json`
- **Request body:** JSON object with the following fields:
  {{< req type="key" >}}
  - {{< req "\*" >}} **name:** Bucket name
  - **orgID:** InfluxDB organization ID
  - **description:** Bucket description
  - {{< req "\*" >}} **retentionRules:** JSON array containing a single object
    with the following fields:
    - **type:** expire
    - **everySecond**: Retention period as a number of seconds _(0 means forever)_
    - **shardGroupDuration**: Number of seconds to retain shard groups _(0 means forever)_

The following example creates a bucket with a retention period of `86,400` seconds, or 24 hours:

<!--test
```sh
influx bucket delete --name BUCKET_NAME
```
-->

<!--pytest-codeblocks:cont-->

{{% code-placeholders "API_TOKEN|ORG_ID|86400" %}}
```sh
curl --silent -w "%{response_code}: %{errormsg}\n" \
  -XPOST "https://{{< influxdb/host >}}/api/v2/buckets" \
  --header "Authorization: Token API_TOKEN" \
  --header "Content-type: application/json" \
  --data @- << EOF
  {
    "orgID": "ORG_ID",
    "name": "BUCKET_NAME",
    "retentionRules": [
      {
        "type": "expire",
        "everySeconds": 86400
      }
    ]
  }
EOF
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: the name of the bucket
- {{% code-placeholder-key %}}`86400`{{% /code-placeholder-key %}}: the number of seconds data is stored before it expires. Default is `infinite`--data won't expire.
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb3/cloud-serverless/admin/tokens/) with sufficient permissions to the specified bucket

If successful, the output is an HTTP `201: Created` status code and the bucket; otherwise, an error status and message.

## /api/v2 retentionRules syntax

Retention rules specify the bucket [retention period](/influxdb3/cloud-serverless/admin/databases/#retention-periods).
The retention period also defines the minimum timestamp that you can write to the bucket; the bucket rejects data older than the retention period.
The default retention period is `infinite`--data won't expire.

To specify the retention period, set the `retentionRules.everySeconds` property to the number of seconds.
A zero seconds (`0`) retention period is infinite.
The retention period value can't be negative or contain whitespace.

### retentionRules example

```json
{
  "orgID": "ORG_ID",
  "name": "BUCKET_NAME",
  "retentionRules": [
    {
      "type": "expire",
      "everySeconds": "RETENTION_PERIOD_SECONDS"
    }
  ]
}
```

_For information about **InfluxDB API options and response codes**, see
[InfluxDB API Buckets reference documentation](/influxdb3/cloud-serverless/api/#post-/api/v2/buckets)._
<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}
