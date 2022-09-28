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
    - **Token**: Your InfluxDB [API token](/influxdb/v2.0/security/tokens/).
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

To query InfluxDB OSS 2.0 with InfluxQL, find your use case below, and then complete the instructions to configure Grafana:

- [Installed a new InfluxDB 2.0 instance](#installed-a-new-influxdb-20-instance)
- [Upgraded from InfluxDB 1.x to 2.0 (following the official upgrade)](#upgraded-from-influxdb-1x-to-20)
- [Manually migrated from InfluxDB 1.x to 2.0](#manually-migrated-from-influxdb-1x-to-20)

### Installed a new InfluxDB 2.0 instance
To configure Grafana to use InfluxQL with a new install of InfluxDB 2.0, do the following:

1. [Authenticate with InfluxDB 2.0 tokens](/influxdb/v2.0/security/tokens/).
2. [Manually create DBRP mappings](#view-and-create-influxdb-dbrp-mappings).

### Upgraded from InfluxDB 1.x to 2.0
To configure Grafana to use InfluxQL when you've upgraded from InfluxDB 1.x to
InfluxDB 2.0 (following an [official upgrade guide](/influxdb/v2.0/upgrade/v1-to-v2/)):

1. Authenticate using the _non-admin_ [v1 compatible authentication credentials](#view-and-create-influxdb-v1-authorizations)
   created during the upgrade process.
2. Use the DBRP mappings InfluxDB automatically created in the upgrade process (no action necessary).

### Manually migrated from InfluxDB 1.x to 2.0
To configure Grafana to use InfluxQL when you've manually migrated from InfluxDB
1.x to InfluxDB 2.0, do the following:

1. If your InfluxDB 1.x instance required authentication,
   [create v1 compatible authentication credentials](#view-and-create-influxdb-v1-authorizations)
   to match your previous 1.x username and password.
   Otherwise, use [InfluxDB v2 token authentication](/influxdb/v2.0/security/tokens/).
2. [Manually create DBRP mappings](#view-and-create-influxdb-dbrp-mappings).

{{< expand-wrapper >}}
{{% expand "View and create InfluxDB v1 authorizations" %}}

InfluxDB OSS 2.0 provides a 1.x compatible authentication API that lets you
authenticate with a username and password like InfluxDB 1.x
_(separate from the credentials used to log into the InfluxDB user interface)_.

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
{{< expand "View and create InfluxDB DBRP mappings" >}}

When using InfluxQL to query InfluxDB, the query must specify a database and a retention policy.
InfluxDB DBRP mappings associate database and retention policy combinations with
InfluxDB 2.0 [buckets](/influxdb/v2.0/reference/glossary/#bucket).

DBRP mappings do not affect the retention period of the target bucket.
These mappings allow queries following InfluxDB 1.x conventions to successfully
query InfluxDB 2.0 buckets.

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
- retention policy name _(not retention period)_
- [bucket ID](/influxdb/v2.0/organizations/buckets/view-buckets/)
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

_For more information about DBRP mapping, see [Database and retention policy mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/)._
{{< /expand >}}
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

        Under **Custom HTTP Headers**, select **Add Header**. Provide your InfluxDB API token:

        - **Header**: Enter `Authorization`
        - **Value**: Use the `Token` schema and provide your [InfluxDB API token](/influxdb/v2.0/security/tokens/).
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
If you're just learning Flux, see [Get started with Flux](/{{< latest "flux" >}}/get-started/).
