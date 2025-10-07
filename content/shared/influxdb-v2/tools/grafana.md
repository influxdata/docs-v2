Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from your **InfluxDB {{< current-version >}}** instance.

> [!Note]
> {{< influxdb-version-detector >}}

> [!Note]
> The instructions in this guide require **Grafana Cloud** or **Grafana 10.3+**.

- [Install Grafana](#install-grafana)
- [Create an InfluxDB data source](#create-an-influxdb-data-source)
- [Query and visualize data](#query-and-visualize-data)

## Install Grafana

1. [Start InfluxDB OSS 2.x](/influxdb/v2/install/#configure-and-start-influxdb).
2. [Sign up for Grafana Cloud](https://grafana.com/products/cloud/) or
   [download and install Grafana](https://grafana.com/grafana/download).
3. Visit your **Grafana Cloud user interface** (UI) or, if running Grafana locally,
   [start Grafana](https://grafana.com/docs/grafana/latest/installation/) and visit
   <http://localhost:3000> in your browser.

{{% show-in "v2" %}}
> [!Note]
> #### Using Grafana Cloud with a local InfluxDB instance
>
> If you need to keep your database local, consider running Grafana locally instead of using Grafana Cloud,
> as this avoids the need to expose your database to the internet.
>
> To use InfluxDB running on your private network with Grafana Cloud, you must
> [configure a private data source](https://grafana.com/docs/grafana-cloud/data-sources/private-data-sources/).
> See the Grafana documentation for instructions on configuring a Grafana Cloud private data source
> with {{% product-name %}} running on `http://localhost:8086`.
{{% /show-in %}}

> [!Note]
> SQL is only supported in InfluxDB 3.
> {{% show-in "v2" %}}For more information, see how to [get-started with InfluxDB 3 Core](/influxdb3/core/get-started/).{{% /show-in %}}{{% show-in "cloud" %}}For more information, see how to upgrade to [InfluxDB Cloud Serverless](/influxdb/cloud/upgrade/v2-to-cloud/).{{% /show-in %}}

## Quick reference

| Configuration | Value |
|:------------- |:----- |
| **Product selection** | {{% show-in "v2" %}}**InfluxDB OSS 2.x**{{% /show-in %}}{{% show-in "cloud" %}}**InfluxDB Cloud (TSM)**{{% /show-in %}} |
| **URL** | {{% show-in "v2" %}}[Server URL](/influxdb/v2/reference/urls/)--for example, `https://{{< influxdb/host >}}`{{% /show-in %}}{{% show-in "cloud" %}}[Region URL](/influxdb/cloud/reference/regions/)--for example, `https://us-east-2-1.aws.cloud2.influxdata.com`{{% /show-in %}} |
| **Query languages** | Flux, InfluxQL |
| **Authentication** | API token or v1 username/password |
| **Organization** | Organization name or ID (Flux only) |
| **Default Bucket** | Default bucket for Flux queries (Flux only) |
| **Database** | Database name mapped to bucket (InfluxQL only) |

## Create an InfluxDB data source

1. In your Grafana interface, click **Connections** in the left sidebar
2. Click **Data sources**
3. Click **Add new connection**
4. Search for and select **InfluxDB**. The InfluxDB data source configuration page displays.
5. In the **Settings** tab, configure the following:

   - **Name**: A descriptive name for your data source
   - **URL**: Your {{% show-in "v2" %}}[server URL](/influxdb/v2/reference/urls/)--for example, `https://{{< influxdb/host >}}`{{% /show-in %}}{{% show-in "cloud" %}}[region URL](/influxdb/cloud/reference/regions/)--for example, `https://us-east-2-1.aws.cloud2.influxdata.com`{{% /show-in %}}
   - **Product**: From the dropdown, select {{% show-in "v2" %}}**InfluxDB OSS 2.x**{{% /show-in %}}{{% show-in "cloud" %}}**InfluxDB Cloud (TSM)**{{% /show-in %}}
   - **Query Language**: Select **Flux** or **InfluxQL**

### Configure database settings

The fields in this section change based on your query language selection.

{{< tabs-wrapper >}}
{{% tabs %}}
[Flux](#)                 
[InfluxQL](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------- BEGIN FLUX --------------------------------->

## Configure Grafana to use Flux

When you select **Flux** as the query language, configure the following:

- **Organization**: Your InfluxDB [organization name or ID](/influxdb/v2/admin/organizations/view-orgs/)
- **Default Bucket**: The default [bucket](/influxdb/v2/admin/buckets/) to use in Flux queries
- **Token**: Your InfluxDB [API token](/influxdb/v2/admin/tokens/)

{{% show-in "v2" %}}{{< img-hd src="/img/influxdb/OSS-v2-grafana-product-dropdown-flux.png" alt="Flux configuration for InfluxDB OSS 2.x" />}}{{% /show-in %}}
{{% show-in "cloud" %}}{{< img-hd src="/img/influxdb/influxdb-v2-cloud-flux.png" alt="Flux configuration for InfluxDB Cloud (TSM)" />}}{{% /show-in %}}

Click **Save & Test**. Grafana attempts to connect to {{% show-in "v2" %}}InfluxDB OSS 2.x{{% /show-in %}}{{% show-in "cloud" %}}InfluxDB Cloud{{% /show-in %}} and returns the results of the test.

<!---------------------------------- END FLUX ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXQL ------------------------------>

## Configure Grafana to use InfluxQL

> [!Important]
> #### DBRP mapping required
>
> To query InfluxDB OSS 2.x with InfluxQL, you must first create Database and Retention Policy (DBRP) mappings.
> The configuration form displays a warning if DBRP mapping is required.

When you select **InfluxQL** as the query language, you can authenticate using either tokens or username/password credentials.

### Token authentication (recommended)

Configure the following fields:

- **Database**: The database name [mapped to your InfluxDB bucket](#create-dbrp-mappings)
- **User**: Enter any string (this field is required by the form)
- **Password**: Your InfluxDB [API token](/influxdb/v2/admin/tokens/)

### Username and password authentication

Configure the following fields:

- **Database**: The database name [mapped to your InfluxDB bucket](#create-dbrp-mappings)
- **User**: Your [v1 authorization username](#create-v1-authorizations)
- **Password**: Your [v1 authorization password](#create-v1-authorizations)

{{% show-in "v2" %}}{{< img-hd src="/img/influxdb/OSS-v2-grafana-product-dropdown-influxql.png" alt="InfluxQL configuration for InfluxDB OSS 2.x with DBRP warning" />}}{{% /show-in %}}
{{% show-in "cloud" %}}{{< img-hd src="/img/influxdb/influxdb-v2-cloud-influxql.png" alt="InfluxQL configuration for InfluxDB Cloud (TSM) with v1 auth" />}}{{% /show-in %}}

Click **Save & Test**. Grafana attempts to connect to {{% show-in "v2" %}}InfluxDB OSS 2.x{{% /show-in %}}{{% show-in "cloud" %}}InfluxDB Cloud{{% /show-in %}} and returns the results of the test.

### Create DBRP mappings

When using InfluxQL to query InfluxDB, the query must specify a database and retention policy.
InfluxDB DBRP mappings associate database and retention policy combinations with InfluxDB OSS 2.x buckets.

#### View existing DBRP mappings

Use the [`influx v1 dbrp list`](/influxdb/v2/reference/cli/influx/v1/dbrp/list/) command:
```sh
influx v1 dbrp list
```

### Create a DBRP mappings

Use the influx v1 dbrp create command:
```sh
influx v1 dbrp create \
  --db example-db \
  --rp example-rp \
  --bucket-id 00xX00o0X001 \
  --default
```
  
Provide:

- `--db:` Database name
- `--rp:` Retention policy name (not retention period)
- `--bucket-id:` Bucket ID
- `--default:` (Optional) Make this the default retention policy for the database

> [!Note]
> **Repeat for each DBRP combination**
> Each unique database and retention policy combination used by Grafana must be mapped to an InfluxDB OSS 2.x bucket.

For more information, see [Database and retention policy mapping](/influxdb/v2/api-guide/influxdb-1x/dbrp/).

### Create v1 authorizations

InfluxDB OSS 2.x provides a v1-compatible authentication API for username/password authentication.

#### View existing v1 authorizations

Use the [`influx v1 auth list`](/influxdb/v2/reference/cli/influx/v1/auth/list/) command:
```sh
influx v1 auth list
```

#### Create a v1 authorization

Use the [`influx v1 auth create`](/influxdb/v2/reference/cli/influx/v1/auth/create/) command:
```sh
influx v1 auth create \
  --read-bucket 00xX00o0X001 \
  --write-bucket 00xX00o0X001 \
  --username example-user
```

Provide:

- `--read-bucket`: Bucket ID to grant read permissions
- `--write-bucket`: Bucket ID to grant write permissions
- `--username`: New username

You'll be prompted to enter a password.
<!-------------------------------- END INFLUXQL ------------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Query and visualize data

With your InfluxDB connection configured, use Grafana to query and visualize time series data.

### Query inspection in Grafana 

To learn about query management and inspection in Grafana, see the
[Grafana Explore documentation](https://grafana.com/docs/grafana/latest/explore/).

### Build visualizations with Grafana

For a comprehensive walk-through of creating visualizations with
Grafana, see the [Grafana documentation](https://grafana.com/docs/grafana/latest/).
