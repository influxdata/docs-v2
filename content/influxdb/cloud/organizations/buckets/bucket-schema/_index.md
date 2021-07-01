---
title: Manage bucket schemas
seotitle: Manage bucket schemas in InfluxDB
description: Manage bucket schemas in InfluxDB. Optionally, ensure data written to InfluxDB follows a specific schema.
menu:
  influxdb_cloud:
    name: Manage bucket schemas
    parent: Manage buckets
weight: 250
influxdb/cloud/tags: [buckets, bucket-schema, bucket schemas, schema]
related:
  - /influxdb/cloud/reference/key-concepts/
  - /influxdb/cloud/reference/key-concepts/data-schema/
  - /influxdb/cloud/reference/key-concepts/data-elements/
---

 Use **bucket schemas** to enforce specific [columns](/influxdb/cloud/reference/glossary/#column), [fields](/influxdb/cloud/reference/glossary/#field), and
 [data types](/influxdb/cloud/reference/glossary/#data-type) for your data.

{{% bucket-schema/type %}}

{{% note %}}

#### Before you begin

The `bucket-schema` examples below reference [**InfluxDB data elements**](/influxdb/cloud/reference/key-concepts/data-elements/). We recommend reviewing data elements and [InfluxDB key concepts](/influxdb/cloud/reference/key-concepts/) if you aren't familar with these concepts.
{{% /note %}}

- [View bucket schema types](#view-bucket-schema-types)
- [Create a bucket schema](#create-a-bucket-schema)
- [Add schemas to a bucket](#add-schemas-to-a-bucket)
- [Update a schema](#update-a-schema)
- [Errors](#errors)

### View bucket schema types
Only buckets with an `explicit` schema-type allow bucket schemas.
To view your bucket's schema-type, use the [`influx bucket list` command](/influxdb/cloud/reference/cli/influx/bucket-schema/list).

### Create a bucket schema
Use the `influx` CLI to set the schema-type and one or more measurement schemas for your bucket:

1. Create a **columns file** (CSV, JSON, or Newline delimited JSON (NDJSON)) to define the columns, fields, and data types to require for a measurement.
For more information, see [Create a columns file](/influxdb/cloud/reference/cli/influx/bucket-schema/create/#create-a-columns-file).

2. Create a bucket with the `schema-type` flag set to `explicit`.

    ```sh
    {{< get-assets-text "bucket-schema/bucket-schema-type.sh" >}}
    ```

3. Use the [`influx bucket-schema create` command](/influxdb/cloud/reference/cli/influx/bucket-schema/create) to create the measurement schema.

   Provide the following:
   - location of your columns file with the `columns-file` flag
   - measurement name with the `name` flag. This will match the [measurement column](/influxdb/cloud/reference/key-concepts/data-elements/#measurement) in your data.

   To output measurement schema column details, use the `extended-output` flag.

   ```sh
   influx bucket-schema create \
     --bucket my_explicit_bucket \
     --name cpu \
     --columns-file columns.csv \
     --extended-output
   ```

   The output is the following:

   ```sh
   ID                      Measurement Name       Column Name     Column Type   Column Data Type    Bucket ID
   <schema-id>             cpu                    time            timestamp                        <bucket-id>
   <schema-id>             cpu                    host            tag                              <bucket-id>
   <schema-id>             cpu                    usage_user      field         float              <bucket-id>
   ```

4. To write data to the bucket, use the [`influx write` command](/influxdb/cloud/reference/cli/influx/write).

### Add schemas to a bucket
Use the [`influx bucket-schema create` command](/influxdb/cloud/reference/cli/influx/bucket-schema/create) to define additional measurement
schemas for a bucket.

{{% note %}}
{{< bucket-schema/requires >}}
```sh
{{< get-assets-text "bucket-schema/bucket-schema-type.sh" >}}
```
{{% /note %}}

1. Add a measurement schema to define the new measurement.

    ```sh
    influx bucket-schema create \
      --bucket my_explicit_bucket \
      --name temperature \
      --columns-file schema.json
    ```

2. Use the [`influx bucket-schema list` command](/influxdb/cloud/reference/cli/influx/bucket-schema/list) to list measurement schemas of a bucket.
   To output schema column details, use the `extended-output` flag.

    ```sh
    influx bucket-schema list --bucket my_explicit_bucket --extended-output
    ```

### Update a schema

Use the [`influx bucket-schema update` command](/influxdb/cloud/reference/cli/influx/bucket-schema/update) to add new columns to a measurement schema. You cannot modify or delete columns in bucket schemas.

### Errors

#### Not permitted by schema
If the measurement data doesn't conform to the measurement schema defined for the bucket, InfluxDB returns an error.

In the following example, the *cpu* measurement has an incorrect `usage_user` [data type](/influxdb/cloud/reference/glossary/#data-type):

```sh
influx write -b my_explicit_bucket 'cpu,host=myHost usage_user="1001" 1556896326'
```

The output is the following:
```sh
Error: failed to write data:
unable to parse 'cpu,host=myHost usage_user="1001" 1556896326':
schema: field type for field "usage_user" not permitted by schema; got String but expected Float
  ```

#### No measurement schemas
If you attempt to write to a bucket that has schema-type `explicit` but doesn't have a measurement schema, the
bucket rejects write attempts.

The output is the following:

```sh
Error: failed to write data: schema: bucket "my_explicit_bucket" contains
no measurement schemas
```

#### Failed to create measurement
If you attempt to add a new measurement schema with the
same measurement name as an existing schema, InfluxDB rejects the new schema.

The output is the following:
```sh
Error: failed to create measurement: 422 Unprocessable Entity
```
