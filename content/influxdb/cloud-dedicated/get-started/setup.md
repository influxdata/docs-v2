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
  - /influxdb/cloud-dedicated/admin/buckets/
  - /influxdb/cloud-dedicated/reference/cli/influx/
  - /influxdb/cloud-dedicated/reference/api/
---

As you get started with this tutorial, do the following to make sure everything
you need is in place.

- [Download, install, and configure the influxctl CLI](#download-install-and-configure-the-influxctl-cli)
- [Create a database](#create-a-database)
- [Create a database token](#create-a-database-token)

## Download, install, and configure the influxctl CLI
    
The [`influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/)
provides a simple way to manage your InfluxDB Cloud Dedicated cluster from a
command line. It lets you perform administrative tasks such as managing
databases and tokens.

1.  **Download the `influxctl` CLI**.

    {{< tabs-wrapper >}}
{{% tabs %}}
[Linux](#)
[macOS](#)
[Windows](#)
{{% /tabs %}}
{{% tab-content %}}
<!-------------------------------- BEGIN Linux -------------------------------->

<!-- TODO: Linux installation instructions -->

<!--------------------------------- END Linux --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------------- BEGIN macOS -------------------------------->

<!-- TODO: macOS installation instructions -->

<!--------------------------------- END macOS --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------------- BEGIN Windows ------------------------------->

<!-- TODO: Windows installation instructions -->

<!--------------------------------- END Windows -------------------------------->
{{% /tab-content %}}
    {{< /tabs-wrapper >}}

2.  **Create a profile configuration file and add your InfluxDB Cloud Dedicated connection credentials**.
    The `influxctl` CLI uses the profile configuration file to connect to and
    authenticate with your InfluxDB Cloud Dedicated cluster.

    1.  Create a file named `config.toml` at the following locations based on your
        operating system:

        | Operating system | Configuration file location                           |
        | :--------------- | :---------------------------------------------------- |
        | Linux            | `~/.config/influxctl/config.toml`                     |
        | macOS            | `~/Library/Application Support/influxctl/config.toml` |
        | Windows          | `%APPDATA%\influxctl\config.toml`                     |

    2.  Add a `default` profile to `config.toml` with the following properties:

        - **account_id**: Your InfluxDB Cloud Dedicated account ID
        - **cluster_id**: Your InfluxDB Cloud Dedicated cluster ID

        ```toml
        [default]
          account_id = "YOUR_ACCOUNT_ID"
          cluster_id = "YOUR_CLUSTER_ID"
        ```

        _You can add multiple profiles to your `config.toml`.
        For more information about `influxctl` profiles, see
        [Configure connection profiles](/influxdb/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)_.

## Create a database

Use the [`influxctl database create` command](/influxdb/cloud-dedicated/reference/cli/influxct/database/create/)
to create a database. You can use an existing database or create a new one
specifically for this getting started tutorial.
_Examples in this getting started tutorial assume a database named **"get-started"**._

{{% note %}}
#### Authenticate with your cluster
    
The first time you run an `influxctl` CLI command, you are directed
to login to **Auth0**. Once logged in, Auth0 issues a short-lived (1 hour)
management token for the `influxctl` CLI that grants administrative access
to your InfluxDB Cloud Dedicated cluster.
{{% /note %}}

Provide the following:

- Database name.
- _(Optional)_ Database [retention period](/influxdb/cloud-dedicated/admin/databases/#retention-periods)
  as a duration value.
  If no retention period is specified, the default is infinite.

```sh
influxctl database create \
  --retention-period 1y \
  get-started
```

## Create a database token

Use the [`influxctl token create` command](/influxdb/cloud-dedicated/reference/cli/influxct/token/create/)
to create a database token with read and write permissions for your database.

Provide the following:

- Permission grants
  - `--read-database`: Grants read access to a database
  - `--write-database` Grants write access to a database
- Token description

```sh
influxctl token create \
  --read-database get-started \
  --write-database get-started \
  "Read/write token for get-started database"
```

{{< page-nav prev="/influxdb/cloud-dedicated/get-started/" next="/influxdb/cloud-dedicated/get-started/write/" keepTab=true >}}
