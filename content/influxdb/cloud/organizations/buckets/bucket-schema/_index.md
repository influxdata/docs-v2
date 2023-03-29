---
title: Manage bucket schemas
seotitle: Manage bucket schemas in InfluxDB
description: Manage explicit bucket schemas using the influx CLI or InfluxDB HTTP API. Optionally, ensure data you write follows a specific schema.
menu:
  influxdb_cloud:
    name: Manage explicit bucket schemas
    parent: Manage buckets
weight: 250
influxdb/cloud/tags: [buckets, bucket-schema, bucket schemas, explicit bucket schemas, schema]
related:
  - /influxdb/cloud/reference/key-concepts/
  - /influxdb/cloud/reference/key-concepts/data-schema/
  - /influxdb/cloud/reference/key-concepts/data-elements/
  - /influxdb/cloud/organizations/buckets/create-bucket/
  - /influxdb/cloud/reference/cli/influx/
---

Use [**explicit bucket schemas**](/influxdb/cloud/reference/key-concepts/data-elements/#bucket-schema) to enforce [column names](/influxdb/cloud/reference/glossary/#column), [tags](/influxdb/cloud/reference/glossary/#tag), [fields](/influxdb/cloud/reference/glossary/#field), and
[data types](/influxdb/cloud/reference/glossary/#data-type) for your data.
Explicit bucket schemas ensure that measurements have specific columns and data types and prevent non-conforming write requests.

After you create a bucket schema, you're ready to [write data](/influxdb/cloud/write-data/) to your bucket.

{{% note %}}

#### Before you begin

The examples below reference [**InfluxDB data elements**](/influxdb/cloud/reference/key-concepts/data-elements/). We recommend reviewing data elements, [**InfluxDB key concepts**](/influxdb/cloud/reference/key-concepts/), and [**elements of line protocol**](/influxdb/cloud/reference/syntax/line-protocol/#elements-of-line-protocol) if you aren't familiar with these concepts.

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

  1. If you haven't already, [create a bucket that enforces explicit schemas](/influxdb/cloud/organizations/buckets/create-bucket/#create-a-bucket-that-enforces-explicit-schemas).
  2. [Create a bucket schema](#create-a-bucket-schema).

### Create a bucket schema

With an `explicit` bucket, you predefine *measurement schemas* with column names, tags, fields, and data types for measurements.
A measurement schema has the following properties:

- `name`: the measurement name. The name must match the [measurement column](/influxdb/cloud/reference/key-concepts/data-elements/#measurement) in your data, obey [naming rules](#write-valid-schemas), and be unique within the bucket.
- `columns`: a list of *column definitions* for the measurement.

To learn more about rules for measurement _names_ and _columns_, see how to [write valid schemas](#write-valid-schemas).

Use the [**`influx` CLI**](/influxdb/cloud/reference/cli/influx/) or [**InfluxDB HTTP API**](/influxdb/cloud/api) to create an explicit bucket schema for a measurement.

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

  2. Use the [`influx bucket-schema create` command](/influxdb/cloud/reference/cli/influx/bucket-schema/create) to define an _explicit_ bucket measurement schema. In your command, specify values for the following flags:

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

Send a request to the HTTP API [`/api/v2/buckets/{BUCKET_ID}/schema/measurements` endpoint](/influxdb/cloud/api/#operation/createMeasurementSchema)
and set the following properties in the request body:

- `name`: the measurement name.
- `columns`: an array of *column definitions* for your measurement.

For example, the following request defines the _explicit_ bucket measurement schema for `airSensors` measurements:

{{< api-endpoint method="post" endpoint="https://cloud2.influxdata.com/api/v2/buckets/{BUCKET_ID}/schema/measurements" api-ref="/influxdb/cloud/api/#operation/createMeasurementSchema" >}}

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

#### Test your schema

After you create an explicit schema, test that it works as you expect.
To start, we recommend trying to write data that doesn't conform to the schema and that the bucket should reject.

For more information about errors to expect in your tests, see [explicit schema rejections](/influxdb/cloud/write-data/troubleshoot/#troubleshoot-rejected-points).

{{% /note %}}

### Write valid schemas

To ensure your schema is valid, review [InfluxDB data elements](/influxdb/cloud/reference/key-concepts/data-elements/).
Follow these rules when creating your schema columns file:

  1. Use valid measurement and column names that:
      - Are unique within the schema
      - Are 1 to 128 characters long
      - Contain only [Unicode](https://www.unicode.org/charts/) characters
      - Don't start with underscore `_`
      - Don't start with a number `0-9`
      - Don't contain single quote `'` or double quote `"`
  2. Include a column with the [`timestamp`](/influxdb/cloud/reference/key-concepts/data-elements/#timestamp) type.
  3. Include at least one column with the [`field`](/influxdb/cloud/reference/key-concepts/data-elements/#fields) type (without a field, there is no time-series data), as in the following example:

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

The default [field data type](/influxdb/cloud/reference/key-concepts/data-elements/#field-value) is `string`.
To set the data type of a field column, provide the `dataType` property and a valid
[field data type](/influxdb/cloud/reference/key-concepts/data-elements/#field-value) (`string`, `float`, `integer`, or `boolean`),
as in the following example:

```json
[
  {"name":"time","type":"timestamp"},
  {"name":"fsWrite","type":"field","dataType":"float"}
]
```

## View bucket schema type and schemas

Use the **InfluxDB UI**, [**`influx` CLI**](/influxdb/cloud/reference/cli/influx/), or [**InfluxDB HTTP API**](/influxdb/cloud/api) to view schema type and schemas for buckets.

### View schema type and schemas in the InfluxDB UI

  1. [View buckets](/influxdb/cloud/organizations/buckets/view-buckets/).
  2. In the list of buckets, see the **Schema Type** in the metadata that follows each bucket name.
  3. Buckets with **Schema Type: Explicit** display the {{< caps >}}Show Schema{{< /caps>}} button. Click {{< caps >}}Show Schema{{< /caps>}} to view measurement schemas for the bucket.

### View schema type and schemas using the influx CLI

To list schemas for a bucket, use the [`influx bucket-schema list` command](/influxdb/cloud/reference/cli/influx/bucket-schema/list/).
To view schema column definitions and metadata, specify the `--json` flag.

### View schema type and schemas using the InfluxDB HTTP API

To list schemas for a bucket, send a request to the InfluxDB HTTP [`/api/v2/buckets/{BUCKET_ID}/schema/measurements` endpoint](/influxdb/cloud/api/#operation/getMeasurementSchemas):

{{% api-endpoint method="get" endpoint="https://cloud2.influxdata.com/api/v2/buckets/{BUCKET_ID}/schema/measurements" api-ref="/influxdb/cloud/api/#operation/getMeasurementSchemas" %}}

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

3. To update the bucket schema, use the [`influx bucket-schema update` command](/influxdb/cloud/reference/cli/influx/bucket-schema/update) and specify the columns file with the `--columns-file` flag.

    ```sh
    influx bucket-schema update \
      --bucket my_explicit_bucket \
      --name sensor \
      --columns-file sensor.ndjson
    ```

### Update a bucket schema using the InfluxDB HTTP API

1. [View the existing measurement schema](#view-schema-type-and-schemas-using-the-influxdb-http-api) and copy the `columns` list.

2. Send a request to the HTTP API [`/api/v2/buckets/{BUCKET_ID}/schema/measurements/{MEASUREMENT_ID}` endpoint](/influxdb/cloud/api/#operation/updateMeasurementSchema).

    In the request body, set the `columns` property to a list of old and new column definitions for the measurement schema--for example, the following request appends the new column `CO2` to `columns` retrieved in the previous step:

    {{< api-endpoint method="patch" endpoint="https://cloud2.influxdata.com/api/v2/buckets/{BUCKET_ID}/schema/measurements/{MEASUREMENT_ID}" api-ref="/influxdb/cloud/api/#operation/updateMeasurementSchema" >}}

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
If your [API token](/influxdb/cloud/security/tokens/) doesn't have `WRITE` permission for the bucket, InfluxDB returns the following error:

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

To resolve failures and partial writes, see how to [troubleshoot writes](/influxdb/cloud/write-data/troubleshoot/).
