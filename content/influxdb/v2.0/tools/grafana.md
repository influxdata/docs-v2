---
title: Use Grafana with InfluxDB OSS
description: >
  Use [Grafana](https://grafana.com/) to visualize data from your **InfluxDB** instance.
menu:
  influxdb_2_0:
    name: Use Grafana
    parent: Tools & integrations
weight: 104
influxdb/v2.0/tags: [grafana]
aliases:
  - /influxdb/v2.0/visualize-data/other-tools/grafana/
related:
  - https://grafana.com/docs/, Grafana documentation
  - /influxdb/v2.0/query-data/get-started/
---

Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from your **InfluxDB** instance.

{{% note %}}
The instructions in this guide require **Grafana Cloud** or **Grafana v7.1+**.
{{% /note %}}

1. [Start InfluxDB OSS 2.0](/influxdb/v2.0/get-started/).
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
{{% tab-content %}}
## Configure Grafana to use Flux

With **Flux** selected as the query language in your InfluxDB data source,
configure your InfluxDB connection:

1. Under **Connection**, enter the following:

    - **URL**: Your [InfluxDB URL](/influxdb/v2.0/reference/urls/).

        ```sh
        http://localhost:8086/
        ```

    - **Organization**: Your InfluxDB [organization name **or** ID](/influxdb/v2.0/organizations/view-orgs/).
    - **Token**: Your InfluxDB [authentication token](/influxdb/v2.0/security/tokens/).
    - **Default Bucket**: The default [bucket](/influxdb/v2.0/organizations/buckets/) to use in Flux queries.
    - **Min time interval**: The [Grafana minimum time interval](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/#min-time-interval).

    {{< img-hd src="/img/influxdb/2-0-tools-grafana.png" />}}

2. Click **Save & Test**. Grafana attempts to connect to the InfluxDB 2.0 datasource
   and returns the results of the test.
{{% /tab-content %}}
<!----------------------------- END FLUX CONTENT ----------------------------->
<!-------------------------- BEGIN INFLUXQL CONTENT -------------------------->
{{% tab-content %}}
## Configure Grafana to use InfluxQL

1. [Set up InfluxDB compatibility](#set-up-influxdb-compatibility)
2. [Configure your InfluxDB connection](#configure-your-influxdb-connection)

### Set up InfluxDB compatibility
To query InfluxDB OSS 2.0 with InfluxQL, the following must exist:

- **Valid authentication credentials** (either of the following)
  - v1 compatible authentication credentials
  - v2 authentication token
- **Database and retention policy (DBRP) mappings**

Did you migrate from InfluxDB 1.x to 2.0 using the [official migration process](/influxdb/v2.0/upgrade/v1-to-v2/)?
  - Did you have authentication enabled on InfluxDB 1.x before migrating?
    - Yes: Use the same _non-admin_ username and password you used with your InfluxDB 1.x instance.
    - No: Create a new  

Are you using Grafana with a fresh InfluxDB OSS 2.0 instance?
  - Use token authentication and manually create DBRP mappings.
  -

if you have been using Grafana with InfluxDB 1.x and have upgraded to InfluxDB 2.x and want to continue using InfluxQL so your dashboards continue to work....you need to ensure two things have happened:

in the upgrade process: the appropriate DBRP mappings were created AND
the username/password that you previously used are present in the v1 auth setup....
If you didn't upgrade, but are starting from scratch and simply redirecting new data to a new InfluxDB v2.... you'll still need to check these things.

Second, you can also use the native 2.0 token-based authentication scheme.

{{< expand-wrapper >}}
{{% expand "Create an InfluxDB v1 authorization" %}}

{{% note %}}
Setting up an InfluxDB v1 authorization is only required if you need to authenticate
with InfluxDB OSS 2.0 using a username and password.
You can also use [use token authentication](#) to authenticate with InfluxDB.
{{% /note %}}

Use the [`influx v1 auth create` command](/influxdb/v2.0/reference/cli/influx/v1/auth/create/)
to grant read/write permissions to specific buckets. Provide the following:

- [bucket IDs](/influxdb/v2.0/organizations/buckets/view-buckets/) to grant read
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
{{% /expand %}}
{{% expand "Create an InfluxDB DBRP mapping" %}}

When using InfluxQL to query InfluxDB 2.0, the query must specify a database and a retention policy.
Use the [`influx v1 dbrp create` command](/influxdb/v2.0/reference/cli/influx/v1/dbrp/create/)
command to create a database/retention policy (DBRP) mapping that maps a database
and retention policy combination to an InfluxDB 2.0 [bucket](/influxdb/v2.0/reference/glossary/#bucket).
Provide the following:

- database name
- retention policy
- [bucket ID](/influxdb/v2.0/organizations/buckets/view-buckets/)

```sh
influx v1 dbrp create \
  --db example-db \
  --rp example-rp \
  --bucket-id 00xX00o0X001 \
  --default
```

_For more information about DBRP mapping, see [Database and retention policy mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/)._
{{% /expand %}}
{{< /expand-wrapper >}}

### Configure your InfluxDB connection
With **InfluxQL** selected as the query language in your InfluxDB data source settings:

1. Under **HTTP**, enter the following:

    - **URL**: Your [InfluxDB URL](/influxdb/v2.0/reference/urls/).

        ```sh
        http://localhost:8086/
        ```
    - **Access**: Server (default)

2. Configure InfluxDB authentication:

    - ##### Token authentication

      Under **Custom HTTP Headers**, select **Add Header**. Provide your InfluxDB Cloud authentication token:

      - **Header**: Enter `Authorization`
      - **Value**: Use the `Token` schema and provide your [InfluxDB authentication token](/influxdb/v2.0/security/tokens/).
        For example:

        ```
        Token y0uR5uP3rSecr3tT0k3n
        ```

    - ##### Authenicate with username and password

        Under **InfluxDB Details**, do the following:

        - **Database**: Enter the database name [mapped to your InfluxDB 2.0 bucket](#create-an-influxdb-dbrp-mapping)
        - **User**: Enter the username associated with your [InfluxDB 1.x compatibility authorization](#create-an-influxdb-v1-authorization)
        - **Password**: Enter the password associated with your [InfluxDB 1.x compatibility authorization](#create-an-influxdb-v1-authorization)
        - **HTTP Method**: Select **GET**

        <!--  -->
        {{< img-hd src="/img/influxdb/2-0-tools-grafana-influxql.png" />}}

3. Click **Save & Test**. Grafana attempts to connect to the InfluxDB 2.0 data source
   and returns the results of the test.
{{% /tab-content %}}
<!--------------------------- END INFLUXQL CONTENT --------------------------->
{{< /tabs-wrapper >}}

## Query and visualize data

With your InfluxDB connection configured, use Grafana and Flux to query and
visualize time series data stored in your **InfluxDB** instance.

For more information about using Grafana, see the [Grafana documentation](https://grafana.com/docs/).
If you're just learning Flux, see [Get started with Flux](/influxdb/v2.0/query-data/get-started/).
