---
title: influxdb3 CLI
list_title: influxdb3
seotitle: influxdb3 CLI | {{% product-name %}}
description: >
  The `influxdb3` CLI writes and queries data and administers your
  {{% product-name %}} instance from the command line.
menu:
  influxdb3_cloud:
    parent: Reference
    name: influxdb3 CLI
weight: 102
related:
  - /influxdb3/cloud/get-started/setup/
---

The `influxdb3` CLI writes and queries data and administers your
{{% product-name %}} instance from the command line.
Because {{% product-name %}} is fully managed, the CLI connects to your hosted
instance instead of running a local server.

## Connect and authenticate

The CLI connects to `http://127.0.0.1:8181` by default. Before you run commands,
set your instance host and authenticate:

- **Host**: Set the `INFLUXDB3_HOST_URL` environment variable, or pass `--host`,
  to your instance host URL.
- **Authentication**:
  - For interactive use, log in with the OAuth device-code flow:
    `influxdb3 auth login --oauth`. Don't set `INFLUXDB3_AUTH_TOKEN` for
    interactive use.
  - For applications and automated clients, use a database token: set the
    `INFLUXDB3_AUTH_TOKEN` environment variable, or pass `--token`.

For setup steps, see
[Set up {{% product-name %}}](/influxdb3/cloud/get-started/setup/#configure-the-influxdb3-cli).

## Commonly used commands

- `influxdb3 create database`: Create a database
- `influxdb3 create token --admin`: Create a named admin token
- `influxdb3 create token --permission`: Create a scoped database token
- `influxdb3 show tokens`: List tokens
- `influxdb3 delete token`: Delete a token
- `influxdb3 write`: Write data to a database
- `influxdb3 query`: Query data in a database

## Not available in {{% product-name %}}

{{% product-name %}} is built on the InfluxDB 3 Enterprise engine, but InfluxData
manages the server and exposes only a subset of the Enterprise API.
The CLI subcommands documented in this section are supported.
Other `influxdb3` subcommands that work with Enterprise might not work with
{{% product-name %}}.
The following commands don't work or don't apply:

| Command | Reason or alternative |
| :------ | :-------------------- |
| `influxdb3 serve` | InfluxData runs the server for you. |
| `influxdb3 stop node`, `influxdb3 remove node` | InfluxData manages cluster nodes. |
| `influxdb3 create user`, `influxdb3 update user`, `influxdb3 update user-roles`, `influxdb3 delete user`, `influxdb3 show users` | [Manage users and roles in the Admin UI](/influxdb3/cloud/admin/users/admin-ui/). |
| `influxdb3 install package` | Package installation is disabled. |
| `influxdb3 create trigger` with `--upload`, or with a `gh:` plugin path | You can't upload plugins or fetch them from a plugin repository. Use `--path` with the filename of a preinstalled plugin. |
| `influxdb3 create trigger` with a `table:`, `all_tables`, or `request:` trigger spec | Only `every:` and `cron:` (schedule) triggers are allowed. |
| `influxdb3 create file_index`, `influxdb3 delete file_index` | The file index API isn't available. |
| `influxdb3 create query_group`, `influxdb3 update query_group`, `influxdb3 delete query_group`, `influxdb3 show query_groups` | The query group API isn't available. |
| `influxdb3 loadcap` commands | The load capture API isn't available. |
