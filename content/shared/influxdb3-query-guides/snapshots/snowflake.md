# Snowflake integration

Integrate {{< product-name >}} with Snowflake without complex ETL processes.
Export time series data snapshots into Apache Iceberg format and query directly from Snowflake.

> **Note**: Contact [InfluxData sales](https://www.influxdata.com/contact-sales/) to enable this capability for your organization.

## Key benefits

- **Efficient data access**: Query your data directly from Snowflake.
- **Cost-effective storage**: Optimize data retention and minimize storage costs.
- **Supports AI and ML workloads**: Enhance machine learning applications by making time-series data accessible in Snowflake.

## Prerequisites

Before you begin, ensure you have the following:

- **{{< product-name >}} Cloud Dedicated plan** or compatible environment

## Request Iceberg integration

1. Contact [InfluxData sales](https://www.influxdata.com/contact-sales/) to request Iceberg integration.

2. Be prepared to provide:
   - Your organization ID
   - Customer name
   - Cloud provider and region
   - External storage details (bucket name, region, permissions)
   - Technical contact information

> **Note**: Iceberg integration is a premium feature that requires setup by the InfluxData team.

## Integrate InfluxDB 3 with Snowflake

Once you've contacted sales and enabled Iceberg integration, your InfluxData support engineers will help you with the following steps:

1. [Create a Snowflake external stage](#create-a-snowflake-external-stage)
2. [Export InfluxDB time series data to Iceberg format](#export-influxdb-time-series-data-to-iceberg-format)
3. [Create an Iceberg table in Snowflake](#create-an-iceberg-table-in-snowflake)
4. [Query the Iceberg table from Snowflake](#query-the-iceberg-table-from-snowflake)

### Create a Snowflake external stage

Your support engineer will guide you through setting up a Snowflake external stage using the `CREATE STAGE` Snowflake SQL command. This establishes an external storage location (such as AWS S3) to store Iceberg table data and metadata.

#### Example: Configure an S3 stage in Snowflake

```sql
CREATE STAGE my_s3_stage 
URL='s3://my-bucket/'
STORAGE_INTEGRATION=my_storage_integration;
```

### Set up a catalog integration in Snowflake 

Your support engineer will help you set up a catalog integration in Snowflake to manage and load Iceberg tables efficiently.

#### Example: Create a catalog integration in Snowflake

```sql
CREATE CATALOG INTEGRATION my_catalog_integration
  CATALOG_SOURCE = 'OBJECT_STORE'
  TABLE_FORMAT = 'ICEBERG'
  ENABLED = TRUE;
```

For more information, refer to the [Snowflake documentation](https://docs.snowflake.com/en/user-guide/tables-iceberg-configure-catalog-integration).

### Export InfluxDB time series data to Iceberg format

> **Note**: Before exporting InfluxDB time series data to Iceberg format, ensure that the relevant InfluxDB tables are properly set up. Please reach out to your support engineers to configure the tables that need to be exported.

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#tab-cli)
[API](#tab-api)
{{% /tabs %}}

{{% tab-content %}}
{{% tab-pane id="tab-cli" %}}

#### Using the CLI

Use the `influxctl` command to export InfluxDB time-series data to Iceberg format:

```sh
influxctl snapshot export --namespace foo --table bar
```

{{% /tab-pane %}}
{{% tab-pane id="tab-api" %}}

#### Using the API

Use the {{% product-name %}} HTTP API to export snapshots and check status.

##### Example: Export a snapshot

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

##### Example: Check snapshot status

This example shows how to check the status of an ongoing or completed snapshot export using the HTTP API. 

- **Method**: `GET`
- **Endpoint**: `/snapshots/status`

The `GET` request to the `/snapshots/status` endpoint retrieves the status of the snapshot export. This can be used to monitor the progress of the export or verify its completion.

{{% /tab-pane %}}
{{% /tab-content %}}
{{< /tabs-wrapper >}}

#### Creating a configuration file

Before running the export command, you need to create a configuration file that specifies which tables to export:

1. Create a file named `config.json` in your working directory
2. Add the following JSON content, adjusting the namespace and table names to match your data:

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

This configuration file tells the exporter which InfluxDB tables to convert to Iceberg format. You can list multiple tables by adding more objects to the exports array.

After configuring the export settings in the `config.json` file, the system automatically handles the export process. The export generates an Iceberg metadata file that you'll reference when creating your Iceberg table in Snowflake.

### Create an Iceberg table in Snowflake 

After the export process is complete, you can work with your InfluxData support engineer to create an Iceberg table in Snowflake that references your exported data. If you do not have access to a support engineer, refer to the Snowflake documentation or consult your database administrator for assistance. Here's what happens during this step:

After the export process is complete, you'll work with your InfluxData support engineer to create an Iceberg table in Snowflake that references your exported data. Here's what happens during this step:

> **Note**: **Tables created through this integration are read-only.**  
> **You cannot write directly to these tables using Snowflake or any other engine.**  
> They serve as an analytics interface to your InfluxDB data.

1. Your support engineer will provide you with the location of the Iceberg metadata file generated during the export process.

2. Using this information, you or your database administrator will execute a SQL command in Snowflake similar to:

```sql
CREATE ICEBERG TABLE my_iceberg_table
  EXTERNAL_VOLUME = 'my_external_volume'
  METADATA_FILE_PATH = 's3://my-bucket/path/to/metadata.json';
```

3. Your support engineer will help ensure the EXTERNAL_VOLUME and METADATA_FILE_PATH parameters correctly point to your external storage and metadata file.

This creates a table in Snowflake that reads directly from the Iceberg-formatted data exported from your InfluxDB instance.

### Query the Iceberg table from Snowflake

Once the Iceberg table is set up, you can query it using standard SQL in Snowflake.

#### Example: Query the Iceberg table

```sql
SELECT * FROM my_iceberg_table
WHERE timestamp > '2025-01-01';
```

## Considerations and limitations

When exporting data from InfluxDB to an Iceberg table, keep the following considerations and limitations in mind:

- **Data consistency**: Ensure that the exported data in the Iceberg table is consistent with the source data in InfluxDB.
- **Performance**: Query performance may vary based on data size and query complexity.
- **Feature support**: Some advanced features of InfluxDB may not be fully supported in Snowflake through Iceberg integration.
