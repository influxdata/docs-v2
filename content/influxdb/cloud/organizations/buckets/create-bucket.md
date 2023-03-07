---
title: Create a bucket
seotitle: Create a bucket in InfluxDB
description: Create buckets to store time series data in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_cloud:
    name: Create a bucket
    parent: Manage buckets
weight: 201
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create a bucket.

- [Create a bucket in the InfluxDB UI]
- [Create a bucket using the influx CLI]

## Create a bucket in the InfluxDB UI

There are two places you can create a bucket in the UI.

### Create a bucket from the Load Data menu

1. In the navigation menu on the left, select **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

2. Click **{{< icon "plus" >}} Create Bucket** in the upper right.
3. Enter a **Name** for the bucket.
4. Select when to **Delete Data**:
    - **Never** to retain data forever.  
    - **Older than** to choose a specific retention period.
5. Click **Create** to create the bucket.

### Create a bucket in the Data Explorer

1. In the navigation menu on the left, select **Explore* (**Data Explorer**).

    {{< nav-icon "data-explorer" >}}

2. In the **From** panel in the Flux Builder, select `+ Create Bucket`.
3. Enter a **Name** for the bucket.
4. Select when to **Delete Data**:
    - **Never** to retain data forever.  
    - **Older than** to choose a specific retention period.
5. Click **Create** to create the bucket.

## Create a bucket using the influx CLI

To create a bucket with the `influx` CLI, use the [`influx bucket create` command](/influxdb/cloud/reference/cli/influx/bucket/create)
and specify values for the following flags:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| Organization         | `-o`                |
| Bucket               | `-n`                 |
| Retention Rules      | `-r`    |

```sh
# Syntax
influx bucket create -n <BUCKET_NAME> -o <INFLUX_ORG> -r <RETENTION_PERIOD_DURATION>

# Example
influx bucket create -n my-bucket -o my-org -r 72h
```

## Create a bucket using the InfluxDB API

To create a bucket with the InfluxDB HTTP API, send a request to the `POST /api/v2/buckets` endpoint.
In your request body, specify values for the following properties:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| Organization         | `orgID`                |
| Bucket               | `name`                 |
| Retention Rules      | `retentionRules`    |
| API token | Use the `Authorization: Token` header.                   |

#### Example

The URL depends on your InfluxDB Cloud region _(see [InfluxDB URLs](/influxdb/cloud/reference/regions/))_.

```sh
{{% get-shared-text "api/v2.0/buckets/oss/create.sh" %}}
```

_For information about **InfluxDB API options and response codes**, see
[InfluxDB API Buckets documentation](/influxdb/cloud/api/#operation/PostBuckets)._

## Create a bucket that enforces explicit schemas

{{% bucket-schema/type %}}

Use the **`influx` CLI** or **InfluxDB HTTP API** to create a bucket with the `explicit` schema-type.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN CLI CONTENT ----------------------------->

  1. Use the `influx bucket create` command and specify the `--schema-type=explicit` flag:

      ```sh
     {{< get-shared-text "bucket-schema/bucket-schema-type.sh" >}}
     ```

  2. [Create an explicit schema](/influxdb/cloud/organizations/buckets/bucket-schema/) for your data.

{{% /tab-content %}}

{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

  1. To create a bucket with the `explicit` schema-type, use the HTTP API `POST /api/v2/buckets` endpoint and pass the `schemaType: explicit` property in the request body--for example:

      ```js
      {
        "orgID": "ORG_ID",
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

      The response body is similar to the following:

        ```js
        {
        "id": "7936906a8317470d",
        "orgID": "ORG_ID",
        "type": "user",
        "schemaType": "explicit",
        "description": "My Explicit Bucket",
        "name": "my-explicit-bucket",
        "rp": "string",
        "retentionRules": [
          {
            "type": "expire",
            "everySeconds": 86400
          }
        ],
        ...
        }
        ```

  2. [Create an explicit schema](/influxdb/cloud/organizations/buckets/bucket-schema/) for your data.

{{% /tab-content %}}
{{< /tabs-wrapper >}}
