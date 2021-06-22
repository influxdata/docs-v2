---
title: Manage bucket schema
seotitle: Manage bucket schema in InfluxDB
description: Manage bucket schema in InfluxDB using the influx CLI.
menu:
  influxdb_cloud:
    name: Manage bucket schema
    parent: Manage organizations
weight: 105
influxdb/cloud/tags: [buckets, bucket-schema, schema]
---

Use *bucket-schema* to restrict a bucket's columns and data types.

*Bucket-schema* are measurement schema that enforce the shape of
your bucket data.
By default, buckets receive *schema-type* `implicit` and InfluxDB's default
measurement schema.

Buckets with schema-type `explicit` allow you to assign your own schema.
These buckets reject write requests that do not obey their bucket-schema.

### Create a bucket schema
Use the influx CLI to set the schema-type and one or more schema for your bucket:

1. Create a bucket with the `schema-type` flag set to `explicit`.

   ```sh
   {{< get-assets-text "bucket-schema/bucket-schema-type.sh" >}}
   ```

   To view your bucket's schema-type, use the [`influx bucket list` command](/influxdb/cloud/reference/cli/influx/bucket-schema/list).

   With schema-type `explicit` but no bucket-schema, the
   bucket rejects write attempts.

   For example,
   ```sh
   influx write --bucket my_explicit_bucket --format=lp "cpu,host=foo usage_user=0.5"
   ```

   returns the following error:

   ```sh
   Error: failed to write data: schema: bucket "my_explicit_bucket" contains
   no measurement schemas
   ```

2. Create a measurement schema *columns file* using CSV, JSON, or Newline delimited JSON (NDJSON).
   Define the name, field type, and data type of each column.

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

3. Use the [`influx bucket-schema create` command](/influxdb/cloud/reference/cli/influx/bucket-schema/create) to set the schema for your bucket.
   Pass the location of your columns file to the `columns-file` flag and the
   name of your measurement schema to the `name` flag.

   ```sh
   influx bucket-schema create \
     --bucket my_explicit_bucket --name cpu \
     --columns-file columns.csv
     -x
   ```

   InfluxDB responds with the created schema.

   ```sh
   ID                      Measurement Name       Column Name     Column Type   Column Data Type    Bucket ID
   07b80ed3bb73e000        cpu                    time            timestamp     4d5dbdfd5a67ae4f
   07b80ed3bb73e000        cpu                    host            tag           4d5dbdfd5a67ae4f
   07b80ed3bb73e000        cpu                    usage_user      field         float               4d5dbdfd5a67ae4f
   ```

   #### Columns format

   Use the [`columns-format` flag](/influxdb/cloud/reference/cli/influx/bucket-schema/create)
   when you need to specify the format of your file.
   InfluxDB defaults to `auto` and attempts to guess the format.

### Add measurement schema to a bucket
Use the [`influx bucket-schema create` command](/influxdb/cloud/reference/cli/influx/bucket-schema/create) to add additional measurement
schema to a bucket.

1. Add a new schema with a new measurement name.

    ```sh
    influx bucket-schema create \
      -n my_explicit_bucket \
      --name temperature \
      --columns-file schema.json
    ```

    InfluxDB returns the new bucket-schema.

    ```sh
    ID                      Measurement Name        Bucket ID
    07b81b87c6deb000        temperature             4d5dbdfd5a67ae4f
    ```

2. Use the [`influx bucket-schema list` command](/influxdb/cloud/reference/cli/influx/bucket-schema/list) to list bucket-schemas. Your new schema should appear in the list.

    ```sh
    influx bucket-schema list -n my_explicit_bucket
    ```

    ```sh
    ### Output
    ID                      Measurement Name        Bucket ID
    07b81b87c6deb000        cpu                     4d5dbdfd5a67ae4f
    07b80ed3bb73e000        temperature             4d5dbdfd5a67ae4f
    ```

InfluxDB responds with an error if you attempt to add a new schema with the
same measurement name as an existing schema.

For example,
```sh
influx bucket-schema create \
  -n my_explicit_bucket \
  --name cpu \
  --columns-file schema.json
```

returns the error
```sh
Error: failed to create measurement: 422 Unprocessable Entity
```

### Write to the bucket

  Use the [`influx write` command](/influxdb/cloud/reference/cli/influx/write)
  to write data to a bucket.

  `write` returns an error
  if the bucket has schema-type `explicit` and the data does not obey a defined
   bucket-schema.

     ```sh
     influx write -b my_explicit_bucket 'cpu,host=myHost usage_user="1001" 1556896326'
     Error: failed to write data:
      unable to parse 'cpu,host=myHost usage_user="1001" 1556896326':
       schema: field type for field "usage_user" not permitted by schema; got String but expected Float
     ```

### Update a measurement schema

Use the [`influx bucket-schema update` command](/influxdb/cloud/reference/cli/influx/bucket-schema/update) to update a bucket's measurement schema.
