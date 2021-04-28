---
title: Create a token
seotitle: Create an authentication token in InfluxDB
description: Create an authentication token in InfluxDB using the InfluxDB UI or the `influx` CLI.
aliases:
  - /influxdb/v2.0/users/tokens/create-token/
menu:
  influxdb_2_0:
    name: Create a token
    parent: Manage tokens
weight: 201
---

Create authentication tokens using the InfluxDB user interface (UI) or the `influx`
command line interface (CLI).

Tokens are visible only to the user who created them and stop working when the user is deactivated. We recommend creating a generic IT user to create and manage tokens for writing data.

## Create a token in the InfluxDB UI

1. In the navigation menu on the left, select **Data (Load Data)** > **Tokens**.

    {{< nav-icon "disks" >}}

2. Click **{{< icon "plus" >}} Generate** and select a token type
   (**Read/Write Token** or **All Access Token**).
3. In the window that appears, enter a description for your token in the **Description** field.
4. If generating a **read/write token**:
    - Search for and select buckets to read from in the **Read** pane.
    - Search for and select buckets to write to in the **Write** pane.
5. Click **Save**.

## Create a token using the influx CLI

Use the [`influx auth create` command](/influxdb/v2.0/reference/cli/influx/auth/create) to create a token.
Include flags with the command to grant specific permissions to the token.
See the [available flags](/influxdb/v2.0/reference/cli/influx/auth/create#flags).

```sh
# Syntax
influx auth create -o <org-name> [permission-flags]

# Example
influx auth create -o my-org \
  --read-bucket 03a2bbf46309a000 \
  --read-bucket 3a87c03ace269000 \
  --read-dashboards \
  --read-tasks \
  --read-telegrafs \
  --read-user
```

Filtering options such as filtering by authorization ID, username, or user ID are available.
See the [`influx auth list` documentation](/influxdb/v2.0/reference/cli/influx/auth/list)
for information about other available flags.
