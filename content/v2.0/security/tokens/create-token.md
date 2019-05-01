---
title: Create a token
seotitle: Create an authentication token in InfluxDB
description: Create an authentication token in InfluxDB using the InfluxDB UI or the `influx` CLI.
aliases:
  - /v2.0/users/tokens/create-token/
menu:
  v2_0:
    name: Create a token
    parent: Manage tokens
weight: 201
---

Create authentication tokens using the InfluxDB user interface (UI) or the `influx`
command line interface (CLI).

## Create a token in the InfluxDB UI

1. Click the **Settings** icon in the navigation bar.

    {{< nav-icon "settings" >}}

2. Click **Tokens**.
3. Click the **+ Generate** dropdown in the upper right and select a token type (**Read/Write Token** or **All Access Token**).
4. In the window that appears, enter a description for your token in the **Description** field.
5. If you're generating a read/write token:
    - Search for and select buckets to read from in the **Read** pane.
    - Search for and select buckets to write to in the **Write** pane.
5. Click **Save**.

## Create a token using the influx CLI

Use the [`influx auth create` command](/v2.0/reference/cli/influx/auth/create) to create a token.
Include flags with the command to grant specific permissions to the token.
See the [available flags](/v2.0/reference/cli/influx/auth/create#flags).

```sh
# Pattern
influx auth create -o <org-name> [permission-flags]

# Example
influx auth create -o my-org \
  --read-buckets 03a2bbf46309a000 03ace3a87c269000 \
  --read-dashboards \
  --read-tasks \
  --read-telegrafs \
  --read-user
```

Filtering options such as filtering by authorization ID, username, or user ID are available.
See the [`influx auth find` documentation](/v2.0/reference/cli/influx/auth/find)
for information about other available flags.
