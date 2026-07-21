<!-- COMMENT TO ALLOW STARTING WITH SHORTCODE -->

{{% product-name %}} is the fully managed, cloud-hosted version of
[InfluxDB 3 Enterprise](/influxdb3/enterprise/).
InfluxData provisions and operates the InfluxDB 3 servers for you, so you don't
install, run, or scale servers yourself.
To get started, get your instance host from InfluxData, configure the
`influxdb3` CLI, log in, and then create a database.

- [Get your instance](#get-your-instance)
- [Configure the influxdb3 CLI](#configure-the-influxdb3-cli)
  - [Install the influxdb3 CLI](#install-the-influxdb3-cli)
  - [Connect to your instance](#connect-to-your-instance)
  - [Log in to your instance](#log-in-to-your-instance)
- [Create a database](#create-a-database)
- [Create a token for applications](#create-a-token-for-applications)

## Get your instance

During early access, InfluxData provisions {{% product-name %}} instances for
you. You can't sign up for the service yourself.
To request early access, see the
[InfluxDB 3 Cloud product page](https://www.influxdata.com/products/influxdb3-cloud/).

After your instance is provisioned, InfluxData provides your instance
**host URL**, which is the endpoint you connect to.
You authenticate with your InfluxData account in the following steps.
You don't copy or store a token for interactive use.

## Configure the influxdb3 CLI

The [`influxdb3` CLI](/influxdb3/cloud/reference/cli/influxdb3/) lets you
administer your instance and write and query data from the command line.
Because {{% product-name %}} is fully managed, you don't install or run
anything for the service itself. You point the `influxdb3` CLI at your hosted
instance and log in with your InfluxData account.

### Install the influxdb3 CLI

The `influxdb3` CLI is distributed in the InfluxDB 3 Enterprise binary.
For {{% product-name %}}, you install the Enterprise binary to get the CLI—you don't run the server.
To install it on **Linux** or **macOS**, download and run the quick installer
script:

<!--pytest.mark.skip-->

```bash
curl -O https://www.influxdata.com/d/install_influxdb3.sh \
&& sh install_influxdb3.sh enterprise
```

> [!Note]
> The installer also sets up a local InfluxDB 3 server.
> For {{% product-name %}}, you only need the CLI, so you can skip the prompts
> to start a server.

For Windows binaries and other CLI installation options,
see [Install the influxdb3 CLI for InfluxDB 3 Cloud](/influxdb3/cloud/install/).

### Connect to your instance

Set the `INFLUXDB3_HOST_URL` environment variable for the `influxdb3` CLI to connect to your instance host URL:

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS and Linux](#)
[PowerShell](#)
[CMD](#)
{{% /tabs %}}
{{% tab-content %}}

```sh
export INFLUXDB3_HOST_URL={{< influxdb/host-url >}}
```

{{% /tab-content %}}
{{% tab-content %}}

```powershell
$env:INFLUXDB3_HOST_URL = "{{< influxdb/host-url >}}"
```

{{% /tab-content %}}
{{% tab-content %}}

```sh
set INFLUXDB3_HOST_URL={{< influxdb/host-url >}} 
# Make sure to include a space character at the end of this command.
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Log in to your instance

<span id="set-your-token-for-authorization"></span>

Log in to your instance with the OAuth device-code flow.
{{% product-name %}} authenticates you with your InfluxData account, so you
don't need a token to use the CLI interactively.

Run the following command and follow the printed instructions:

<!--pytest.mark.skip-->

```sh
influxdb3 auth login --oauth
```

The output is a URL and a one-time user code.
Open the URL in a browser, enter the code, and approve the request.
After you approve, the CLI saves your credentials to
`~/.influxdb3/credentials.json` and uses them automatically for later
commands, so you don't need to pass a token.

> [!Note]
> Don't set the `INFLUXDB3_AUTH_TOKEN` environment variable for interactive use.
> If it's set, the `influxdb3` CLI uses that token instead of your logged-in
> session. Run `influxdb3 auth login --oauth` again when your session expires.

List your databases to verify that you're authenticated:

<!--pytest.mark.skip-->

```sh
influxdb3 show databases
```

A successful response confirms that your host URL and login are configured
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
  [retention period](/influxdb3/cloud/admin/databases/#retention-periods)
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

> [!Note]
> A newly created database can take a few seconds to appear in
> `influxdb3 show databases`.

## Create a token for applications

Logging in authenticates you for interactive use with the `influxdb3` CLI.
For applications and automated clients, create a **database token** scoped to
only the databases and permissions it needs.
Creating tokens requires admin privileges. If your user doesn't have admin
access, ask an administrator to create a token for you.

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

> [!Important]
> #### Store your token securely
>
> InfluxDB displays the token string only when you create it.
> Store your token securely—you cannot retrieve it from the database later.

Applications can authenticate with the token by setting the
`INFLUXDB3_AUTH_TOKEN` environment variable or passing the `--token` option.

> [!Note]
> #### Authentication in {{% product-name %}}
>
> For interactive use, you authenticate as a user with
> `influxdb3 auth login --oauth` — no token required.
> For applications, create and manage tokens with the `influxdb3` CLI:
>
> - **Database tokens**: Grant scoped read and/or write access to specific
>   databases.
> - **Admin tokens**: Grant full administrative access. Create named admin
>   tokens with `influxdb3 create token --admin --name "NAME"`.
>
> For more information, see
> [Manage tokens](/influxdb3/cloud/admin/tokens/).

{{% page-nav
  prev="/influxdb3/cloud/get-started/"
  prevText="Get started"
  next="/influxdb3/cloud/get-started/write/"
  nextText="Write data"
%}}
