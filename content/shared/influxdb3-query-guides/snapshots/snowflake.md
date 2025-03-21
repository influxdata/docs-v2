
Integrate {{< product-name >}} with Snowflake and other Iceberg-compatible tools without the need for complex ETL processes.
Export time series data snapshots from InfluxDB into Apache Iceberg format and query it from Snowflake.

### Key Benefits

- **Efficient data access**: Query your data directly from Snowflake.
- **Cost-effective storage**: Optimize data retention and minimize storage costs.
- **Supports AI and ML workloads**: Enhance machine learning applications by making time-series data accessible in Snowflake.

## Prerequisites

Before you begin, ensure you have the following:

- A **Snowflake account** with necessary permissions.
- Access to an **external object store** (such as AWS S3).
- Familiarity with **Apache Iceberg** and **Snowflake**.

## Integrate InfluxDB 3 with Snowflake

1. [Configure external storage](#configure-external-storage)
2. [Set up a catalog integration in Snowflake](#set-up-a-catalog-integration-in-snowflake)
3. [Export InfluxDB data to Iceberg format](#export-influxdb-data-to-iceberg-format)
4. [Create an Iceberg table in Snowflake](#create-an-iceberg-table-in-snowflake)
5. [Query your data in Snowflake](#query-your-data-in-snowflake)


### Create a Snowflake external stage

Use the `CREATE STAGE` Snowflake SQL command to set up an external storage location
(such as AWS S3) to store Iceberg table data and metadata--for example:

#### Example: Configure an S3 stage in Snowflake

```sql
CREATE STAGE my_s3_stage 
URL='s3://my-bucket/'
STORAGE_INTEGRATION=my_storage_integration;

### Set up a catalog integration in Snowflake

Set up a catalog integration in Snowflake to manage and load Iceberg tables efficiently.

#### Example: Create a catalog integration in Snowflake

```sql
CREATE CATALOG INTEGRATION my_catalog_integration
  CATALOG_SOURCE = 'OBJECT_STORE'
  TABLE_FORMAT = 'ICEBERG'
  ENABLED = TRUE;
```

For more information, refer to the [Snowflake documentation](https://docs.snowflake.com/en/user-guide/tables-iceberg-configure-catalog-integration).

### Export InfluxDB time series data to Iceberg format

Use the InfluxDB Iceberg exporter to convert and export your time-series data from your {{% product-name omit="Clustered" %}} cluster to the Iceberg table format.

#### Example: Export data using Iceberg exporter

This example assumes the following:

- You've configured compaction to trigger more quickly with these environment variables:
  - `INFLUXDB_IOX_COMPACTION_MIN_NUM_L0_FILES_TO_COMPACT=1`
  - `INFLUXDB_IOX_COMPACTION_MIN_NUM_L1_FILES_TO_COMPACT=1`
- You have a `config.json`.

#### Example `config.json`

```json
{
    "exports": [
        {
            "namespace": "company_sensors",
            "table_name": "cpu"
        }
    ]
}
```

### Run the export command

```console
$ influxdb_iox iceberg export \
  --catalog-dsn postgresql://postgres@localhost:5432/postgres \
  --source-object-store file 
  --source-data-dir ~/.influxdb_iox/object_store \
  --sink-object-store file \
  --sink-data-dir /tmp/iceberg \
  --export-config-path config.json
```

The export command outputs an absolute path to an Iceberg metadata file:

`/tmp/iceberg/company_sensors/cpu/metadata/v1.metadata.json
`

### Create an Iceberg table in Snowflake

After exporting the data, create an Iceberg table in Snowflake.

#### Example: Create an Iceberg table in Snowflake

```sql
CREATE ICEBERG TABLE my_iceberg_table
  EXTERNAL_VOLUME = 'my_external_volume'
  METADATA_FILE_PATH = 's3://my-bucket/path/to/metadata.json';
```

Ensure that `EXTERNAL_VOLUME` and `METADATA_FILE_PATH` point to your external storage and metadata file.

### Query the Iceberg table from Snowflake

Once the Iceberg table is set up, you can query it using standard SQL in Snowflake.

#### Example: Query the Iceberg table

```sql
SELECT * FROM my_iceberg_table
WHERE timestamp > '2025-01-01';
```

## Interfaces for using Iceberg integration

- [Use the CLI to trigger snapshot exports](#use-the-CLI-to-trigger-snapshot-exports)
- [Use the API to manage and configure snapshots](#use-the-api-to-manage-and-configure-snapshots)
- [Use SQL in Snowflake to query Iceberg tables](#use-sql-in-snowflake-to-query-iceberg-tables)

### Use the CLI to trigger snapshot exports

#### Example: Enable Iceberg feature and export a snapshot

```sh
# Enable Iceberg feature
$ influxctl enable-iceberg

# Export a snapshot
$ influxctl export --namespace foo --table bar
```

### Use the API to manage and configure snapshots

Use the {{% product-name %}} HTTP API to export snapshots and check status.

#### Example: Export a snapshot

This example demonstrates how to export a snapshot of your data from InfluxDB to an Iceberg table using the HTTP API.

- **Method**: `POST`
- **Endpoint**: `/snapshots/export`
- **Request body**:
  
```json
{
  "namespace": "foo",
  "table": "bar"
}
```
The `POST` request to the `/snapshots/export` endpoint triggers the export of data from the specified namespace and table in InfluxDB to an Iceberg table. The request body specifies the namespace (`foo`) and the table (`bar`) to be exported.

#### Example: Check snapshot status

This example shows how to check the status of an ongoing or completed snapshot export using the HTTP API. 

- **Method**: `GET`
- **Endpoint**: `/snapshots/status`

The `GET` request to the `/snapshots/status` endpoint retrieves the status of the snapshot export. This can be used to monitor the progress of the export or verify its completion.

## Considerations and limitations

When exporting data from InfluxDB to an Iceberg table, keep the following considerations and limitations in mind:

- **Data consistency**: Ensure that the exported data in the Iceberg table is consistent with the source data in InfluxDB.
- **Performance**: Query performance may vary based on data size and query complexity.
- **Feature support**: Some advanced features of InfluxDB may not be fully supported in Snowflake through Iceberg integration.
