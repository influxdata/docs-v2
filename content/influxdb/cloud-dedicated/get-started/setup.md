---
title: Set up InfluxDB Cloud Dedicated
seotitle: Set up InfluxDB | Get started with InfluxDB Cloud Dedicated
list_title: Set up InfluxDB
description: >
  Learn how to set up InfluxDB Cloud Dedicated for the "Get started with InfluxDB"
  tutorial and for general use.
menu:
  influxdb_cloud_dedicated:
    name: Set up InfluxDB
    parent: Get started
    identifier: get-started-set-up
weight: 101
metadata: [1 / 3]
related:
  - /influxdb/cloud-dedicated/admin/databases/
  - /influxdb/cloud-dedicated/reference/cli/influxctl/
  - /influxdb/cloud-dedicated/reference/api/
---

As you get started with this tutorial, do the following to make sure everything
you need is in place.

- [Request an InfluxDB Cloud Dedicated cluster](#request-an-influxdb-cloud-dedicated-cluster)
- [Download, install, and configure the influxctl CLI](#download-install-and-configure-the-influxctl-cli)
- [Create a database](#create-a-database)
- [Create a database token](#create-a-database-token)
- [Configure authentication credentials](#configure-authentication-credentials)

## Request an InfluxDB Cloud Dedicated cluster

[Contact the InfluxData Sales team]({{< cta-link >}}) to request an
InfluxDB Cloud Dedicated cluster.
When your cluster is deployed, InfluxData sends you an email inviting you to
join your cluster. Use the link provided in the email to accept the invitation
and create your InfluxDB Cloud Dedicated account.

After accepting the invitation and creating an account, InfluxData provides the
following information:

- Your InfluxDB Cloud Dedicated **account ID**
- Your InfluxDB Cloud Dedicated **cluster ID**
- Your InfluxDB Cloud Dedicated **cluster URL**

## Download, install, and configure the influxctl CLI

The [`influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/)
lets you manage your {{< product-name omit="Clustered" >}} cluster from a
command line and perform administrative tasks such as managing
databases and tokens.

1.  [Download and install the `influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).

2.  **Create a connection profile and provide your {{< product-name >}} connection credentials**.

    The `influxctl` CLI uses [connection profiles](/influxdb/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)
    to connect to and authenticate with your {{< product-name omit="Clustered" >}} cluster.

    Create a file named `config.toml` at the following location depending on
    your operating system.

    | Operating system | Default profile configuration file path               |
    | :--------------- | :---------------------------------------------------- |
    | Linux            | `~/.config/influxctl/config.toml`                     |
    | macOS            | `~/Library/Application Support/influxctl/config.toml` |
    | Windows          | `%APPDATA%\influxctl\config.toml`                     |

    {{% note %}}

If stored at a non-default location, include the `--config` flag with each
`influxctl` command and provide the path to your profile configuration file.

    {{% /note %}}

3.  **Copy and paste the sample configuration profile code** into your `config.toml`:

{{% code-placeholders "ACCOUNT_ID|CLUSTER_ID" %}}

```toml
[[profile]]
  name = "default"
  product = "dedicated"
  account_id = "ACCOUNT_ID"
  cluster_id = "CLUSTER_ID"
  host = "{{< influxdb/host >}}"
```

{{% /code-placeholders %}}

Replace the following with your {{< product-name >}} credentials:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: Your account ID
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: Your cluster ID

_For detailed information about `influxctl` profiles, see
[Configure connection profiles](/influxdb/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)_.

## Create a database

Use the
[`influxctl database create` command](/influxdb/cloud-dedicated/reference/cli/influxctl/database/create/)
to create a database. You can use an existing database or create a new one
specifically for this getting started tutorial.
_Examples in this getting started tutorial assume a database named `get-started`._

{{% note %}}

#### Authenticate with your cluster

The first time you run an `influxctl` CLI command, you are directed
to login to **Auth0**. Once logged in, Auth0 issues a short-lived (1 hour)
management token for the `influxctl` CLI that grants administrative access
to your {{< product-name omit="Clustered" >}} cluster.
{{% /note %}}

Provide the following:

- Database name.
- _Optional:_ Database
  [retention period](/influxdb/cloud-dedicated/admin/databases/#retention-periods)
  as a duration value. If no retention period is specified, the default is infinite.

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

{{% code-placeholders "get-started|1y" %}}

```sh
influxctl database create --retention-period 1y get-started
```

{{% /code-placeholders %}}

## Create a database token

Use the
[`influxctl token create` command](/influxdb/cloud-dedicated/reference/cli/influxctl/token/create/)
to create a database token with read and write permissions for your database.

Provide the following:

- Permission grants
  - `--read-database`: Grants read access to a database
  - `--write-database` Grants write access to a database
- Token description

{{% code-placeholders "get-started" %}}

```bash
influxctl token create \
  --read-database get-started \
  --write-database get-started \
  "Read/write token for get-started database" > /app/iot-starter/secret.txt
```

{{% /code-placeholders %}}

<!--test-cleanup
```bash
influxctl token delete --force \
$(influxctl token list \
 | grep "Read/write token for get-started database" \
 | head -n1 | cut -d' ' -f2)
```
-->

The command returns the token ID and the token string.
Store the token string in a safe place.
You'll need it later.
**This is the only time the token string is available in plain text.**

{{% note %}}

#### Store secure tokens in a secret store

Token strings are returned _only_ on token creation.
We recommend storing database tokens in a **secure secret store**.
For example, see how to [authenticate Telegraf using tokens in your OS secret store](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/os).
{{% /note %}}

## Configure authentication credentials

Code samples in later sections assume you assigned the token string to an
`INFLUX_TOKEN` environment variable--for example:

{{< tabs-wrapper >}}
{{% tabs %}}
[MacOS and Linux](#)
[PowerShell](#)
[CMD](#)
{{% /tabs %}}
{{% tab-content %}}

<!-- Using tabs-wrapper b/c code-tabs-wrapper breaks here. -->
<!-- BEGIN MACOS/LINUX -->

{{% code-placeholders "DATABASE_TOKEN" %}}

```sh
export INFLUX_TOKEN=DATABASE_TOKEN
```

{{% /code-placeholders %}}

<!-- END MACOS/LINUX -->

{{% /tab-content %}}
{{% tab-content %}}

<!-- BEGIN POWERSHELL -->

{{% code-placeholders "DATABASE_TOKEN" %}}

```powershell
$env:INFLUX_TOKEN = "DATABASE_TOKEN"
```

{{% /code-placeholders %}}

<!-- END POWERSHELL -->

{{% /tab-content %}}
{{% tab-content %}}

<!-- BEGIN CMD -->

{{% code-placeholders "DATABASE_TOKEN" %}}

<!--pytest.mark.skip-->

```sh
set INFLUX_TOKEN=DATABASE_TOKEN 
# Make sure to include a space character at the end of this command.
```

{{% /code-placeholders %}}

<!-- END CMD -->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

Replace {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}
with your [database token](#create-a-database-token) string.

{{< page-nav prev="/influxdb/cloud-dedicated/get-started/" next="/influxdb/cloud-dedicated/get-started/write/" keepTab=true >}}
