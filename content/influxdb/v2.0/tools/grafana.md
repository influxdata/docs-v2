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
  - **v2 authentication token**  
    InfluxDB OSS 2.0 [authentication token](/influxdb/v2.0/security/tokens/).
  - **v1 compatible authentication credentials**  
    InfluxDB OSS 2.0 provides a [1.x compatible authentication API](#view-and-create-influxdb-v1-authorizations)
    that let's you authenticate with a username and password like InfluxDB 1.x
    _(separate from the credentials used to log into the InfluxDB user interface)_.
- **Database and retention policy (DBRP) mappings**  
  When using InfluxQL to query InfluxDB 2.0, the query must specify a database and a retention policy.
  DBRP mappings associate database and retention policy combinations with InfluxDB 2.0 [buckets](/influxdb/v2.0/reference/glossary/#bucket).

When upgrading from InfluxDB 1.x to 2.0 using the [official upgrade process](/influxdb/v2.0/upgrade/v1-to-v2/),
InfluxDB creates v1 compatible authorizations for all _non-admin_ 1.x users and all necessary DBRP mappings.
Grafana dashboards should work against a upgraded database without change.

If you manually migrated from InfluxDB 1.x to InfluxDB 2.0 or are starting with
a fresh 2.0 installation, you **must [manually create any necessary DBRP mappings](#view-and-create-influxdb-dbrp-mappings)**.
**We recommend using token authentication** unless your Grafana configuration already
is already configured to authenticate with username and password.

{{< expand-wrapper >}}
{{% expand "View and create InfluxDB v1 authorizations" %}}
#### View existing v1 authorizations
Use the [`influx v1 auth list`](/influxdb/v2.0/reference/cli/influx/v1/auth/list/)
to list existing InfluxDB v1 compatible authorizations.

```sh
influx v1 auth list
```

#### Create a v1 authorization
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
{{% expand "View and create InfluxDB DBRP mappings" %}}
#### View existing DBRP mappings
Use the [`influx v1 dbrp list`](/influxdb/v2.0/reference/cli/influx/v1/dbrp/list/)
to list existing DBRP mappings.

```sh
influx v1 dbrp list
```

#### Create a DBRP mapping
Use the [`influx v1 dbrp create` command](/influxdb/v2.0/reference/cli/influx/v1/dbrp/create/)
command to create a DBRP mapping.
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

    - ##### Authenticate with username and password

        Under **InfluxDB Details**, do the following:

        - **Database**: Enter the database name [mapped to your InfluxDB 2.0 bucket](#view-and-create-influxdb-dbrp-mappings)
        - **User**: Enter the username associated with your [InfluxDB 1.x compatibility authorization](#view-and-create-influxdb-v1-authorizations)
        - **Password**: Enter the password associated with your [InfluxDB 1.x compatibility authorization](#view-and-create-influxdb-dbrp-mappings)
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
