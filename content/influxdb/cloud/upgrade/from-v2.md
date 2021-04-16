---
title: Upgrade from InfluxDB OSS 2.x to InfluxDB Cloud
description: >
  To upgrade from Influx 2.x to InfluxDB Cloud, create a new InfluxDB Cloud account,
  migrate resources, time series data, and more.
menu:
  influxdb_cloud:
    name: 2.x to Cloud
    parent: Upgrade to Cloud
weight: 11
---

To upgrade from **InfluxDB OSS 2.x** to **InfluxDB Cloud**:

1. [Create an InfluxDB Cloud account](#create-an-influxdb-cloud-account)
2. [Create an All-Access authentication token](#create-an-all-access-authentication-token)
3. [Set up influx CLI connection configurations](#set-up-influx-cli-connection-configurations)
4. [Use templates to migrate InfluxDB resources](#use-templates-to-migrate-influxdb-resources)
5. [Migrate DBRP mappings](#migrate-dbrp-mappings)
6. [Dual write to InfluxDB 2.x and InfluxDB Cloud](#dual-write-to-influxdb-2x-and-influxdb-cloud)
7. [Migrate time series data](#migrate-time-series-data)
8. [Collaborate with other users](#collaborate-with-other-users)

{{% note %}}
#### Consider when upgrading
- InfluxDB Cloud requires token authentication, and you must create all new authentication tokens.
- InfluxDB Cloud does not support:
  - Multiple [organizations](http://localhost:1313/influxdb/cloud/reference/glossary/#organization) per account.
    Upgrade a single InfluxDB OSS 2.x organization to an InfluxDB Cloud organization.
    To upgrade multiple organizations, create a separate InfluxDB Cloud account for each organization.
  - [InfluxDB scrapers](/{{< latest "influxdb" >}}/write-data/no-code/scrape-data/).
    To scrape Prometheus-formatted metrics, use the [Telegraf Prometheus input plugin](/{{< latest "telegraf" >}}/plugins/#prometheus).
  - [1.x compatible authorizations](/{{< latest "influxdb" >}}/reference/api/influxdb-1x/#authentication).
{{% /note %}}

## Create an InfluxDB Cloud account
To upgrade to InfluxDB Cloud, do one of the following to create an account:

- [Subscribe through InfluxData](/influxdb/cloud/get-started/#subscribe-through-influxdata) and
  [start for free](/influxdb/cloud/get-started/#start-for-free).
- [Subscribe through your cloud provider](/influxdb/cloud/get-started/#subscribe-through-a-cloud-provider).

## Create an All-Access authentication token
InfluxDB authentication tokens are unique to each organization.
Create an **All-Access** token in your InfluxDB Cloud user interface (UI) to use
for the upgrade process.

1. Click **Data (Load Data) > Tokens** in the left navigation bar.

    {{< nav-icon "data" >}}
2. Click **{{< icon "plus" >}} Generate**, and then select **All-Access Token**.
3. Enter a description for the token, and then click **{{< icon "check" >}} Save**.

{{% note %}}
If you've created other tokens in your InfluxDB 2.x instance for external libraries or
integrations, create corresponding tokens for each in your InfluxDB Cloud instance.
You cannot migrate tokens from InfluxDB 2.x to InfluxDB Cloud.
{{% /note %}}

_For more information about managing tokens and token types, see [Manage tokens](/influxdb/cloud/security/tokens/)._

## Set up influx CLI connection configurations
The `influx` command line interface (CLI) lets you create connection configurations
that automatically provides **host**, **organization**, and **authentication token**
credentials to CLI commands.
Use the `influx` CLI packaged with InfluxDB 2.x and the
[`influx config create` command](/influxdb/cloud/reference/cli/influx/config/create/)
to set up the connection configurations for both your InfluxDB Cloud instance and
your InfluxDB 2.x instance.

Include the following flags for each configuration:

- **-\-config-name**:
  Unique name for the connection configuration.
  The examples below use `cloud` and `oss` respectively.
- **-\-host-url**:
  [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/) or
  [InfluxDB 2.x URL](/{{< latest "influxdb" >}}/reference/urls/).
- **-\-org**:
  InfluxDB organization name.
  The default organization name in InfluxDB Cloud is the email address associated with your account.
- **-\-token**: Authentication token to use to connect to InfluxDB.
  Provide an **All-Access** token (or an [Operator token](/{{< latest "influxdb" >}}/security/tokens/#operator-token) for 2.x).

##### Create an InfluxDB Cloud connection configuration
```sh
# Example cloud connection configuration
influx config create \
  --config-name cloud \
  --host-url https://cloud2.influxdata.com \
  --org your.email@example.com \
  --token mY5uP3rS3cRe7Cl0uDt0K3n
```

##### Create an InfluxDB 2.x connection configuration
{{< keep-url >}}
```sh
# Example 2.x connection configuration
influx config create \
  --config-name oss \
  --host-url http://localhost:8086 \
  --org example-org \
  --token mY5uP3rS3cRe70S5t0K3n
```

## Use templates to migrate InfluxDB resources
[InfluxDB templates](/influxdb/cloud/influxdb-templates/) let you export InfluxDB
[resources](/influxdb/cloud/influxdb-templates/#template-resources) such as buckets,
dashboards, labels, tasks, and more and import them into another InfluxDB instance.
Export resources from your **InfluxDB 2.x** instance and migrate them to
your **InfluxDB Cloud** instance.

{{% note %}}
#### InfluxDB Cloud Free Plan resource limits
If upgrading to an [InfluxDB Cloud Free Plan](/influxdb/cloud/account-management/pricing-plans/#free-plan),
you are only able to create a limited number of resources.
If your exported template exceeds these limits, the resource migration will fail.
{{% /note %}}

- **To migrate _all resources_ from an InfluxDB 2.x organization to an InfluxDB Cloud organization**:  
  Use the [`influx export all` command](/influxdb/cloud/reference/cli/influx/export/all)
  and pipe the output into the [`influx apply` command](/influxdb/cloud/reference/cli/influx/apply/).
  Use the `--active-config` flag with each command to specify which connection configuration to use:

    ```sh
    influx export all --active-config oss | influx apply --active-config cloud
    ```

- **To migrate _specific resources_ from an InfluxDB 2.x organization to an InfluxDB Cloud organization**:  
  Use the [`influx export` command](/influxdb/cloud/reference/cli/influx/export/)
  with lists of specific resources to export or the [`influx export all` command](/influxdb/cloud/reference/cli/influx/export/all)
  **with filters**. Pipe the output into the [`influx apply` command](/influxdb/cloud/reference/cli/influx/apply/).
  Use the `--active-config` flag with each command to specify which connection configuration to use:

  {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Migrate specific resources](#)
[Migrate all with filters](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influx export \
  --active-config oss \
  --buckets 0Xx0oox00XXoxxoo1,0Xx0oox00XXoxxoo2 \
  --labels o0x0oox0Xxoxx001,o0x0oox0Xxoxx002 \
  --dashboards 0XxXooXoo0xooXo0X1,0XxXooXoo0xooXo0X2 | \
influx apply --active-config cloud
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influx export all \
  --active-config oss \
  --filter=resourceKind=Bucket \
  --filter=resourceKind=Dashboard \
  --filter=labelName=Foo | \
influx apply --active-config cloud
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    For more export command examples, see the [`influx export`](/influxdb/cloud/reference/cli/influx/export/#examples)
    and [`influx export all`](/influxdb/cloud/reference/cli/influx/export/all#examples) documentation.

    {{% note %}}
#### Update hardcoded InfluxDB URLs
If any of your migrated resources contain hardcoded InfluxDB URLs (`http://localhost:8086`), do one of the following to update these URLs to your [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/):

- Migrate your resources to InfluxDB Cloud, and then update URLs in the InfluxDB Cloud UI.
- Save your template to a file, update URLs in the file, and then apply the template to your InfluxDB Cloud instance.
    {{% /note %}}

## Migrate DBRP mappings
InfluxDB database and retention policy (DBRP) mappings let you query InfluxDB Cloud
buckets with InfluxQL and the InfluxDB 1.x DBRP convention.
**If you have DBRP mappings in your InfluxDB 2.x instance**, migrate them
to your InfluxDB Cloud instance.

{{< expand-wrapper >}}
{{% expand "Migrate DBRP mappings to InfluxDB Cloud"%}}
1.  Use the [`influx v1 dbrp list` command](/influxdb/cloud/reference/cli/influx/influx/v1/dbrp/list/)
    to view the list of DBRP mappings in your **InfluxDB 2.x** instance.

    ```sh
    influx v1 dbrp list --active-config oss
    ```

2.  Use the [`influx bucket list` command](/influxdb/cloud/reference/cli/influx/bucket/list/)
    to view a list of your **InfluxDB Cloud** buckets and their IDs.

    ```sh
    influx bucket list --active-config cloud
    ```

3.  Use the [`influx v1 dbrp create` command](/influxdb/cloud/reference/cli/influx/influx/v1/dbrp/create/)
    to create DBRP mappings in your **InfluxDB Cloud** instance that map DBRP
    combinations to the appropriate bucket ID.

    ```sh
    influx v1 dbrp create \
      --active-config cloud \
      --bucket-id 12ab34cd56ef \
      --database example-db \
      --rp example-rp
    ```
{{% /expand %}}
{{< /expand-wrapper >}}

## Dual write to InfluxDB 2.x and InfluxDB Cloud
Update external clients to write to your InfluxDB Cloud instance.
**We recommend writing data to both InfluxDB 2.x and InfluxDB Cloud until you
finish [migrating your existing time series data](#migrate-time-series-data)**.

Configure external clients with your InfluxDB Cloud **host**, **organization**,
and **authentication token**.

### Update Telegraf configurations
If using Telegraf configurations migrated to or stored in InfluxDB Cloud,
[update your Telegraf configurations](/influxdb/cloud/telegraf-configs/update/)
**in InfluxDB Cloud** to write to both InfluxDB 2.x and InfluxDB Cloud:

1.  [Update your Telegraf configuration](/influxdb/cloud/telegraf-configs/update/)
    with a second `influxdb_v2` output to write to your InfluxDB Cloud instance.

    ##### Example dual-write Telegraf configuration
    ```toml
    # Write metrics to InfluxDB 2.x
    [[outputs.influxdb_v2]]
      urls = ["https://localhost:8086"]
      token = "$INFLUX_TOKEN"
      organization = "example-org"
      bucket = "example-bucket"

    # Write metrics to InfluxDB Cloud
    [[outputs.influxdb_v2]]
      urls = ["https://cloud2.influxdata.com"]
      token = "$INFLUX_CLOUD_TOKEN"
      organization = "your.email@example.com"
      bucket = "example-bucket"
    ```

2.  Add the following environment variables to your Telegraf environment(s):

    - `INFLUX_TOKEN`: InfluxDB 2.x authentication token
    - `INFLUX_CLOUD_TOKEN`: InfluxDB Cloud authentication token

3.  Use the command provided in your [Telegraf Setup Instructions](/influxdb/cloud/telegraf-configs/#use-influxdb-telegraf-configurations)
    to restart Telegraf with the updated configuration and begin writing to both
    InfluxDB 2.x and InfluxDB Cloud.

## Migrate time series data
To migrate your time series data from your InfluxDB 2.x instance to your
InfluxDB Cloud instance, do the following:

1.  Use the [`influx bucket list` command](/influxdb/cloud/reference/cli/influx/bucket/list/)
    to view a list of your **InfluxDB 2.x** buckets and their IDs.

    ```sh
    influx bucket list --active-config oss
    ```

2.  Use the [`influxd inspect export-lp` command](/influxdb/v2.0/reference/cli/influxd/inspect/export-lp/)
    to export data from a bucket in your **InfluxDB 2.x** instance as line protocol.
    Include the following flags:

    - **-\-bucket-id**: Bucket ID to export
    - **-\-engine-path**: InfluxDB [engine path](/{{< latest "influxdb" >}}/reference/internals/file-system-layout/#engine-path)
    - **-\-output-path**: Output file path
    - **-\-compress**: _(Optional)_ Gzip the exported line protocol
    - **-\-start**: _(Optional)_ Earliest timestamp to export
    - **-\-end**: _(Optional)_ Latest timestamp to export

    ```sh
    influxd inspect export-lp \
      --bucket-id 12ab34cd56ef \
      --engine-path ~/.influxdbv2/engine \
      --compress \
      --output-path path/to/bucket-export.lp
    ```

3.  Use the [`influx write` command](/influxdb/cloud/reference/cli/influx/write/)
    to write your exported line protocol to your **InfluxDB Cloud** instance.
    Provide the following.

    - **-\-bucket**: Target bucket name  
      _OR_  
      **-\-bucket-id**: Target bucket ID
    - **-\-compression**: _(Optional)_ `gzip` if the exported line protocol is compressed
    - **-\-file**: Import file path

    ```sh
    influx write \
      --active-config cloud \
      --bucket example-bucket \
      --compression gzip \
      --file path/to/bucket-export.lp
    ```

4. Repeat steps 2-3 for each bucket.

{{% note %}}
#### InfluxDB Cloud write rate limits
Write requests are subject to rate limits associated with your
[InfluxDB Cloud pricing plan](/influxdb/cloud/account-management/pricing-plans/).
If your exported line protocol size potentially exceeds your rate limits,
consider doing one of the following:

- Include the `--rate-limit` flag with `influx write` to rate limit written data.

    ```sh
    influx write \
      --active-config cloud \
      --bucket example-bucket \
      --file path/to/bucket-export.lp \
      --rate-limit "5 MB / 5 min"
    ```

- Include `--start` and `--end` flags with `influxd inpsect export-lp` to limit
  exported data by time and then sequentially write the consecutive time ranges.

    ```sh
    influxd inspect export-lp \
      --bucket-id 12ab34cd56ef \
      --engine-path ~/.influxdbv2/engine \
      --start 2021-01-01T00:00:00Z \
      --end 2021-02-01T00:00:00Z \
      --compress \
      --output-path path/to/example-bucket-jan-2021.lp
    ```

To minimize network bandwidth usage, we recommend using gzip to compress exported line protocol.
However, when writing to InfluxDB Cloud, **Data In** and **Ingest batch size**
rate limits track the payload size of the **uncompressed** line protocol.
{{% /note %}}

#### Migrate system buckets
InfluxDB [system buckets](/influxdb/cloud/reference/internals/system-buckets/)
contain data related to the InfluxDB monitoring and alerting system.
Although the retention period for system buckets in both InfluxDB Cloud and
InfluxDB 2.x is only seven days, if you want to migrate this data,
use the same method described above [to migrate time series data](#migrate-time-series-data).

#### Export and write data in a single command
If your data and rate limits allow, you can export and write data in a single
command without writing a line protocol export file to disk.
The `influxd inspect export-lp` command can output to **stdout** and the `influx write`
command accepts line protocol from **stdin**.

{{< expand-wrapper >}}
{{% expand "Export and write data" %}}
```sh
influxd inspect export-lp \
  --bucket-id 12ab34cd56ef \
  --engine-path ~/.influxdbv2/engine \
  --compress \
  --output-path - | \
influx write \
  --active-config cloud \  
  --bucket example-bucket \
  --compression gzip \
  --rate-limit "5 MB / 5 min"
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Collaborate with other users
To collaborate with other users in your InfluxDB Cloud organization,
[invite users to join your organization](/influxdb/cloud/account-management/multi-user/invite-user/).
