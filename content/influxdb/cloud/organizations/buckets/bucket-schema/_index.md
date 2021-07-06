---
title: Manage bucket schemas
seotitle: Manage bucket schemas in InfluxDB
description: Manage bucket schemas in InfluxDB. Optionally, ensure data written to InfluxDB follows a specific schema.
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
---

Use **explicit bucket schemas** to enforce [column names](/influxdb/cloud/reference/glossary/#column), [tags](/influxdb/cloud/reference/glossary/#field), [fields](/influxdb/cloud/reference/glossary/#field), and
[data types](/influxdb/cloud/reference/glossary/#data-type) for your data.

{{% bucket-schema/type %}}

After you create a bucket schema, you're ready to [write data](/influxdb/cloud/write-data/) to your bucket.

{{% note %}}

#### Before you begin

The `bucket-schema` examples below reference [**InfluxDB data elements**](/influxdb/cloud/reference/key-concepts/data-elements/). We recommend reviewing data elements and [**InfluxDB key concepts**](/influxdb/cloud/reference/key-concepts/) if you aren't familiar with these concepts.
{{% /note %}}

- [Create a schema](#create-a-schema)
- [Update a schema](#update-a-schema)
- [Errors](#errors)

### Create a schema
Use the `influx` CLI to set the schema-type and measurement schemas for your bucket:
1. Create a bucket with the `schema-type` flag set to `explicit`.

    ```sh
    {{< get-assets-text "bucket-schema/bucket-schema-type.sh" >}}
    ```

2. Use your text editor to create a schema file for each measurement you want to add.
The file defines the column names, tags, fields, and data types to require for a measurement.
Format the file as CSV, JSON, or [Newline delimited JSON (NDJSON)](http://ndjson.org/),
as in the following examples:
{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[usage-resources.csv](#)
[usage-cpu.json](#)
[sensor.ndjson](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{< get-assets-text "bucket-schema/usage-resources.csv" >}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{{< get-assets-text "bucket-schema/usage-cpu.json" >}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{{< get-assets-text "bucket-schema/sensor.ndjson" >}}
```
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

3. Use the [`influx bucket-schema create` command](/influxdb/cloud/reference/cli/influx/bucket-schema/create) to add the schema for each measurement to your bucket.

    Provide the following:
    - location of your file with the `columns-file` flag
    - measurement name with the `name` flag. This will match the [measurement column](/influxdb/cloud/reference/key-concepts/data-elements/#measurement) in your data.

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

### Update a schema

Use the [`influx bucket-schema update` command](/influxdb/cloud/reference/cli/influx/bucket-schema/update) to add new columns to a schema. You cannot modify or delete columns in bucket schemas.

1. View explicit bucket schemas.
Use the [`extended-output` flag](/influxdb/cloud/reference/cli/influx/bucket-schema/list#list-all-schema-of-a-bucket-and-print-column-information) with the [`influx bucket list` command](/influxdb/cloud/reference/cli/influx/bucket-schema/list) to view column details.

    ```sh
    influx bucket-schema list \
      --bucket my_explicit_bucket \
      --extended-output
    ```

    InfluxDB returns column details:

    ```sh
    ID                      Measurement Name        Column Name     Column Type     Column Data Type   Bucket ID
    07c62z721z2ca000        sensor                  time            timestamp                          a7d5558b880a95da
    07c62z721z2ca000        sensor                  service         tag                                a7d5558b880a95da
    07c62z721z2ca000        sensor                  sensor          tag                                a7d5558b880a95da
    07c62z721z2ca000        sensor                  temperature     field           float              a7d5558b880a95da
    07c62z721z2ca000        sensor                  humidity        field           float              a7d5558b880a95da
    ```

2. In your text editor or terminal, append new columns to the schema file.

    ```sh
    $ echo '{"name": "CO2", "type": "field", "dataType": "float"}' >> sensor.ndjson
    ```

3. Use the [`influx bucket-schema update` command](/influxdb/cloud/reference/cli/influx/bucket-schema/update) to add the new columns to the bucket schema.

    ```sh
    influx bucket-schema update \
      --bucket my_explicit_bucket \
      --name sensor \
      --columns-file sensor.ndjson
    ```

### Errors

#### Not permitted by schema
If data in the write request doesn't conform to the defined schema, InfluxDB returns an error.

In the following example, the *cpu* measurement has an incorrect `usage_user` [data type](/influxdb/cloud/reference/glossary/#data-type):

```sh
influx write -b my_explicit_bucket 'cpu,host=myHost usage_user="1001" 1556896326'
```

The following error occurs:

```sh
Error: failed to write data:
unable to parse 'cpu,host=myHost usage_user="1001" 1556896326':
schema: field type for field "usage_user" not permitted by schema; got String but expected Float
  ```

#### No measurement schemas
If you attempt to write to a bucket that has schema-type `explicit` and doesn't have a defined schema, the
bucket rejects write attempts and returns the following error:

```sh
Error: failed to write data: schema: bucket "my_explicit_bucket" contains
no measurement schemas
```

#### Failed to create measurement
If you attempt to `create` a schema for an existing measurement name, InfluxDB rejects the new schema and returns the following error:

```sh
Error: failed to create measurement: 422 Unprocessable Entity
```
