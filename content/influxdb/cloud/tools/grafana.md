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
        https://cloud2.influxdata.com
        ```

    - **Organization**: Your InfluxDB [organization name **or** ID](/influxdb/cloud/organizations/view-orgs/).
    - **Token**: Your InfluxDB [API token](/influxdb/cloud/security/tokens/).
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
To query InfluxDB Cloud from Grafana using InfluxQL:

1. [Download and set up the `influx` CLI](#download-and-set-up-the-influx-cli)
2. [Create an InfluxDB DBRP mapping](#create-an-influxdb-dbrp-mapping)
3. [Configure your InfluxDB connection](#configure-your-influxdb-connection)

### Download and set up the influx CLI
1. [Download the latest version of the `influx` CLI](/influxdb/cloud/sign-up/#optional-download-install-and-use-the-influx-cli)
   appropriate for your local operating system.
2. Create a CLI configuration that provides the required InfluxDB Cloud **host**,
   **organization**, and **API token** to all CLI commands.
   Use the [`influx config create` command](/influxdb/cloud/reference/cli/influx/config/create/)
   and provide the following:

   - [InfluxDB Cloud URL](/influxdb/cloud/reference/regions/)
   - [organization name](/influxdb/cloud/organizations/) _(by default, your email address)_
   - [API token](/influxdb/cloud/security/tokens/)

    ```sh
    influx config create \
      --config-name example-config-name \
      --host-url https://cloud2.influxdata.com \
      --org example-org \
      --token My5uP3rSeCr37t0k3n
    ```

    For more information about `influx` CLI configurations,
    see [`influx config`](/influxdb/cloud/reference/cli/influx/config/).

### Create an InfluxDB DBRP mapping
When using InfluxQL to query InfluxDB Cloud, the query must specify a database and a retention policy.
Use the [`influx v1 dbrp create` command](/influxdb/cloud/reference/cli/influx/v1/dbrp/create/)
command to create a database/retention policy (DBRP) mapping that associates a database
and retention policy combination with an InfluxDB Cloud [bucket](/influxdb/cloud/reference/glossary/#bucket).

DBRP mappings do not affect the retention period of the target bucket.
These mappings allow queries following InfluxDB 1.x conventions to successfully
query InfluxDB Cloud buckets.

{{% note %}}
##### Automatically create DBRP mappings on write
When using the InfluxDB 1.x compatibility API to write data to InfluxDB Cloud,
InfluxDB Cloud automatically creates DBRP mappings for buckets whose names match the
`db/rp` naming pattern of the database and retention policy specified in the write request.
For more information, see [Database and retention policy mapping – Writing data](/influxdb/cloud/reference/api/influxdb-1x/dbrp/#when-writing-data).
{{% /note %}}

Provide the following:

- database name
- retention policy name _(not retention period)_
- [bucket ID](/influxdb/cloud/organizations/buckets/view-buckets/)
- _(optional)_ `--default` flag if you want the retention policy to be the default retention
  policy for the specified database

#### Examples

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[DB with one RP](#)
[DB with multiple RPs](#)
{{% /code-tabs %}}
{{< code-tab-content >}}
```sh
influx v1 dbrp create \
  --db example-db \
  --rp example-rp \
  --bucket-id 00xX00o0X001 \
  --default
```
{{< /code-tab-content >}}
{{< code-tab-content >}}
```sh
# Create telegraf/autogen DBRP mapping with autogen
# as the default RP for the telegraf DB

influx v1 dbrp create \
  --db telegraf \
  --rp autogen \
  --bucket-id 00xX00o0X001 \
  --default

# Create telegraf/downsampled-daily DBRP mapping that
# writes to a different bucket

influx v1 dbrp create \
  --db telegraf \
  --rp downsampled-daily \
  --bucket-id 00xX00o0X002
```
{{< /code-tab-content >}}
{{< /code-tabs-wrapper >}}

_For more information about DBRP mapping, see [Database and retention policy mapping](/influxdb/cloud/reference/api/influxdb-1x/dbrp/)._

### Configure your InfluxDB connection
With **InfluxQL** selected as the query language in your InfluxDB data source settings:

1. Under **HTTP**, enter the following:

    - **URL**: Your [InfluxDB Cloud URL](/influxdb/cloud/reference/regions/).

        ```sh
        https://cloud2.influxdata.com
        ```
    - **Access**: Server (default)

2. Under **Custom HTTP Headers**, select **Add Header**. Provide your InfluxDB Cloud API token:

    - **Header**: Enter `Authorization`
    - **Value**: Use the `Token` schema and provide your [InfluxDB API token](/influxdb/v2.0/security/tokens/).
      For example:

      ```
      Token y0uR5uP3rSecr3tT0k3n
      ```

2. Under **InfluxDB Details**, do the following:

    - **Database**: Enter the database name [mapped to your InfluxDB Cloud bucket](#create-an-influxdb-dbrp-mapping)
    - **User**: Leave empty
    - **Password**: Leave empty
    - **HTTP Method**: Select **GET**

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
