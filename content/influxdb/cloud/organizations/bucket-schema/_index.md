---
title: Manage bucket schemas
seotitle: Manage bucket schemas in InfluxDB
description: Manage bucket schemas in InfluxDB using the influx CLI.
menu:
  influxdb_cloud:
    name: Manage bucket schemas
    parent: Manage organizations
weight: 105
influxdb/cloud/tags: [buckets, bucket-schema, schema]
---

Use *bucket schemas* to restrict a bucket's columns and data types.

A **bucket schema** enforces the shape of data in a bucket.
Buckets with the `explicit` schema-type allow you to assign your own named bucket schemas
and reject write requests that do not conform to a schema.

By default, buckets have an `implicit` **schema-type**  which allows you to write data
without enforcing a particular schema.

### Create a bucket schema
Use the `influx` CLI to set the schema-type and one or more schemas for your bucket:

1. Create a measurement schema *columns file* using CSV, JSON, or [Newline delimited JSON (NDJSON)](http://ndjson.org/). Define the name, type, and data type of each column.
  {{< code-tabs-wrapper >}}
  {{% code-tabs %}}
  [columns.csv](#)
  [columns.json](#)
  [columns.ndjson](#)
  {{% /code-tabs %}}
  {{% code-tab-content %}}

  ```sh
  {{< get-assets-text "bucket-schema/bucket-schema-columns.csv" >}}
  ```

  {{% /code-tab-content %}}
  {{% code-tab-content %}}

  ```json
  {{< get-assets-text "bucket-schema/bucket-schema-columns.json" >}}
  ```

  {{% /code-tab-content %}}
  {{% code-tab-content %}}

  ```json
  {{< get-assets-text "bucket-schema/bucket-schema-columns.ndjson" >}}
  ```

  {{% /code-tab-content %}}
  {{< /code-tabs-wrapper >}}

2. Create a bucket with the `schema-type` flag set to `explicit`.

    ```sh
    {{< get-assets-text "bucket-schema/bucket-schema-type.sh" >}}
    ```

    To view your bucket's schema-type, use the [`influx bucket list` command](/influxdb/cloud/reference/cli/influx/bucket-schema/list).

    With schema-type `explicit`, but no bucket-schema, the
    bucket rejects write attempts.

    ```sh
    influx write --bucket my_explicit_bucket --format=lp "cpu,host=foo usage_user=0.5"
    ```

    The output is the following:
    ```sh
    Error: failed to write data: schema: bucket "my_explicit_bucket" contains
    no measurement schemas
    ```

3. Use the [`influx bucket-schema create` command](/influxdb/cloud/reference/cli/influx/bucket-schema/create) to assign the schema to your bucket.
   Provide the location of your schema columns file with the `columns-file` flag and the name of your measurement with the `name` flag.
   To output schema column details, use the optional `extended-output` flag.

   ```sh
   influx bucket-schema create \
     --bucket my_explicit_bucket \
     --name cpu \
     --columns-file columns.csv \
     --extended-output
   ```

   InfluxDB responds with the created schema:

   ```sh
   ID                      Measurement Name       Column Name     Column Type   Column Data Type    Bucket ID
   07b80ed3bb73e000        cpu                    time            timestamp     4d5dbdfd5a67ae4f
   07b80ed3bb73e000        cpu                    host            tag           4d5dbdfd5a67ae4f
   07b80ed3bb73e000        cpu                    usage_user      field         float               4d5dbdfd5a67ae4f
   ```

   #### Columns format

    By default, InfluxDB attempts to detect the columns file format.
    To specify the format, use the [`columns-format` flag](/influxdb/cloud/reference/cli/influx/bucket-schema/create).

4. To write data to the bucket, use the [`influx write` command](/influxdb/cloud/reference/cli/influx/write).
    If the data doesn't conform to the measurement's schema, InfluxDB returns an error.

    The following example attempts to write a *cpu* measurement:

    ```sh
    influx write -b my_explicit_bucket 'cpu,host=myHost usage_user="1001" 1556896326'
    ```

    The output is the following:
    ```sh
    Error: failed to write data:
    unable to parse 'cpu,host=myHost usage_user="1001" 1556896326':
    schema: field type for field "usage_user" not permitted by schema; got String but expected Float
    ```

### Add measurement schemas to a bucket
Use the [`influx bucket-schema create` command](/influxdb/cloud/reference/cli/influx/bucket-schema/create) to add additional measurement
schemas to a bucket.

{{% note %}}
{{< bucket-schema-type >}}
```sh
{{< get-assets-text "bucket-schema/bucket-schema-type.sh" >}}
```
{{% /note %}}

1. Add a new schema with a new measurement name.

    ```sh
    influx bucket-schema create \
      --bucket my_explicit_bucket \
      --name temperature \
      --columns-file schema.json
    ```

    InfluxDB responds with an error if you attempt to add a new schema with the
    same measurement name as an existing schema, as in the following example:

    ```sh
    influx bucket-schema create \
      --bucket my_explicit_bucket \
      --name cpu \
      --columns-file schema.json
    ```

    The output is the following:
    ```sh
    Error: failed to create measurement: 422 Unprocessable Entity
    ```

2. Use the [`influx bucket-schema list` command](/influxdb/cloud/reference/cli/influx/bucket-schema/list) to list bucket-schemas.
   To output schema column details, use the optional `extended-output` flag.

    ```sh
    influx bucket-schema list --bucket my_explicit_bucket --extended-output
    ```
### Update a measurement schema

  Use the [`influx bucket-schema update` command](/influxdb/cloud/reference/cli/influx/bucket-schema/update) to update a bucket's measurement schema.
