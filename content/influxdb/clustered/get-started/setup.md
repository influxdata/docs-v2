---
title: Set up InfluxDB Clustered
seotitle: Set up InfluxDB | Get started with InfluxDB Clustered
list_title: Set up InfluxDB
description: >
  Learn how to set up InfluxDB Clustered for the "Get started with InfluxDB"
  tutorial and for general use.
menu:
  influxdb_clustered:
    name: Set up InfluxDB
    parent: Get started
    identifier: get-started-set-up
weight: 101
metadata: [1 / 3]
related:
  - /influxdb/clustered/admin/databases/
  - /influxdb/clustered/reference/cli/influxctl/
  - /influxdb/clustered/reference/api/
---

As you get started with this tutorial, do the following to make sure everything
you need is in place.

- [Install and configure your InfluxDB cluster](#install-and-configure-your-influxdb-cluster)
- [Download, install, and configure the influxctl CLI](#download-install-and-configure-the-influxctl-cli)
- [Create a database](#create-a-database)
- [Create a database token](#create-a-database-token)
- [Configure authentication credentials](#configure-authentication-credentials)

## Install and configure your InfluxDB cluster

{{% note %}}
_InfluxDB Clustered installation instructions are coming soon._
{{% /note %}}

## Download, install, and configure the influxctl CLI
    
The [`influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/)
provides a simple way to manage your {{< product-name omit="Clustered" >}} cluster from a
command line. It lets you perform administrative tasks such as managing
databases and tokens.

1.  [Download and install the `influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/#download-and-install-influxctl).

2.  **Create a connection profile and provide your {{< product-name >}} connection credentials**.

    The `influxctl` CLI uses [connection profiles](/influxdb/clustered/reference/cli/influxctl/#configure-connection-profiles)
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

    **Copy and paste the sample configuration profile code** into your `config.toml`:

{{% code-placeholders "PORT|HOST|OAUTH_TOKEN_URL|OAUTH_DEVICE_URL|OAUTH_CLIENT_ID" %}}
```toml
[[profile]]
  name = "default"
  product = "clustered"
  host = "HOST"
  port = "PORT"

[profile.auth.oauth2]
  client_id = "OAUTH_CLIENT_ID"
  scopes = [""]
  token_url = "OAUTH_TOKEN_URL"
  device_url = "OAUTH_DEVICE_URL"
```
{{% /code-placeholders %}}

Replace the following with your {{< product-name >}} credentials:
  - {{% code-placeholder-key %}}`PORT`{{% /code-placeholder-key %}}: the port to use to access your InfluxDB cluster
  - {{% code-placeholder-key %}}`OAUTH_CLIENT_ID`{{% /code-placeholder-key %}}: the client URL of your OAuth2 provider
    (for example: `https://identityprovider/oauth2/v2/token`)
  - {{% code-placeholder-key %}}`OAUTH_DEVICE_ID`{{% /code-placeholder-key %}}: the device URL of your OAuth2 provider
    (for example: `https://identityprovider/oauth2/v2/auth/device`)

_For detailed information about `influxctl` profiles, see
[Configure connection profiles](/influxdb/clustered/reference/cli/influxctl/#configure-connection-profiles)_.

## Create a database

Use the [`influxctl database create` command](/influxdb/clustered/reference/cli/influxctl/database/create/)
to create a database. You can use an existing database or create a new one
specifically for this getting started tutorial.
_Examples in this getting started tutorial assume a database named **"get-started"**._

{{% note %}}
#### Authenticate with your cluster
  
The first time you run an `influxctl` CLI command, you are directed
to login to your **OAuth provider**. Once logged in, your OAuth provider issues
a short-lived (1 hour) management token for the `influxctl` CLI that grants
administrative access to your {{< product-name omit="Clustered" >}} cluster.
{{% /note %}}

Provide the following:

- Database name.
- _Optional:_ Database [retention period](/influxdb/clustered/admin/databases/#retention-periods)
  as a duration value. If no retention period is specified, the default is infinite.

{{% code-placeholders "get-started|1y" %}}
```sh
influxctl database create --retention-period 1y get-started
```
{{% /code-placeholders %}}

## Create a database token

Use the [`influxctl token create` command](/influxdb/clustered/reference/cli/influxctl/token/create/)
to create a database token with read and write permissions for your database.

Provide the following:

- Permission grants
  - `--read-database`: Grants read access to a database
  - `--write-database` Grants write access to a database
- Token description

{{% code-placeholders "get-started" %}}
```sh
influxctl token create \
  --read-database get-started \
  --write-database get-started \
  "Read/write token for get-started database"
```
{{% /code-placeholders %}}


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
[macOS and Linux](#)
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

{{< page-nav prev="/influxdb/clustered/get-started/" next="/influxdb/clustered/get-started/write/" keepTab=true >}}
