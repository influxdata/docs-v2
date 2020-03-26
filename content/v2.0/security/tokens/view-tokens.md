---
title: View tokens
seotitle: View authentication tokens in InfluxDB
description: View authentication tokens in InfluxDB using the InfluxDB UI or the `influx` CLI.
aliases:
  - /v2.0/users/tokens/view-tokens
menu:
  v2_0:
    name: View tokens
    parent: Manage tokens
weight: 202
---

View authentication tokens using the InfluxDB user interface (UI) or the `influx`
command line interface (CLI).

## View tokens in the InfluxDB UI

1. Click the **Load Data** icon in the navigation bar.

    {{< nav-icon "disks" >}}

2. Click **Tokens**. All of your account's tokens appear.
3. Click a token name from the list to view the token and a summary of access permissions.

## View tokens using the influx CLI

Use the [`influx auth list` command](/v2.0/reference/cli/influx/auth/list)
to view tokens.

```sh
influx auth list
```

Filtering options such as filtering by authorization ID, username, or user ID are available.
See the [`influx auth list` documentation](/v2.0/reference/cli/influx/auth/list)
for information about other available flags.
