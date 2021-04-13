---
title: Upgrade from InfluxDB OSS 2.x to InfluxDB Cloud
description: >
  ...
menu:
  influxdb_cloud:
    name: OSS 2.x to Cloud
    parent: Upgrade to Cloud
weight: 11
---

Need an intro ...

{{% note %}}
- InfluxDB Cloud does not support scrapers.
  Use Telegraf with the Prom input instead.

- InfluxDB Cloud does not support 1.x compatible authorizations.
  Use token authentication to authorize requests with InfluxDB Cloud.

- Rate and resource limits
{{% /note %}}

## Create an InfluxDB Cloud account
To upgrade to InfluxDB Cloud, first create a new InfluxDB Cloud account.
Do one of the following:

- [Subscribe through InfluxData](/influxdb/cloud/get-started/#subscribe-through-influxdata) and
  [start for free](/influxdb/cloud/get-started/#start-for-free).
- [Subscribe through your cloud provider](/influxdb/cloud/get-started/#subscribe-through-a-cloud-provider).

## Create an All-Access authentication token
InfluxDB authentication tokens are unique to each organization.
Create an **All-Access** token in your InfluxDB Cloud user interface (UI) to use
for the upgrade process.

1. Click **Data (Load Data) > Tokens** in the left navigation bar.

    {{< nav-icon "data" >}}
2. Click **{{< icon "plus" >}} Generate** and then select **All-Access Token**.
3. Enter a description for the token and then click **{{< icon "check" >}} Save**.

{{% note %}}
If you've created other tokens in your OSS 2.x instance for external libraries or
integrations, create corresponding tokens for each in your InfluxDB Cloud instance.
You cannot migrate tokens from InfluxDB OSS to InfluxDB Cloud.
{{% /note %}}

_For more information about managing tokens and token types, see [Manage tokens](/influxdb/cloud/security/tokens/)._

## Set up influx CLI connection configurations
The `influx` command line interface (CLI) lets you configure connection configurations
that automatically provides **host**, **organization**, and **authentication token**
credentials to CLI commands.
Use the `influx` CLI packaged with InfluxDB OSS 2.x and the
[`influx config create` command](/influxdb/cloud/reference/cli/influx/config/create/)
to set up the connection configurations for both your InfluxDB Cloud instance and
your InfluxDB OSS 2.x instance.

Provide the following for each configuration:

- **Configuration name**:
  Unique name for the connection configuration.
  The examples below use `cloud` and `oss` respectively.
- **InfluxDB host URL**:
  Your [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/) or your
  [InfluxDB OSS URL](/{{< latest "influxdb" >}}/reference/urls/).
- **InfluxDB organization**:
  InfluxDB organization name.
  The default organization name in InfluxDB Cloud is the email address associated with your account.
- **Authentication token**: Authentication token to use to connect to InfluxDB.
  Provide an **All-Access** token (or an [Operator token](/{{< latest "influxdb" >}}/security/tokens/#operator-token) for OSS).


##### Create an InfluxDB Cloud connection configuration
```sh
# Example cloud connection configuration
influx config create \
  --config-name cloud \
  --host-url https://cloud2.influxdata.com \
  --org your.email@example.com \
  --token mY5uP3rS3cRe7Cl0uDt0K3n
```

##### Create an InfluxDB OSS 2.x connection configuration
{{< keep-url >}}
```sh
# Example OSS connection configuration
influx config create \
  --config-name oss \
  --host-url http://localhost:8086 \
  --org example-org \
  --token mY5uP3rS3cRe70S5t0K3n
```

## Export a migration template
[InfluxDB templates](/influxdb/cloud/influxdb-templates/) let you export InfluxDB
resources such as buckets, dashboards, labels, tasks, and more and import them
into another InfluxDB instance. Export all or only some resources from your **InfluxDB OSS 2.x** instance.

- **To export _all resources_ from an organization**:  
  Use the [`influx export all` command](/influxdb/cloud/reference/cli/influx/export/all)
  and provide the following:

    - [InfluxDB OSS connection configuration name](#set-up-influx-cli-connection-configurations)
    - Output path for the exported template file

    ```sh
    influx export all \
      --active-config oss \
      --file path/to/template.yml
    ```

- **To export _only some resources_ from an organization**:  
  Use the [`influx export` command](/influxdb/cloud/reference/cli/influx/export/)
  with lists of specific resources to export or the [`influx export all` command](/influxdb/cloud/reference/cli/influx/export/all)
  **with filters**. Provide the following for each:

    - [InfluxDB OSS connection configuration name](#set-up-influx-cli-connection-configurations)
    - Output path for the exported template file

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Export specific resources](#)
[Export all with filters](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influx export \
  --active-config oss \
  --file path/to/template.yml \
  --buckets 0Xx0oox00XXoxxoo1,0Xx0oox00XXoxxoo2 \
  --labels o0x0oox0Xxoxx001,o0x0oox0Xxoxx002 \
  --dashboards 0XxXooXoo0xooXo0X1,0XxXooXoo0xooXo0X2
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influx export all \
  --active-config oss \
  --file path/to/template.yml \
  --filter=resourceKind=Bucket \
  --filter=resourceKind=Dashboard \
  --filter=labelName=Foo
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    For more export command examples, see the [`influx export`](/influxdb/cloud/reference/cli/influx/export/#examples)
    and [`influx export all`](/influxdb/cloud/reference/cli/influx/export/all#examples) documentation.

## Apply your migration template
Use the [`influx apply` command](/influxdb/cloud/reference/cli/influx/apply/) to
apply your exported migration template to your **InfluxDB Cloud instance**.
When applied, InfluxDB Cloud creates all resources included in the template file.

Provide the following:

- [InfluxDB Cloud connection configuration name](#set-up-influx-cli-connection-configurations)
- File path of the migration template file

```sh
influx apply \
  --active-config cloud \
  --file path/to/template.yml
```

## Distribute new tokens and begin dual write
...

## Migrate data
Discuss handling of existing data (similar to the 1.x to Cloud path with exporting data to LP) and then importing using CLI.

## Users: Invite additional users to the Cloud account
