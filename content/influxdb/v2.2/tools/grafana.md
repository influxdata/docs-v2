---
title: Use Grafana with InfluxDB OSS
description: >
  Use [Grafana](https://grafana.com/) to visualize data from your **InfluxDB** instance.
menu:
  influxdb_2_2:
    name: Use Grafana
    parent: Tools & integrations
weight: 104
influxdb/v2.2/tags: [grafana]
aliases:
  - /influxdb/v2.2/visualize-data/other-tools/grafana/
related:
  - https://grafana.com/docs/, Grafana documentation
  - /influxdb/v2.2/query-data/get-started/
---

Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from your **InfluxDB {{< current-version >}}** instance.

{{% note %}}
The instructions in this guide require **Grafana Cloud** or **Grafana v8.0+**.
{{% /note %}}

1. [Start InfluxDB OSS {{< current-version >}}](/influxdb/v2.2/install/#start-influxdb).
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

1.  Under **HTTP**, enter the following:

    - **URL**: Your
      {{% oss-only %}}[InfluxDB URL](/influxdb/v2.2/reference/urls/).{{% /oss-only %}}
      {{% cloud-only %}}[InfluxDB Cloud region URL](/influxdb/v2.2/reference/regions/).{{% /cloud-only %}}

        ```sh
        http://localhost:8086/
        ```
    
    - **Access**: Server (default)

2.  Under **InfluxDB Details**, enter the following:

    - **Organization**: Your InfluxDB [organization name **or** ID](/influxdb/v2.2/organizations/view-orgs/).
    - **Token**: Your InfluxDB [API token](/influxdb/v2.2/security/tokens/).
    - **Default Bucket**: The default [bucket](/influxdb/v2.2/organizations/buckets/) to use in Flux queries.
    - **Min time interval**: The [Grafana minimum time interval](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/#min-time-interval).
      Default is `10s`
    - **Max series**: The maximum number of series or tables Grafana will process.
      Default is `1000`.

3.  Click **Save & Test**. Grafana attempts to connect to the InfluxDB {{< current-version >}}
    datasource and returns the results of the test.

{{% cloud-only %}}
  {{< img-hd src="/img/influxdb/cloud-tools-grafana.png" alt="Use Grafana with InfluxDB Cloud and Flux" />}}
{{% /cloud-only %}}

{{< oss-only >}}
  {{< img-hd src="/img/influxdb/2-2-tools-grafana.png" alt="Use Grafana with InfluxDB and Flux" />}}
{{< /oss-only >}}

{{% /tab-content %}}
<!----------------------------- END FLUX CONTENT ----------------------------->
<!-------------------------- BEGIN INFLUXQL CONTENT -------------------------->
{{% tab-content %}}

## Configure Grafana to use InfluxQL

<!---------------------------------------------------------------------------->
<!------------------------- BEGIN OSS InfluxQL setup ------------------------->
<!---------------------------------------------------------------------------->
{{% oss-only %}}

To query InfluxDB {{< current-version >}} with InfluxQL, find your use case below,
and then complete the instructions to configure Grafana:

- [Installed a new InfluxDB {{< current-version >}} instance](#installed-a-new-influxdb-instance)
- [Upgraded from InfluxDB 1.x to {{< current-version >}} (following the official upgrade)](#upgraded-from-influxdb-1x-to-2x)
- [Manually migrated from InfluxDB 1.x to {{< current-version >}}](#manually-migrated-from-influxdb-1x-to-2x)

### Installed a new InfluxDB instance
To configure Grafana to use InfluxQL with a new install of InfluxDB {{< current-version >}}, do the following:

1. [Authenticate with InfluxDB {{< current-version >}} tokens](/influxdb/v2.2/security/tokens/).
2. [Manually create DBRP mappings](#view-and-create-influxdb-dbrp-mappings).

### Upgraded from InfluxDB 1.x to 2.x
To configure Grafana to use InfluxQL when you've upgraded from InfluxDB 1.x to
InfluxDB {{< current-version >}} (following an [official upgrade guide](/influxdb/v2.2/upgrade/v1-to-v2/)):

1. Authenticate using the _non-admin_ [v1 compatible authentication credentials](#view-and-create-influxdb-v1-authorizations)
   created during the upgrade process.
2. Use the DBRP mappings InfluxDB automatically created in the upgrade process (no action necessary).

### Manually migrated from InfluxDB 1.x to 2.x
To configure Grafana to use InfluxQL when you've manually migrated from InfluxDB
1.x to InfluxDB {{< current-version >}}, do the following:

1. If your InfluxDB 1.x instance required authentication,
   [create v1 compatible authentication credentials](#view-and-create-influxdb-v1-authorizations)
   to match your previous 1.x username and password.
   Otherwise, use [InfluxDB v2 token authentication](/influxdb/v2.2/security/tokens/).
2. [Manually create DBRP mappings](#view-and-create-influxdb-dbrp-mappings).

{{< expand-wrapper >}}
{{% expand "View and create InfluxDB v1 authorizations" %}}

InfluxDB {{< current-version >}} provides a 1.x compatible authentication API that lets you
authenticate with a username and password like InfluxDB 1.x
_(separate from the credentials used to log into the InfluxDB user interface)_.

#### View existing v1 authorizations
Use the [`influx v1 auth list`](/influxdb/v2.2/reference/cli/influx/v1/auth/list/)
to list existing InfluxDB v1 compatible authorizations.

```sh
influx v1 auth list
```

#### Create a v1 authorization
Use the [`influx v1 auth create` command](/influxdb/v2.2/reference/cli/influx/v1/auth/create/)
to grant read/write permissions to specific buckets. Provide the following:

- [bucket IDs](/influxdb/v2.2/organizations/buckets/view-buckets/) to grant read
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
InfluxDB {{< current-version >}} [buckets](/influxdb/v2.2/reference/glossary/#bucket).

DBRP mappings do not affect the retention period of the target bucket.
These mappings allow queries following InfluxDB 1.x conventions to successfully
query InfluxDB {{< current-version >}} buckets.

#### View existing DBRP mappings
Use the [`influx v1 dbrp list`](/influxdb/v2.2/reference/cli/influx/v1/dbrp/list/)
to list existing DBRP mappings.

```sh
influx v1 dbrp list
```

#### Create a DBRP mapping
Use the [`influx v1 dbrp create` command](/influxdb/v2.2/reference/cli/influx/v1/dbrp/create/)
command to create a DBRP mapping.
Provide the following:

- database name
- retention policy name _(not retention period)_
- [bucket ID](/influxdb/v2.2/organizations/buckets/view-buckets/)
- _(optional)_ `--default` flag if you want the retention policy to be the default retention
  policy for the specified database

```sh
influx v1 dbrp create \
  --db example-db \
  --rp example-rp \
  --bucket-id 00xX00o0X001 \
  --default
```

{{% note %}}
#### Repeat for each DBRP combination
Each unique database and retention policy combination used by Grafana must be
mapped to an InfluxDB {{< current-version >}} bucket.
If you have multiple retention policies for a single bucket, set one of the the
retention polices as the default using the `--default` flag.
{{% /note %}}

_For more information about DBRP mapping, see [Database and retention policy mapping](/influxdb/v2.2/reference/api/influxdb-1x/dbrp/)._

{{< /expand >}}
{{< /expand-wrapper >}}

{{% /oss-only %}}
<!---------------------------------------------------------------------------->
<!-------------------------- END OSS InfluxQL setup -------------------------->
<!---------------------------------------------------------------------------->

<!---------------------------------------------------------------------------->
<!------------------------ BEGIN Cloud InfluxQL setup ------------------------>
<!---------------------------------------------------------------------------->
{{% cloud-only el="div" %}}

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
- [retention policy](/influxdb/v1.8/concepts/glossary/#retention-policy-rp) name _(not retention period)_
- [bucket ID](/influxdb/cloud/organizations/buckets/view-buckets/)
- _(optional)_ `--default` flag if you want the retention policy to be the default retention
  policy for the specified database

```sh
influx v1 dbrp create \
  --db example-db \
  --rp example-rp \
  --bucket-id 00xX00o0X001 \
  --default
```

{{% note %}}
#### Repeat for each DBRP combination
Each unique database and retention policy combination used by Grafana must be
mapped to an InfluxDB {{< current-version >}} bucket.
If you have multiple retention policies for a single bucket, set one of the the
retention polices as the default using the `--default` flag.
{{% /note %}}

_For more information about DBRP mapping, see [Database and retention policy mapping](/influxdb/cloud/reference/api/influxdb-1x/dbrp/)._

{{% /cloud-only %}}
<!---------------------------------------------------------------------------->
<!------------------------- END Cloud InfluxQL setup ------------------------->
<!---------------------------------------------------------------------------->


### Configure your InfluxDB connection
With **InfluxQL** selected as the query language in your InfluxDB data source settings:

1. Under **HTTP**, enter the following:

    - **URL**: Your [InfluxDB URL](/influxdb/v2.2/reference/urls/).

        ```sh
        http://localhost:8086/
        ```
    - **Access**: Server (default)

2. Configure InfluxDB authentication:

    - ##### Token authentication

        - Under **Custom HTTP Headers**, select **{{< icon "plus" >}}Add Header**. Provide your InfluxDB API token:

          - **Header**: Enter `Authorization`
          - **Value**: Use the `Token` schema and provide your [InfluxDB API token](/influxdb/v2.2/security/tokens/).
            For example:

            ```
            Token y0uR5uP3rSecr3tT0k3n
            ```
        
        - Under **InfluxDB Details**, do the following:

          - **Database**: Enter the database name [mapped to your InfluxDB {{< current-version >}} bucket](#view-and-create-influxdb-dbrp-mappings)
          - **HTTP Method**: Select **GET**

    - ##### Authenticate with username and password

        Under **InfluxDB Details**, do the following:

        - **Database**: Enter the database name [mapped to your InfluxDB {{< current-version >}} bucket](#view-and-create-influxdb-dbrp-mappings)
        - **User**: Enter the username associated with your [InfluxDB 1.x compatibility authorization](#view-and-create-influxdb-v1-authorizations)
        - **Password**: Enter the password associated with your [InfluxDB 1.x compatibility authorization](#view-and-create-influxdb-dbrp-mappings)
        - **HTTP Method**: Select **GET**

3. Click **Save & Test**. Grafana attempts to connect to the InfluxDB {{< current-version >}} data source
   and returns the results of the test.

{{% cloud-only %}}
  {{< img-hd src="/img/influxdb/cloud-tools-grafana-influxql.png" alt="Use Grafana with InfluxDB Cloud and Flux" />}}
{{% /cloud-only %}}

{{< oss-only >}}
  {{< img-hd src="/img/influxdb/2-2-tools-grafana-influxql.png" alt="Use Grafana with InfluxDB and Flux" />}}
{{< /oss-only >}}

{{% /tab-content %}}
<!--------------------------- END INFLUXQL CONTENT --------------------------->
{{< /tabs-wrapper >}}

## Query and visualize data

With your InfluxDB connection configured, use Grafana and Flux to query and
visualize time series data stored in your **InfluxDB** instance.

For more information about using Grafana, see the [Grafana documentation](https://grafana.com/docs/).
If you're just learning Flux, see [Get started with Flux](/{{< latest "flux" >}}/get-started/).
