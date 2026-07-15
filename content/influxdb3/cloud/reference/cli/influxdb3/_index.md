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

<!-- TODO: Publish the full influxdb3 CLI reference for InfluxDB 3 Cloud. -->

Because {{% product-name %}} runs the same InfluxDB 3 engine as
InfluxDB 3 Enterprise, the `influxdb3` CLI behaves the same (except for
server-management commands such as `serve`, which InfluxData manages for you).
For full command syntax, see the
[InfluxDB 3 Enterprise `influxdb3` CLI reference](/influxdb3/enterprise/reference/cli/influxdb3/).
