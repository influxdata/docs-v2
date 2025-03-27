Integrate {{< product-name >}} with Snowflake without complex ETL processes.
Export time series data snapshots into Apache Iceberg format and query directly from Snowflake.

## Key benefits

- **Efficient data access**: Query your data directly from Snowflake.
- **Cost-effective storage**: Optimize data retention and minimize storage costs.
- **Supports AI and ML workloads**: Enhance machine learning applications by making time-series data accessible in Snowflake.

> [!Note]
> #### Contact sales to enable Iceberg integration
>  
> Iceberg integration is a premium feature that requires setup by the InfluxData team.
> [Contact InfluxData Sales](https://www.influxdata.com/contact-sales/) to enable this capability for your account.

- [Prerequisite](#prerequisite)
- [Request Iceberg integration](#request-iceberg-integration)
- [Integrate InfluxDB 3 with Snowflake](#integrate-influxdb-3-with-snowflake)
- [Export data to Iceberg format](#export-data-to-iceberg-format)
- [Check snapshot status](#check-snapshot-status)
- [Query the Iceberg table from Snowflake](#query-the-iceberg-table-from-snowflake)
- [Considerations and limitations](#considerations-and-limitations)

### Prerequisite

Before you begin, ensure you have an [{{< product-name >}} account](/influxdb3/cloud-dedicated/get-started/setup/).

### Request Iceberg integration

1. [Contact InfluxData Sales](https://www.influxdata.com/contact-sales/) to request Iceberg integration for your {{% product-name %}} cluster. 

2. Be prepared to provide the following information:
   - Your organization ID
   - Customer name
   - Cloud provider and region
   - External storage details (bucket name, region, permissions)
   - Technical contact information

### Setup Snowflake and configure your cluster 

Iceberg integration for {{% product-name %}} requires setup by the InfluxData team.
After you have contacted sales and enabled Iceberg integration, you'll specify which
tables you want to make available for exporting.
InfluxData support engineers will help you with the integration steps, which include:

- Setting up a Snowflake external stage using the `CREATE STAGE` Snowflake SQL command and your storage provider details.
This establishes an external storage location (such as AWS S3) to store Iceberg table data and metadata.
- Setting up a catalog integration in Snowflake to manage and load Iceberg tables efficiently.
For more information, refer to the [Snowflake documentation](https://docs.snowflake.com/en/user-guide/tables-iceberg-configure-catalog-integration).
- Creating an export configuration that tells the InfluxDB Iceberg exporter which tables are available for export.

After the setup is complete, you can export data snapshots to Iceberg format and query the Iceberg table from Snowflake.

> [!Important]
> #### Export tables are read-only in Snowflake
> 
> Tables created through this integration are _read-only_.  
> You cannot write directly to these tables using Snowflake or any other engine. 
> 

## Export data to Iceberg format

Use the `influxctl` CLI command or the HTTP API to export snapshots to Iceberg format.

> [!Important]
> Before you can export data to Iceberg format, the InfluxData Support Team needs
> to have set up your tables for exporting.
> For more information, [contact the InfluxData Sales team]({{< cta-link >}}).

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#cli)
[API](#api)
{{% /tabs %}}
{{% tab-content %}}

{{% code-placeholders "NAMESPACE|TABLE_NAME" %}}
```bash
influxctl snapshot export --namespace NAMESPACE --table TABLE_NAME 
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`NAMESPACE`{{% /code-placeholder-key %}}: The namespace of the data to export. <!-- Namespace might need more explanation --> 
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: The table name to export

{{% /tab-content %}}
{{% tab-content %}}

**Endpoint**:

{{% api-endpoint method="POST" endpoint="/snapshots/export" %}}

**Request body**:
  
```json
{
  "namespace": "NAMESPACE",
  "table": "TABLE_NAME"
}
```

The following example shows how to use cURL with the HTTP API:

{{% code-placeholders "NAMESPACE|TABLE_NAME" %}}
```bash
curl -X POST https://{{% influxdb/host %}}/snapshots/export \
  -d '{"namespace": "NAMESPACE", "table": "TABLE_NAME"}'
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`NAMESPACE`{{% /code-placeholder-key %}}: The namespace of the data to export. <!--Might need more explanation--> 
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: The table name to export

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Check snapshot status

Use the HTTP API to check the status of an ongoing or completed snapshot export.

{{% api-endpoint method="GET" endpoint="/snapshots/status" %}}

```bash
curl -X GET https://{{% influxdb/host %}}/snapshots/status
```

## Query the Iceberg table from Snowflake

Use SQL in Snowflake to query the Iceberg table exported from {{< product-name >}}.

## Considerations and limitations

When exporting data from InfluxDB to an Iceberg table, keep the following considerations and limitations in mind:

- **Exported data is read-only**: Tables created through this integration are _read-only_. You cannot write directly to these tables using Snowflake or any other engine.
- **Data consistency**: Ensure that the exported data in the Iceberg table is consistent with the source data in InfluxDB.
- **Performance**: Query performance may vary based on data size and query complexity.
- **Feature support**: Some advanced features of InfluxDB may not be fully supported in Snowflake through Iceberg integration.

