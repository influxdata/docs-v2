---
title: View tokens
seotitle: View API tokens in InfluxDB
description: View API tokens in InfluxDB using the InfluxDB UI or the `influx` CLI.
aliases:
  - /influxdb/v2.0/users/tokens/view-tokens
menu:
  influxdb_2_0:
    name: View tokens
    parent: Manage tokens
weight: 202
---

View API tokens using the InfluxDB user interface (UI) or the `influx`
command line interface (CLI).

{{% note %}}
Tokens are visible only to the user who created them and stop working when the user is deactivated. We recommend creating a generic IT user to create and manage tokens for writing data.
{{% /note %}}

## View tokens in the InfluxDB UI

1. In the navigation menu on the left, select **Data (Load Data)** > **Tokens**.

    {{< nav-icon "disks" >}}

2. Click a token name from the list to view the token and a summary of access permissions.

## View tokens using the influx CLI

Use the [`influx auth list` command](/influxdb/v2.0/reference/cli/influx/auth/list)
to view tokens.

```sh
influx auth list
```

Filtering options such as filtering by authorization ID, username, or user ID are available.
See the [`influx auth list` documentation](/influxdb/v2.0/reference/cli/influx/auth/list)
for information about other available flags.
