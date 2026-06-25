<!-- COMMENT TO ALLOW STARTING WITH SHORTCODE -->

{{% product-name %}} is the fully managed, cloud-hosted version of
[InfluxDB 3 Enterprise](/influxdb3/enterprise/).
InfluxData provisions and operates the InfluxDB 3 servers for you, so you don't
install, run, or scale servers yourself.
To get started, get your instance and admin token from InfluxData, install and
configure the `influxdb3` CLI, and then create a database and token.

- [Get your instance and admin token](#get-your-instance-and-admin-token)
- [Configure the influxdb3 CLI](#configure-the-influxdb3-cli)
  - [Connect to your instance](#connect-to-your-instance)
  - [Set your token for authorization](#set-your-token-for-authorization)
- [Create a database](#create-a-database)
- [Create a token](#create-a-token)

## Get your instance and admin token

During early access, InfluxData provisions {{% product-name %}} instances for
you--there's no self-service signup.
To request early access, see
[InfluxDB 3 Cloud](https://www.influxdata.com/products/influxdb3-cloud/).

After your instance is provisioned, InfluxData provides the following:

- Your instance **host URL** (the endpoint you connect to)
- An initial **admin token** for administering your instance

Your admin token has full administrative privileges.
Use it to authenticate with your instance and to create databases and
additional tokens.
Store it securely--you use it to authenticate the `influxdb3` CLI in the
following steps.

## Configure the influxdb3 CLI

The [`influxdb3` CLI](/influxdb3/cloud/reference/cli/influxdb3/) lets you
administer your instance and write and query data from the command line.
Because {{% product-name %}} is fully managed, there's nothing to install or run
for {{% product-name %}} itself--you point the `influxdb3` CLI at your hosted
instance and authenticate with your admin token.

### Connect to your instance

The `influxdb3` CLI connects to `http://127.0.0.1:8181` by default, so set the
`INFLUXDB3_HOST_URL` environment variable to your instance host URL:

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS and Linux](#)
[PowerShell](#)
[CMD](#)
{{% /tabs %}}
{{% tab-content %}}

```sh
export INFLUXDB3_HOST_URL=https://{{< influxdb/host >}}
```

{{% /tab-content %}}
{{% tab-content %}}

```powershell
$env:INFLUXDB3_HOST_URL = "https://{{< influxdb/host >}}"
```

{{% /tab-content %}}
{{% tab-content %}}

```sh
set INFLUXDB3_HOST_URL=https://{{< influxdb/host >}} 
# Make sure to include a space character at the end of this command.
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Set your token for authorization

Set the `INFLUXDB3_AUTH_TOKEN` environment variable to your admin token so the
`influxdb3` CLI authenticates automatically--you don't need to pass `--token`
with each command:

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS and Linux](#)
[PowerShell](#)
[CMD](#)
{{% /tabs %}}
{{% tab-content %}}

```sh { placeholders="ADMIN_TOKEN" }
export INFLUXDB3_AUTH_TOKEN=ADMIN_TOKEN
```

{{% /tab-content %}}
{{% tab-content %}}

```powershell { placeholders="ADMIN_TOKEN" }
$env:INFLUXDB3_AUTH_TOKEN = "ADMIN_TOKEN"
```

{{% /tab-content %}}
{{% tab-content %}}

```sh { placeholders="ADMIN_TOKEN" }
set INFLUXDB3_AUTH_TOKEN=ADMIN_TOKEN 
# Make sure to include a space character at the end of this command.
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

Replace {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}
with the admin token InfluxData provided.

Verify that the CLI can reach your instance by running a simple query:

<!--pytest.mark.skip-->

```sh
influxdb3 query --database "_internal" "SELECT 1"
```

A successful response confirms that your host URL and token are configured
correctly.

## Create a database

Use the
[`influxdb3 create database` command](/influxdb3/cloud/reference/cli/influxdb3/)
to create a database.
You can use an existing database or create a new one specifically for this
getting started tutorial.
_Examples in this tutorial assume a database named `get-started`._

Provide the following:

- The database name
- _Optional:_ a database
  [retention period](/influxdb3/cloud/admin/databases/)
  as a duration value. If no retention period is specified, the default is
  infinite.

<!--pytest.mark.skip-->

```sh { placeholders="get-started|1y" }
influxdb3 create database \
  --retention-period 1y \
  get-started
```

Replace the following:

- {{% code-placeholder-key %}}`get-started`{{% /code-placeholder-key %}}:
  the name of the database to create
- {{% code-placeholder-key %}}`1y`{{% /code-placeholder-key %}}:
  the database retention period as a duration

## Create a token

Your admin token can write and query data, but for applications we recommend
creating a **database token** scoped to only the databases and permissions it
needs.

Use the
[`influxdb3 create token` command](/influxdb3/cloud/reference/cli/influxdb3/)
with the `--permission` option to create a token with read and write access to
your database.

Provide the following:

- `--permission`: A resource permission string in the format
  `db:DATABASE_NAME:read,write`
- `--name`: A unique name for the token

<!--pytest.mark.skip-->

```sh { placeholders="get-started" }
influxdb3 create token \
  --permission "db:get-started:read,write" \
  --name "Read/write token for get-started database"
```

Replace {{% code-placeholder-key %}}`get-started`{{% /code-placeholder-key %}}
with the name of the database to grant the token access to.

The command returns the token string.
Store the token string in a safe place.
**This is the only time the token string is available in plain text.**

> [!Note]
> #### Token types in {{% product-name %}}
>
> In {{% product-name %}}, you create and manage tokens with the `influxdb3` CLI.
> {{% product-name %}} supports the following token types:
>
> - **Admin tokens**: Grant full administrative access. The first admin token
>   (the _operator_ token) is managed by InfluxData. Create additional named
>   admin tokens with `influxdb3 create token --admin --name "NAME"`.
> - **Database tokens**: Grant scoped read and/or write access to specific
>   databases.
>
> For more information, see
> [Manage tokens](/influxdb3/cloud/admin/tokens/).

{{% page-nav
  prev="/influxdb3/cloud/get-started/"
  prevText="Get started"
  next="/influxdb3/cloud/get-started/write/"
  nextText="Write data"
%}}
