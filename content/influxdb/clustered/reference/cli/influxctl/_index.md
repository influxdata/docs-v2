---
title: influxctl
list_title: influxctl
description: >
  The `influxctl` command line interface (CLI) performs administrative tasks in
  an InfluxDB cluster.
menu:
  influxdb_clustered:
    name: influxctl
    parent: CLIs
weight: 101
influxdb/clustered/tags: [cli]
---

The `influxctl` command line interface (CLI) performs administrative tasks in
an InfluxDB cluster.

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
| [database](/influxdb/clustered/reference/cli/influxctl/database/) | Manage InfluxDB databases              |
| [token](/influxdb/clustered/reference/cli/influxctl/token/)       | Manage InfluxDB database tokens        |
| [version](/influxdb/clustered/reference/cli/influxctl/version/)   | Output the current `influxctl` version |
| [help](/influxdb/clustered/reference/cli/influxctl/help/)         | Output `influxctl` help information    |

## Global flags

| Flag        | Description                                                |
| :---------- | :--------------------------------------------------------- |
| `--debug`   | Enable debug logging                                       |
| `--profile` | Specify a connection profile to use (default is `default`) |

---

## Download and install influxctl

_[Contact InfluxData Support](https://support.influxdata.com) for
information about downloading and installing the `influxctl` CLI._

## Configure connection profiles

To connect with your InfluxDB cluster, `influxctl` needs the
following credentials:

- InfluxDB Clustered account ID
- InfluxDB cluster ID

Use the [`influxctl init` command](/influxdb/clustered/reference/cli/influxctl/init)
to start an interactive prompt that creates and stores the required credentials
as a **connection profile**.

```sh
influxctl init
```

### Connection profile store location

The `influxctl` CLI stores connection profiles in a `config.toml` file at a specific
location based on your operating system:

#### Profile configuration file locations

| Operating system | Profile configuration filepath                        |
| :--------------- | :---------------------------------------------------- |
| Linux            | `~/.config/influxctl/config.toml`                     |
| macOS            | `~/Library/Application Support/influxctl/config.toml` |
| Windows          | `%APPDATA%\influxctl\config.toml`                     |

## Authentication

The `influxctl` CLI uses [Auth0](https://auth0.com/) to authenticate access to
your InfluxDB cluster.
When you issue an `influxctl` command, the CLI checks for an active **Auth0** token.
If none exists, you are directed to login to **Auth0** via a browser using
credentials you should have created when setting up your InfluxDB Cloud
Dedicated cluster.
Auth0 issues a short-lived (1 hour) token that authenticates access to your
InfluxDB cluster.
