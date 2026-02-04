---
title: Manage explicit bucket schemas
description: Manage and troubleshoot explicit bucket schemas using the influx CLI or InfluxDB HTTP API.
menu:
  influxdb3_cloud_serverless:
    name: Manage explicit bucket schemas
    parent: Manage buckets
weight: 250
influxdb3/cloud-serverless/tags: [buckets, bucket-schema, bucket schemas, explicit bucket schemas, explicit measurement schema, schema]
related:
  - /influxdb3/cloud-serverless/write-data/best-practices/schema-design/
  - /influxdb3/cloud-serverless/reference/cli/influx/bucket-schema/
  - /influxdb3/cloud-serverless/admin/buckets/create-bucket/
  - /influxdb3/cloud-serverless/reference/cli/influx/
alt_links:
  cloud: /influxdb/cloud/admin/buckets/bucket-schema/
---

> [!Warning]
> #### Don't use explicit schemas with InfluxDB 3
> 
> Don't use **explicit bucket schemas** with InfluxDB 3.
> The sections on this page provide help for managing and troubleshooting `explicit` buckets you may already have.

In InfluxDB 2.x, buckets with the `explicit` schema-type use
explicit bucket schemas to ensure measurements have specific columns and data types and to prevent non-conforming writes.

<!-- TOC -->

- [View bucket schema type and schemas](#view-bucket-schema-type-and-schemas)
  - [View schema type and schemas in the InfluxDB UI](#view-schema-type-and-schemas-in-the-influxdb-ui)
  - [View schema type and schemas using the influx CLI](#view-schema-type-and-schemas-using-the-influx-cli)
  - [View schema type and schemas using the InfluxDB HTTP API](#view-schema-type-and-schemas-using-the-influxdb-http-api)
- [Update a bucket schema](#update-a-bucket-schema)
  - [Update a bucket schema using the influx CLI](#update-a-bucket-schema-using-the-influx-cli)
  - [Update a bucket schema using the InfluxDB HTTP API](#update-a-bucket-schema-using-the-influxdb-http-api)
- [Troubleshoot bucket schema errors](#troubleshoot-bucket-schema-errors)
  - [Bucket not found](#bucket-not-found)
    - [Failed to create measurement](#failed-to-create-measurement)
- [Troubleshoot write errors](#troubleshoot-write-errors)

<!-- /TOC -->

#### Test your explicit schema

When testing an explicit schema, start by trying to write data that doesn't conform to the schema and that the bucket should reject.

### Write valid schemas

To ensure your schema is valid, review [schema design best practices](/influxdb3/cloud-serverless/write-data/best-practices/schema-design/).
Follow these rules when creating your schema columns file:
  1. Use valid measurement and column names that:
      - Are unique within the schema
      - Are 1 to 128 characters long
      - Contain only [Unicode](https://www.unicode.org/charts/) characters
      - Don't start with underscore `_`
      - Don't start with a number `0-9`
      - Don't contain single quote `'` or double quote `"`
  2. Include a column with the [`timestamp`](/influxdb3/cloud-serverless/reference/glossary/#timestamp) type.
  3. Include at least one column with the [`field`](/influxdb3/cloud-serverless/reference/glossary/#field) type (without a field, there is no time-series data), as in the following example:

  **Valid**: a schema with `timestamp` and `field` columns.
  ```json
  [
    {"name":"time","type":"timestamp"},
    {"name":"fsWrite","type":"field"}
  ]
  ```

  **Not valid**: a schema without a `field` column.
  ```json
  [
    {"name":"time","type":"timestamp"},
    {"name":"host","type":"tag"}
  ]
  ```

The default [field data type](/influxdb3/cloud-serverless/reference/glossary/#field-value) is `string`.
To set the data type of a field column, provide the `dataType` property and a valid
[field data type](/influxdb3/cloud-serverless/reference/glossary/#field-value) (`string`, `float`, `integer`, or `boolean`),
as in the following example:

```json
[
  {"name":"time","type":"timestamp"},
  {"name":"fsWrite","type":"field","dataType":"float"}
]
```

## View bucket schema type and schemas

Use the **InfluxDB UI**, [**`influx` CLI**](/influxdb3/cloud-serverless/reference/cli/influx/), or [**InfluxDB HTTP API**](/influxdb3/cloud-serverless/api) to view schema type and schemas for buckets.

### View schema type and schemas in the InfluxDB UI

  1. [View buckets](/influxdb3/cloud-serverless/admin/buckets/view-buckets/).
  2. In the list of buckets, see the **Schema Type** in the metadata that follows each bucket name.
  3. Buckets with **Schema Type: Explicit** display the {{< caps >}}Show Schema{{< /caps>}} button. Click {{< caps >}}Show Schema{{< /caps>}} to view measurement schemas for the bucket.

### View schema type and schemas using the influx CLI

To list schemas for a bucket, use the [`influx bucket-schema list` command](/influxdb3/cloud-serverless/reference/cli/influx/bucket-schema/list/).
To view schema column definitions and metadata, specify the `--json` flag.

### View schema type and schemas using the InfluxDB HTTP API

To list schemas for a bucket, send a request to the InfluxDB HTTP [`/api/v2/buckets/{BUCKET_ID}/schema/measurements` endpoint](/influxdb3/cloud-serverless/api/#get-/api/v2/buckets/-bucketID-/schema/measurements):

{{% api-endpoint method="get" endpoint="https://{{< influxdb/host >}}/api/v2/buckets/{BUCKET_ID}/schema/measurements" api-ref="/influxdb3/cloud-serverless/api/#get-/api/v2/buckets/-bucketID-/schema/measurements" %}}

## Update a bucket schema

Use the **`influx` CLI** or the **InfluxDB HTTP API** to add new columns to an explicit bucket schema.
You can't modify or delete columns in bucket schemas.

- [Update a bucket schema using the influx CLI](#update-a-bucket-schema-using-the-influx-cli)
- [Update a bucket schema using the InfluxDB HTTP API](#update-a-bucket-schema-using-the-influxdb-http-api)

### Update a bucket schema using the influx CLI

1. [View the existing measurement schema](#view-schema-type-and-schemas-using-the-influx-cli) and save the `columns` list to a file.

2. In your text editor or terminal, append new columns to the list from the previous step.
   The following example appends column `CO2` to the original *sensor.ndjson* schema file:

    ```sh
    # sensor.ndjson
    {{< get-shared-text "bucket-schema/sensor.ndjson" >}}
    ```

    ```sh
    echo '{"name": "CO2", "type": "field", "dataType": "float"}' >> sensor.ndjson
    ```

3. To update the bucket schema, use the [`influx bucket-schema update` command](/influxdb3/cloud-serverless/reference/cli/influx/bucket-schema/update) and specify the columns file with the `--columns-file` flag.

    ```sh
    influx bucket-schema update \
      --bucket my_explicit_bucket \
      --name sensor \
      --columns-file sensor.ndjson
    ```

### Update a bucket schema using the InfluxDB HTTP API

1. [View the existing measurement schema](#view-schema-type-and-schemas-using-the-influxdb-http-api) and copy the `columns` list.

2. Send a request to the HTTP API [`/api/v2/buckets/{BUCKET_ID}/schema/measurements/{MEASUREMENT_ID}` endpoint](/influxdb3/cloud-serverless/api/#patch-/api/v2/buckets/-bucketID-/schema/measurements/-measurementID-).

    In the request body, set the `columns` property to a list of old and new column definitions for the measurement schema--for example, the following request appends the new column `CO2` to `columns` retrieved in the previous step:

    {{< api-endpoint method="patch" endpoint="https://{{< influxdb/host >}}/api/v2/buckets/{BUCKET_ID}/schema/measurements/{MEASUREMENT_ID}" api-ref="/influxdb3/cloud-serverless/api/#patch-/api/v2/buckets/-bucketID-/schema/measurements/-measurementID-" >}}

    ```js
    {
      "columns": [
              {"name": "time", "type": "timestamp"},
              {"name": "sensorId", "type": "tag"},
              {"name": "temperature", "type": "field"},
              {"name": "humidity", "type": "field", "dataType": "float"},
              {"name": "CO2", "type": "field", "dataType": "float"}
        ]
    }
    ```

## Troubleshoot bucket schema errors

### Bucket not found

Creating and updating bucket schema requires `WRITE` permission for the bucket.  
If your [API token](/influxdb3/cloud-serverless/reference/glossary/#token) doesn't have `WRITE` permission for the bucket, InfluxDB returns the following error:

```sh
Error: bucket "my_explicit_bucket" not found
```

#### Failed to create measurement

Each measurement in a bucket can have one schema.
If you attempt to create a schema for an existing measurement, InfluxDB rejects the new schema and returns the following error:

```sh
Error: failed to create measurement: 422 Unprocessable Entity
```
## Troubleshoot write errors

InfluxDB returns an error for the following reasons:

- data in the write request doesn't conform to a defined schema.
- data in the write request doesn't have a schema defined for the bucket.
- data in the write request has invalid syntax.
