# Integrating InfluxDB with Snowflake Using Apache Iceberg

## Overview

Snapshots for Snowflake enable users to export time-series data from InfluxDB into a structured format using Apache Iceberg. This integration facilitates efficient data sharing between InfluxDB and Snowflake without the need for complex ETL processes.

### Key Benefits

- **Efficient data access**: Query InfluxDB data directly from Snowflake.
- **Cost-effective storage**: Optimize data retention and minimize storage costs.
- **Supports AI and ML workloads**: Enhance machine learning applications by making time-series data accessible in Snowflake.

## Prerequisites

Before you begin, ensure you have the following:

- A **Snowflake account** with necessary permissions.
- Access to an **external object store** (such as AWS S3).
- Familiarity with **Apache Iceberg** and **Snowflake**.

## Step-by-step guide

### Step 1: Configure external storage

Set up an external storage location (such as AWS S3) to store Iceberg table data and metadata.

#### Example: Configure an S3 stage in Snowflake

```sql
CREATE STAGE my_s3_stage 
URL='s3://my-bucket/'
STORAGE_INTEGRATION=my_storage_integration;
```

For more details, refer to the [Snowflake documentation](https://docs.snowflake.com/en/user-guide/tables-iceberg-configure-catalog-integration-object-storage).

### Step 2: Set up a catalog integration in Snowflake

Set up a catalog integration in Snowflake to manage and load Iceberg tables efficiently.

#### Example: Create a catalog integration in Snowflake

```sql
CREATE CATALOG INTEGRATION my_catalog_integration
  CATALOG_SOURCE = 'OBJECT_STORE'
  TABLE_FORMAT = 'ICEBERG'
  ENABLED = TRUE;
```

For more details, refer to the [Snowflake documentation](https://docs.snowflake.com/en/user-guide/tables-iceberg-configure-catalog-integration).

### Step 3: Export InfluxDB data to Iceberg format

Use InfluxDB's Iceberg Exporter to convert and export your time-series data into the Iceberg table format.

#### Example: Export data using the Iceberg Exporter

```sh
# Clone the Iceberg exporter repository
git clone https://github.com/influxdata/influxdb_iox.git
cd influxdb_iox/iceberg_exporter
```

- Configure the exporter with your InfluxDB data source and target Iceberg table location.
- Run the exporter to generate Iceberg-compatible Parquet files.

For more details, refer to the [Iceberg Exporter README](https://github.com/influxdata/influxdb_iox/tree/main/iceberg_exporter).

### Step 4: Create an Iceberg table in Snowflake

After exporting the data, create an Iceberg table in Snowflake.

#### Example: Create an Iceberg table in Snowflake

```sql
CREATE ICEBERG TABLE my_iceberg_table
  EXTERNAL_VOLUME = 'my_external_volume'
  METADATA_FILE_PATH = 's3://my-bucket/path/to/metadata.json';
```

Ensure that `EXTERNAL_VOLUME` and `METADATA_FILE_PATH` point to your external storage and metadata file.

### Step 5: Query the Iceberg table from Snowflake

Once the Iceberg table is set up, you can query it using standard SQL in Snowflake.

#### Example: Query the Iceberg table

```sql
SELECT * FROM my_iceberg_table
WHERE timestamp > '2025-01-01';
```

## Interfaces for using Iceberg integration

- **CLI**: `Influx CTL` enables users to trigger snapshot exports.
- **API**: Provides REST endpoints to manage and configure snapshots.
- **SQL (Snowflake)**: Query Iceberg tables using standard SQL.

## CLI and API reference

### CLI commands

#### Example: Enable Iceberg feature and export a snapshot

```sh
# Enable Iceberg feature
influxctl enable-iceberg

# Export a snapshot
influxctl export --namespace foo --table bar
```

### API endpoints

#### Example: Export a snapshot

- **Method**: `POST`
- **Endpoint**: `/snapshots/export`
- **Request body**:
  
```json
{
  "namespace": "foo",
  "table": "bar"
}
```

#### Example: Check snapshot status

- **Method**: `GET`
- **Endpoint**: `/snapshots/status`

## Considerations and limitations

- **Data consistency**: Ensure that the exported data in the Iceberg table is consistent with the source data in InfluxDB.
- **Performance**: Query performance may vary based on data size and query complexity.
- **Feature support**: Some advanced features of InfluxDB may not be fully supported in Snowflake through Iceberg integration.

## Next steps

- Enhance REST Catalog support.
- Optimize AWS S3 access control and security.
- Improve Grafana dashboards and alerting.
- Expand compatibility testing with other Iceberg engines.

## References

- **InfluxDB Iceberg Exporter**: [GitHub Repository](https://github.com/influxdata/influxdb_iox/tree/main/iceberg_exporter)
- **Snowflake Iceberg Tables**: [Snowflake Documentation](https://docs.snowflake.com/en/user-guide/tables-iceberg)


