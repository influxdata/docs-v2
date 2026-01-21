---
title: Export Iceberg for Snowflake
seotitle: Export time series data to Iceberg format for Snowflake 
description: >
  Integrate {{< product-name >}} with Snowflake without complex ETL processes.
  Export time series data snapshots into Apache Iceberg format and query directly from Snowflake.
menu:
  influxdb3_cloud_dedicated:
    name: Export Iceberg for Snowflake
    parent: Use integrations 
weight: 101
influxdb3/cloud-dedicated/tags: [integrations, snowflake, iceberg, export]
---

Integrate {{< product-name >}} with Snowflake without complex ETL processes.
Export time series data snapshots into Apache Iceberg format and query directly from Snowflake.

## Key benefits

- **Efficient data access**: Query your data directly from Snowflake.
- **Cost-effective storage**: Optimize data retention and minimize storage costs.
- **Supports AI and ML workloads**: Enhance machine learning applications by making time-series data accessible in Snowflake.

> [!Note]
> #### Contact sales to enable the InfluxDB Iceberg integration
>  
> The InfluxDB Iceberg integration is a premium feature.
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

The {{% product-name %}} Iceberg integration requires setup by the InfluxData team.
After you have contacted sales and enabled Iceberg integration, you'll specify which
tables you want to make available for export.
InfluxData support engineers will work with you to set up the integration by:

- Configuring a Snowflake external stage using the `CREATE STAGE` SQL command with your storage provider details. 
This creates an external storage location (such as AWS S3) for Iceberg table data and metadata.
- Establishing a catalog integration in Snowflake to efficiently manage and load Iceberg tables.
For more information, see the [Snowflake documentation](https://docs.snowflake.com/en/user-guide/tables-iceberg-configure-catalog-integration).
- Creating an exports configuration that specifies which tables are available for export.

<!-- Customer-triggered exports aren't yet supported.
After the setup is complete, you can export data snapshots to Iceberg format and query the Iceberg table from Snowflake.
-->

> [!Important]
> #### Export tables are read-only in Snowflake
> 
> Tables created through this integration are _read-only_.  
> You cannot write directly to these tables using Snowflake or any other engine. 
> 

## Export data to Iceberg format

After the setup is complete, the InfluxData Support team triggers the initial export of your data snapshots.
The exported data is stored in Iceberg format in the external storage location you specified.

_To refresh the exported data with new or changed data, submit a request to the
[InfluxData Support team](https://support.influxdata.com) each time a refresh is needed.
Currently, customer-triggered exports aren't supported._

<!-- Customer-triggered exports aren't yet supported.
Use the `influxctl` CLI or the HTTP API to export snapshots to Iceberg format.

> [!Important]
> Before you can export data to Iceberg format, the InfluxData Support Team needs
> to set up your tables for exporting.
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

- {{% code-placeholder-key %}}`NAMESPACE`{{% /code-placeholder-key %}}: The namespace (database) that contains the tables to export
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: The name of the table to export

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

- {{% code-placeholder-key %}}`NAMESPACE`{{% /code-placeholder-key %}}: The namespace (database) that contains the tables to export
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: The name of the table to export

{{% /tab-content %}}
{{< /tabs-wrapper >}}
-- Customer-triggered exports aren't supported -->

## Check snapshot status

To check the status of a snapshot export, contact the [InfluxData Support team](https://support.influxdata.com).

<!-- API isn't yet available to customers.

Use the HTTP API to check the status of an ongoing or completed snapshot export.

{{% api-endpoint method="GET" endpoint="/snapshots/status" %}}

```bash
curl -X GET https://{{% influxdb/host %}}/snapshots/status
```
-- API isn't yet available to customers -->

## Query the Iceberg table from Snowflake

Use SQL in Snowflake to query the Iceberg table exported from {{< product-name >}}.

## Considerations and limitations

When exporting data from InfluxDB to an Iceberg table, keep the following considerations and limitations in mind:

- **Export controls limited to InfluxData**: You can't export or refresh data to Iceberg format independently. The InfluxData Support Team handles set up of the initial export and subsequently handles all data refreshes.
  Submit a request to the [InfluxData Support team](https://support.influxdata.com) to:
    - Update your Snowflake tables with new or changed data
    - Check the status of a snapshot export
- **Exported data is read-only**: Tables created through this integration are _read-only_. You cannot write directly to these tables using Snowflake or any other engine.
- **Data consistency**: Ensure that the exported data in the Iceberg table is consistent with the source data in InfluxDB.
- **Performance**: Query performance may vary based on data size and query complexity.
- **Feature support**: Some advanced features of InfluxDB may not be fully supported in Snowflake through Iceberg integration.
