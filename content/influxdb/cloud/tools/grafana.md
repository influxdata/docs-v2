---
title: Use Grafana with InfluxDB Cloud
description: >
  Use [Grafana](https://grafana.com/) to visualize data from your **InfluxDB Cloud** instance.
menu:
  influxdb_cloud:
    name: Use Grafana
    parent: Tools & integrations
weight: 104
influxdb/cloud/tags: [grafana]
related:
  - https://grafana.com/docs/, Grafana documentation
  - /influxdb/cloud/query-data/get-started/
  - /influxdb/cloud/query-data/influxql/
---

Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from InfluxDB Cloud.

{{% note %}}
The instructions in this guide require **Grafana Cloud** or **Grafana v7.1+**.
{{% /note %}}

1. [Sign up for {{< cloud-name >}}](/influxdb/cloud/get-started/).
2. [Sign up for Grafana Cloud](https://grafana.com/products/cloud/) or
   [download and install Grafana](https://grafana.com/grafana/download).
3. Visit your **Grafana Cloud user interface** (UI) or, if running Grafana locally,
   [start Grafana](https://grafana.com/docs/grafana/latest/installation/) and visit
   `http://localhost:3000` in your browser.
4. In the left navigation of the Grafana UI, hover over the gear
   icon to expand the **Configuration** section. Click **Data Sources**.
5. Click **Add data source**.
6. Select **InfluxDB** from the list of available data sources.
7. On the **Data Source configuration page**, enter a **name** for your InfluxDB data source.
8. Under **Query Language**, select one of the following:

{{< tabs-wrapper >}}
{{% tabs %}}
[Flux](#)
[InfluxQL](#)
{{% /tabs %}}
<!---------------------------- BEGIN FLUX CONTENT ---------------------------->
{{% tab-content %}}

## Configure Grafana to use Flux

With **Flux** selected as the query language in your InfluxDB data source,
configure your InfluxDB connection:

1. Under **Connection**, enter the following:

    - **URL**: Your [InfluxDB URL](/influxdb/cloud/reference/urls/).

        ```sh
        https://cloud2.influxdata.com/
        ```

    - **Organization**: Your InfluxDB [organization name **or** ID](/influxdb/cloud/organizations/view-orgs/).
    - **Token**: Your InfluxDB [authentication token](/influxdb/cloud/security/tokens/).
    - **Default Bucket**: The default [bucket](/influxdb/cloud/organizations/buckets/) to use in Flux queries.
    - **Min time interval**: The [Grafana minimum time interval](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/#min-time-interval).

    {{< img-hd src="/img/influxdb/cloud-tools-grafana.png" />}}

2. Click **Save & Test**. Grafana attempts to connect to the InfluxDB datasource
   and returns the results of the test.
{{% /tab-content %}}
<!----------------------------- END FLUX CONTENT ----------------------------->
<!-------------------------- BEGIN INFLUXQL CONTENT -------------------------->
{{% tab-content %}}

## Configure Grafana to use InfluxQL

1. [Set up the InfluxDB 1.x compatibility API](#set-up-the-influxdb-1x-compatibility-api)
2. [Configure your InfluxDB connection](#configure-your-influxdb-connection)

### Set up the InfluxDB 1.x compatibility API
Grafana uses the [InfluxDB 1.x compatibility API](/influxdb/cloud/reference/api/influxdb-1x/)
to query InfluxDB Cloud using InfluxQL.
To successfully authenticate with and query the 1.x compatibility API:

- [Create a InfluxDB v1 authorization](#create-an-influxdb-v1-authorization)
- [Create a InfluxDB DBRP mapping](#create-an-influxdb-dbrp-mapping)

#### Create an InfluxDB v1 authorization
Use the [`influx v1 auth create` command](/influxdb/cloud/reference/cli/influx/v1/auth/create/)
to grant read/write permissions to specific buckets. Provide the following:

- [bucket IDs](/influxdb/cloud/organizations/buckets/view-buckets/) to grant read
  or write permissions to
- new username
- new password _(when prompted)_

<!--  -->
```sh
influx v1 auth create \
  --read-bucket 00xX00o0X001 \
  --write-bucket 00xX00o0X001 \
  --username example-user
```

#### Create an InfluxDB DBRP mapping
When using InfluxQL to query InfluxDB Cloud, the query must specify a database and a retention policy.
Use the [`influx v1 dbrp create` command](/influxdb/cloud/reference/cli/influx/v1/dbrp/create/)
command to create a database/retention policy (DBRP) mapping that maps a database
and retention policy combination to an InfluxDB Cloud [bucket](/influxdb/cloud/reference/glossary/#bucket).

{{% note %}}
##### Automatically create DBRP mappings on write
When using the InfluxDB 1.x compatibility API to write data to InfluxDB Cloud,
InfluxDB Cloud automatically creates DBRP mappings for buckets whose names match the
`db/rp` naming pattern of the database and retention policy specified in the write request.
For more information, see [Database and retention policy mapping – Writing data](/influxdb/cloud/reference/api/influxdb-1x/dbrp/#when-writing-data).
{{% /note %}}

Provide the following:

- database name
- retention policy
- [bucket ID](/influxdb/cloud/organizations/buckets/view-buckets/)

```sh
influx v1 dbrp create \
  --db example-db \
  --rp example-rp \
  --bucket-id 00xX00o0X001 \
  --default
```

_For more information about DBRP mapping, see [Database and retention policy mapping](/influxdb/cloud/reference/api/influxdb-1x/dbrp/)._

### Configure your InfluxDB connection
With **InfluxQL** selected as the query language in your InfluxDB data source settings:

1. Under **HTTP**, enter the following:

    - **URL**: Your [InfluxDB Cloud URL](/influxdb/cloud/reference/regions/).

        ```sh
        https://cloud2.influxdata.com/
        ```
    - **Access**: Server (default)

2. Under **InfluxDB Details**, do the following:

    - **Database**: Enter the database name [mapped to your InfluxDB Cloud bucket](#create-an-influxdb-dbrp-mapping).
    - **User**: Enter the username associated with your [InfluxDB 1.x compatibility authorization](#create-an-influxdb-v1-authorization).
    - **Password**: Enter the password associated with your [InfluxDB 1.x compatibility authorization](#create-an-influxdb-v1-authorization).
    - **HTTP Method**: Select **GET**.

    <!--  -->
    {{< img-hd src="/img/influxdb/cloud-tools-grafana-influxql.png" />}}

3. Click **Save & Test**. Grafana attempts to connect to the InfluxDB Cloud data source
   and returns the results of the test.
{{% /tab-content %}}
<!--------------------------- END INFLUXQL CONTENT --------------------------->
{{< /tabs-wrapper >}}

## Query and visualize data

With your InfluxDB connection configured, use Grafana and Flux to query and
visualize time series data stored in **{{< cloud-name >}}**.

For more information about using Grafana, see the [Grafana documentation](https://grafana.com/docs/).
If you're just learning Flux, see [Get started with Flux](/influxdb/cloud/query-data/get-started/).
