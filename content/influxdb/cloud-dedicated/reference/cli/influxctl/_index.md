---
title: influxctl
list_title: influxctl
description: >
  The `influxctl` command line interface (CLI) performs administrative tasks in
  an InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    name: influxctl
    parent: CLIs
weight: 101
influxdb/cloud-dedicated/tags: [cli]
---

The `influxctl` command line interface (CLI) performs administrative tasks in
an InfluxDB Cloud Dedicated cluster.

- [Usage](#usage)
- [Commands](#commands)
- [Flags](#command-flags)
- [Download and install influxctl](#download-and-install-influxctl)
- [Configure connection profiles](#configure-connection-profiles)
- [Authentication](#authentication)

## Usage

```sh
influxctl [flags] [command]
```

## Commands

| Command                                                                 | Description                            |
| :---------------------------------------------------------------------- | :------------------------------------- |
| [database](/influxdb/cloud-dedicated/reference/cli/influxctl/database/) | Manage InfluxDB databases              |
| [token](/influxdb/cloud-dedicated/reference/cli/influxctl/token/)       | Manage InfluxDB database tokens        |
| [version](/influxdb/cloud-dedicated/reference/cli/influxctl/version/)   | Output the current `influxctl` version |
| [help](/influxdb/cloud-dedicated/reference/cli/influxctl/help/)         | Output `influxctl` help information    |

## Global flags

| Flag        | Description                                                |
| :---------- | :--------------------------------------------------------- |
| `--debug`   | Enable debug logging                                       |
| `--profile` | Specify a connection profile to use (default is `default`) |

---

## Download and install influxctl

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

## Configure connection profiles

To connect with your InfluxDB Cloud Dedicated cluster, `influxctl` needs the
following credentials:

- InfluxDB Cloud Dedicated account ID
- InfluxDB Cloud Dedicated cluster ID

Store these credentials in a `config.toml` at a specific location based on your
operating system:

#### Profile configuration file locations

| Operating system | Profile configuration filepath                       |
| :--------------- | :---------------------------------------------------- |
| Linux            | `~/.config/influxctl/config.toml`                     |
| macOS            | `~/Library/Application Support/influxctl/config.toml` |
| Windows          | `%APPDATA%\influxctl\config.toml`                     |

#### Profile settings

In your `config.toml`, you can store _multiple_ profiles, each with a unique
name. The default profile must be named `default`.

##### Example config.toml

```toml
[default]
  account_id = "YOUR_ACCOUNT_ID"
  cluster_id = "YOUR_CLUSTER_ID"

[custom-profile-name]
  account_id = "YOUR_OTHER_ACCOUNT_ID"
  cluster_id = "YOUR_OTHER_CLUSTER_ID"
```

## Authentication

The `influxctl` CLI uses [Auth0](https://auth0.com/) to authenticate access to
your InfluxDB Cloud Dedicated cluster.
When you issue an `influxctl` command, the CLI checks for an active **Auth0** token.
If none exists, you are directed to login to **Auth0** via a browser using
credentials you should have created when setting up your InfluxDB Cloud
Dedicated cluster.
Auth0 issues a short-lived (1 hour) token that authenticates access to your
InfluxDB Cloud Dedicated cluster.
