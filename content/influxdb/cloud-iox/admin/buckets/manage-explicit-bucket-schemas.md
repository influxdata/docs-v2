---
title: Manage explicit bucket schemas
seotitle: Manage explicit bucket schemas in InfluxDB Cloud
description: Manage explicit bucket schemas using the influx CLI or InfluxDB HTTP API. Optionally, ensure data you write follows a specific schema.
menu:
  influxdb_cloud_iox:
    name: Manage explicit bucket schemas
    parent: Manage buckets
weight: 250
influxdb/cloud-iox/tags: [buckets, bucket-schema, bucket schemas, explicit bucket schemas, explicit measurement schema, schema]
related:
  - /influxdb/cloud-iox/write-data/best-practices/schema-design/
  - /influxdb/cloud-iox/reference/cli/influx/bucket-schema/
  - /influxdb/cloud-iox/admin/buckets/create-bucket/
  - /influxdb/cloud-iox/reference/cli/influx/
---

Use [**explicit bucket schemas**](/influxdb/cloud-iox/reference/glossary/#bucket-schema) to enforce [column names](/influxdb/cloud-iox/reference/glossary/#column), [tags](/influxdb/cloud-iox/reference/glossary/#tag), [fields](/influxdb/cloud-iox/reference/glossary/#field), and
[data types](/influxdb/cloud-iox/reference/glossary/#data-type) for your data.
Buckets with the `explicit` schema-type, use
explicit bucket schemas to ensure measurements have specific columns and data types and to prevent non-conforming writes.

After you create a bucket schema, you're ready to [write data](/influxdb/cloud-iox/write-data/) to your bucket.

{{% note %}}
#### Before you begin

The examples below reference **InfluxDB data elements**. We recommend reviewing [schema design best practices](/influxdb/cloud-iox/write-data/best-practices/schema-design/) and [**elements of line protocol**](/influxdb/cloud-iox/reference/syntax/line-protocol/#elements-of-line-protocol) if you aren't familiar with these concepts.
{{% /note %}}

- [Create an explicit bucket and schema](#create-an-explicit-bucket-and-schema)
  - [Create a bucket schema using the influx CLI](#create-a-bucket-schema-using-the-influx-cli)
  - [Create a bucket schema using the InfluxDB HTTP API](#create-a-bucket-schema-using-the-influxdb-http-api)
  - [Write valid schemas](#write-valid-schemas)
- [View bucket schema type and schemas](#view-bucket-schema-type-and-schemas)
  - [View schema type and schemas in the InfluxDB UI](#view-schema-type-and-schemas-in-the-influxdb-ui)
  - [View schema type and schemas using the influx CLI](#view-schema-type-and-schemas-using-the-influx-cli)
  - [View schema type and schemas using the InfluxDB HTTP API](#view-schema-type-and-schemas-using-the-influxdb-http-api)
- [Update a bucket schema](#update-a-bucket-schema)
	- [Update a bucket schema using the influx CLI](#update-a-bucket-schema-using-the-influx-cli)
	- [Update a bucket schema using the InfluxDB HTTP API](#update-a-bucket-schema-using-the-influxdb-http-api)
- [Troubleshoot bucket schema errors](#troubleshoot-bucket-schema-errors)
- [Troubleshoot write errors](#troubleshoot-write-errors)

## Create an explicit bucket and schema

To create an explicit bucket and schemas for your data, do the following:

  1. If you haven't already, [create a bucket that enforces explicit schemas](/influxdb/cloud-iox/admin/buckets/create-bucket/#create-a-bucket-that-enforces-explicit-schemas).
  2. [Create a bucket schema](#create-a-bucket-schema).

### Create a bucket schema

With an `explicit` bucket, you predefine *measurement schemas* with column names, tags, fields, and data types for measurements.
A measurement schema has the following properties:

- `name`: the measurement name. The name must match the [measurement column](/influxdb/cloud-iox/reference/glossary/#measurement) in your data, obey [naming rules](#write-valid-schemas), and be unique within the bucket.
- `columns`: a list of *column definitions* for the measurement.

To learn more about rules for measurement _names_ and _columns_, see how to [write valid schemas](#write-valid-schemas).

Use the [**`influx` CLI**](/influxdb/cloud-iox/reference/cli/influx/) or [**InfluxDB HTTP API**](/influxdb/cloud-iox/api) to create an explicit bucket schema for a measurement.

- [Create a bucket schema using the influx CLI](#create-a-bucket-schema-using-the-influx-cli)
- [Create a bucket schema using the InfluxDB HTTP API](#create-a-bucket-schema-using-the-influxdb-http-api)

#### Create a bucket schema using the influx CLI

  1. Use your text editor to create a schema columns file for each measurement you want to add. Format the file as CSV, JSON, or [Newline delimited JSON (NDJSON)](http://ndjson.org/),
    as in the following examples:
  {{< code-tabs-wrapper >}}
  {{% code-tabs %}}
  [usage-resources.csv](#)
  [usage-cpu.json](#)
  [sensor.ndjson](#)
  {{% /code-tabs %}}
  {{% code-tab-content %}}
  ```sh
  {{< get-shared-text "bucket-schema/usage-resources.csv" >}}
  ```
  {{% /code-tab-content %}}
  {{% code-tab-content %}}
  ```json
  {{< get-shared-text "bucket-schema/usage-cpu.json" >}}
  ```
  {{% /code-tab-content %}}
  {{% code-tab-content %}}
  ```json
  {{< get-shared-text "bucket-schema/sensor.ndjson" >}}
  ```
  {{% /code-tab-content %}}
  {{< /code-tabs-wrapper >}}

  2. Use the [`influx bucket-schema create` command](/influxdb/cloud-iox/reference/cli/influx/bucket-schema/create) to define an _explicit_ bucket measurement schema. In your command, specify values for the following flags:

      - `--name`: the measurement name.
      - `--columns-file`: the location of the file that contains *column definitions* for your measurement.

      For example, each of the following commands adds a unique measurement schema to the bucket:

        ```sh
        influx bucket-schema create \
        --bucket my_explicit_bucket \
        --name usage_resources \
        --columns-file usage-resources.csv

        influx bucket-schema create \
        --bucket my_explicit_bucket \
        --name usage_cpu \
        --columns-file usage-cpu.json

        influx bucket-schema create \
        --bucket my_explicit_bucket \
        --name sensor \
        --columns-file sensor.ndjson     
        ```
#### Create a bucket schema using the InfluxDB HTTP API

Send a request to the HTTP API [`/api/v2/buckets/{BUCKET_ID}/schema/measurements` endpoint](/influxdb/cloud-iox/api/#operation/createMeasurementSchema)
and set the following properties in the request body:

- `name`: the measurement name.
- `columns`: an array of *column definitions* for your measurement.

For example, the following request defines the _explicit_ bucket measurement schema for `airSensors` measurements:

{{< api-endpoint method="post" endpoint="https://cloud2.influxdata.com/api/v2/buckets/{BUCKET_ID}/schema/measurements" >}}

```js
{
	"name": "airSensors",
	"columns": [
          {"name": "time", "type": "timestamp"},
          {"name": "sensorId", "type": "tag"},
          {"name": "temperature", "type": "field"},
          {"name": "humidity", "type": "field", "dataType": "float"}
	  ]
}
```

{{% note %}}
#### Test your explicit schema

After you create an explicit schema, test that it works as you expect.
To start, we recommend trying to write data that doesn't conform to the schema and that the bucket should reject.
<!-- Pending IOx troubleshoot page --
 For more information about errors to expect in your tests, see [explicit schema rejections](/influxdb/cloud-iox/write-data/troubleshoot/#troubleshoot-rejected-points).
 -->
{{% /note %}}

### Write valid schemas

To ensure your schema is valid, review [schema design best practices](/influxdb/cloud-iox/write-data/best-practices/schema-design/).
Follow these rules when creating your schema columns file:
  1. Use valid measurement and column names that:
      - Are unique within the schema
      - Are 1 to 128 characters long
      - Contain only [Unicode](https://www.unicode.org/charts/) characters
      - Don't start with underscore `_`
      - Don't start with a number `0-9`
      - Don't contain single quote `'` or double quote `"`
  2. Include a column with the [`timestamp`](/influxdb/cloud-iox/reference/glossary/#timestamp) type.
  3. Include at least one column with the [`field`](/influxdb/cloud-iox/reference/glossary/#field) type (without a field, there is no time-series data), as in the following example:

  **Valid**: a schema with [`timestamp`]() and [`field`]() columns.
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

The default [field data type](/influxdb/cloud-iox/reference/glossary/#field-value) is `string`.
To set the data type of a field column, provide the `dataType` property and a valid
[field data type](/influxdb/cloud-iox/reference/glossary/#field-value) (`string`, `float`, `integer`, or `boolean`),
as in the following example:

```json
[
  {"name":"time","type":"timestamp"},
  {"name":"fsWrite","type":"field","dataType":"float"}
]
```

## View bucket schema type and schemas

Use the **InfluxDB UI**, [**`influx` CLI**](/influxdb/cloud-iox/reference/cli/influx/), or [**InfluxDB HTTP API**](/influxdb/cloud-iox/api) to view schema type and schemas for buckets.

### View schema type and schemas in the InfluxDB UI

  1. [View buckets](/influxdb/cloud-iox/admin/buckets/view-buckets/).
  2. In the list of buckets, see the **Schema Type** in the metadata that follows each bucket name.
  3. Buckets with **Schema Type: Explicit** display the {{< caps >}}Show Schema{{< /caps>}} button. Click {{< caps >}}Show Schema{{< /caps>}} to view measurement schemas for the bucket.

### View schema type and schemas using the influx CLI

To list schemas for a bucket, use the [`influx bucket-schema list` command](/influxdb/cloud-iox/reference/cli/influx/bucket-schema/list/).
To view schema column definitions and metadata, specify the `--json` flag.

### View schema type and schemas using the InfluxDB HTTP API

To list schemas for a bucket, send a request to the InfluxDB HTTP [`/api/v2/buckets/{BUCKET_ID}/schema/measurements` endpoint](/influxdb/cloud-iox/api/#operation/getMeasurementSchemas):

{{% api-endpoint method="get" endpoint="https://cloud2.influxdata.com/api/v2/buckets/{BUCKET_ID}/schema/measurements" %}}

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

3. To update the bucket schema, use the [`influx bucket-schema update` command](/influxdb/cloud-iox/reference/cli/influx/bucket-schema/update) and specify the columns file with the `--columns-file` flag.

    ```sh
    influx bucket-schema update \
      --bucket my_explicit_bucket \
      --name sensor \
      --columns-file sensor.ndjson
    ```

### Update a bucket schema using the InfluxDB HTTP API

1. [View the existing measurement schema](#view-schema-type-and-schemas-using-the-influxdb-http-api) and copy the `columns` list.

2. Send a request to the HTTP API [`/api/v2/buckets/{BUCKET_ID}/schema/measurements/{MEASUREMENT_ID}` endpoint](/influxdb/cloud-iox/api/#operation/updateMeasurementSchema).

    In the request body, set the `columns` property to a list of old and new column definitions for the measurement schema--for example, the following request appends the new column `CO2` to `columns` retrieved in the previous step:

    {{< api-endpoint method="patch" endpoint="https://cloud2.influxdata.com/api/v2/buckets/{BUCKET_ID}/schema/measurements/{MEASUREMENT_ID}" >}}

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
If your [API token](/influxdb/cloud-iox/reference/glossary/#token) doesn't have `WRITE` permission for the bucket, InfluxDB returns the following error:

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

<!-- Pending IOx troubleshoot page --
To resolve failures and partial writes, see how to [troubleshoot writes](/influxdb/cloud-iox/write-data/troubleshoot/).
-->