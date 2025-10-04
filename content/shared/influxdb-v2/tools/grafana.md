Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from your **InfluxDB {{< current-version >}}** instance.

{{% note %}}
The instructions in this guide require **Grafana Cloud** or **Grafana 10.3+**.
{{% /note %}}

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

    {{% note %}}
SQL is only supported in InfluxDB 3.
    {{% /note %}}

## Create an InfluxDB data source

1. In your Grafana interface, click **Connections** in the left sidebar
2. Click **Data sources**
3. Click **Add new connection**
4. Locate and click the **InfluxDB** card

   The InfluxDB configuration page displays with four numbered sections in the left sidebar.

5. **Name**: Enter a descriptive name for your data source
6. **URL**: Enter your [InfluxDB URL](/influxdb/v2/reference/urls/): http://localhost:8086

7. **Product**: From the dropdown, select **InfluxDB OSS 2.x**
8. **Query Language**: Select **Flux** or **InfluxQL**

   After selecting your query language, section 2 (Database settings) displays fields specific to your selection.

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

{{< img-hd src="/img/influxdb3/OSS-v2-grafana-product-dropdown-flux.png" alt="Flux configuration for InfluxDB OSS 2.x" />}}

Click **Save & Test**. Grafana attempts to connect to InfluxDB OSS 2.x and returns the results of the test.

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

{{< img-hd src="/img/influxdb3/OSS-v2-grafana-product-dropdown-influxql.png" alt="InfluxQL configuration for InfluxDB OSS 2.x with DBRP warning" />}}

Click **Save & Test**. Grafana attempts to connect to InfluxDB OSS 2.x and returns the results of the test.

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

{{% note %}}
**Repeat for each DBRP combination**
Each unique database and retention policy combination used by Grafana must be mapped to an InfluxDB OSS 2.x bucket.
{{% /note %}}

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

With your InfluxDB connection configured, use Grafana and Flux to query and
visualize time series data stored in your **InfluxDB** instance.

For more information about using Grafana, see the [Grafana documentation](https://grafana.com/docs/).
If you're just learning Flux, see [Get started with Flux](/flux/v0/get-started/).
