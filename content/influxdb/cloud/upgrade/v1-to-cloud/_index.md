---
title: Upgrade from InfluxDB 1.x to InfluxDB Cloud
description: >
  To upgrade from InfluxDB 1.x to InfluxDB Cloud, migrate data, and then create
  database and retention policy (DBRP) mappings.
menu:
  influxdb_cloud:
    parent: Upgrade to Cloud
    name: 1.x to Cloud
weight: 11
related:
  - /influxdb/cloud/upgrade/v1-to-cloud/migrate-cqs/
---

To upgrade from **InfluxDB OSS 1.x** to **InfluxDB Cloud**:

1. [Create an InfluxDB Cloud account](#create-an-influxdb-cloud-account)
2. [Create an All-Access authentication token](#create-an-all-access-authentication-token)
3. [Download and install the `influx` CLI](#download-and-install-the-influx-cli)
4. [Create DBRP mappings](#create-dbrp-mappings)
5. [Dual write to InfluxDB 1.x and InfluxDB Cloud](#dual-write-to-influxdb-1x-and-influxdb-cloud)
6. [Migrate time series data](#migrate-time-series-data)
7. [Migrate continuous queries](#migrate-continuous-queries)
8. [Collaborate with other users](#collaborate-with-other-users)

## Create an InfluxDB Cloud account
Do one of the following to create an InfluxDB Cloud account:

- [Subscribe through InfluxData](/influxdb/cloud/get-started/#subscribe-through-influxdata) and
  [start for free](/influxdb/cloud/get-started/#start-for-free).
- [Subscribe through your cloud provider](/influxdb/cloud/get-started/#subscribe-through-a-cloud-provider).

## Create an All-Access authentication token
InfluxDB Cloud {{% cloud-token-auth %}}
Create an **All-Access** token in your InfluxDB Cloud user interface (UI) to use
for the upgrade process.

1. Click **Data (Load Data) > Tokens** in the left navigation bar.

    {{< nav-icon "data" >}}
2. Click **{{< icon "plus" >}} Generate**, and then select **All-Access Token**.
3. Enter a description for the token, and then click **{{< icon "check" >}} Save**.

_For more information about managing tokens and token types, see [Manage tokens](/influxdb/cloud/security/tokens/)._

## Download and install the influx CLI
1.  Visit the [InfluxDB downloads page](https://portal.influxdata.com/downloads/)
    and download the **InfluxDB Cloud CLI** (`influx`).
2.  Place the `influx` binary in your system `PATH` or execute the CLI commands from
    the directory where the `influx` CLI exists.

3. [Create a CLI connection configuration](/influxdb/cloud/reference/cli/influx/#provide-required-authentication-credentials)
    for your InfluxDB Cloud account.
      Include the following flags:

    - **-\-config-name**:
      Unique name for the connection configuration.
    - **-\-host-url**:
      [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/).
    - **-\-org**:
      InfluxDB Cloud organization name.
      The default organization name is the email address associated with your account.
    - **-\-token**:
      InfluxDB Cloud **All-Access** token.

    ```sh
    influx config create \
      --config-name cloud \
      --host-url https://cloud2.influxdata.com \
      --org your.email@example.com \
      --token mY5uP3rS3cRe7Cl0uDt0K3n \
      --active
    ```

{{% note %}}
#### Required InfluxDB Cloud credentials
All `influx` CLI examples below assume the required InfluxDB Cloud **host**,
**organization**, and **authentication token** credentials are provided by your
[`influx` CLI configuration](/influxdb/cloud/reference/cli/influx/#provide-required-authentication-credentials).
{{% /note %}}

## Create DBRP mappings
InfluxDB database and retention policy (DBRP) mappings associate database and
retention policy combinations with InfluxDB cloud [buckets](/influxdb/cloud/reference/glossary/#bucket).
These mappings allow InfluxDB 1.x clients to query and write to
InfluxDB Cloud buckets while using the 1.x DBRP convention.

_For more information about DBRP mapping, see
[Database and retention policy mapping](/influxdb/cloud/reference/api/influxdb-1x/dbrp/)._

**To map a DBRP combination to an InfluxDB Cloud bucket**

1.  **Create a bucket**  
    [Create an InfluxDB Cloud bucket](/influxdb/cloud/organizations/buckets/create-bucket/).
    We recommend creating a bucket for each unique 1.x database and retention
    policy combination using the following naming convention:

    ```sh
    # Naming convention
    db-name/rp-name

    # Example
    telegraf/autogen
    ```

2.  **Create a DBRP mapping**  
    Use the [`influx v1 dbrp create` command](/influxdb/cloud/reference/cli/influx/v1/dbrp/create/)
    to create a DBRP mapping.
    Provide the following:

    - database name
    - retention policy name _(not retention period)_
    - [bucket ID](/influxdb/cloud/organizations/buckets/view-buckets/)
    - _(optional)_ `--default` flag if you want the retention policy to be the default retention
      policy for the specified database

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[DB with one RP](#)
[DB with multiple RPs](#)
    {{% /code-tabs %}}
    {{% code-tab-content %}}
```sh
influx v1 dbrp create \
  --db example-db \
  --rp example-rp \
  --bucket-id 00xX00o0X001 \
  --default
```
    {{% /code-tab-content %}}
    {{% code-tab-content %}}
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
    {{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}
    {{% caption %}}
See [Required InfluxDB Cloud credentials](#required-influxdb-cloud-credentials)
    {{% /caption %}}

## Dual write to InfluxDB 1.x and InfluxDB Cloud
Update external clients to write to your InfluxDB Cloud instance.
**We recommend writing data to both InfluxDB 1.x and InfluxDB Cloud until you
finish [migrating your existing time series data](#migrate-time-series-data)**.

Configure external clients with your InfluxDB Cloud **host**, **organization**,
and **authentication token**.

### Update Telegraf configurations
If using Telegraf to collect and write metrics to InfluxDB 1.x, update your
Telegraf configuration to write to both InfluxDB 1.x and InfluxDB Cloud:

1.  Update your Telegraf configuration with a `influxdb_v2` output to write to
    your InfluxDB Cloud instance.

    ##### Example dual-write Telegraf configuration
    ```toml
    # Write metrics to InfluxDB 1.x
    [[outputs.influxdb]]
      urls = ["https://localhost:8086"]
      database = "example-db"
      retention_policy = "example-rp"

    # Write metrics to InfluxDB Cloud
    [[outputs.influxdb_v2]]
      urls = ["https://cloud2.influxdata.com"]
      token = "$INFLUX_TOKEN"
      organization = "your.email@example.com"
      bucket = "example-db/example-rp"
    ```

2.  Add the `INFLUX_TOKEN` environment variable to your Telegraf environment(s)
    and set the value to your InfluxDB Cloud authentication token.

3.  Restart Telegraf with the updated configuration and begin writing to both
    InfluxDB 1.x and InfluxDB Cloud.

## Migrate time series data
To migrate time series data from your InfluxDB 1.x instance to InfluxDB Cloud:

1. Use the **InfluxDB 1.x** [`influx_inspect export` command](/{{< latest "influxdb" "v1" >}}/tools/influx_inspect/#export)
   to export time series data as line protocol.
   Include the `-lponly` flag to exclude comments and the data definition
   language (DDL) from the output file.

   _We recommend exporting each DBRP combination separately to easily write data
   to a corresponding InfluxDB Cloud bucket._

    ```sh
    # Syntax
    influx_inspect export \
      -database <database-name> \
      -retention <retention-policy-name> \
      -out <output-file-path> \
      -lponly

    # Example
    influx_inspect export \
      -database example-db \
      -retention example-rp \
      -out /path/to/example-db_example-rp.lp \
      -lponly
    ```

2. Use the **InfluxDB Cloud** [`influx write` command](/influxdb/cloud/reference/cli/influx/write/)
   to write the exported line protocol to InfluxDB Cloud.

    ```sh
    # Syntax
    influx write \
      --bucket <bucket-name> \
      --file <path-to-line-protocol-file>

    # Example
    influx write \
      --bucket example-db/example-rp \
      --file /path/to/example-db_example-rp.lp
    ```
    {{% caption %}}
See [Required InfluxDB Cloud credentials](#required-influxdb-cloud-credentials)
    {{% /caption %}}

3. Repeat steps 1-2 for each bucket.

{{% note %}}
#### InfluxDB Cloud write rate limits
Write requests are subject to rate limits associated with your
[InfluxDB Cloud pricing plan](/influxdb/cloud/account-management/pricing-plans/).
If your exported line protocol size potentially exceeds your rate limits,
include the `--rate-limit` flag with `influx write` to rate limit written data.

```sh
influx write \
  --bucket example-bucket \
  --file /path/to/example-db_example-rp.lp \
  --rate-limit "5 MB / 5 min"
```
{{% caption %}}
See [Required InfluxDB Cloud credentials](#required-influxdb-cloud-credentials)
{{% /caption %}}

To minimize network bandwidth usage, we recommend using gzip to compress exported line protocol.
However, when writing to InfluxDB Cloud, **Data In** and **Ingest batch size**
rate limits track the payload size of the **uncompressed** line protocol.
{{% /note %}}

## Migrate continuous queries
For information about migrating InfluxDB 1.x continuous queries to InfluxDB Cloud tasks,
see [Migrate continuous queries to tasks](/influxdb/cloud/upgrade/v1-to-cloud/migrate-cqs/).

## Collaborate with other users
To collaborate with other users in your InfluxDB Cloud organization,
[invite users to join your organization](/influxdb/cloud/account-management/multi-user/invite-user/).
