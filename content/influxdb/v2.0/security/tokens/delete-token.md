---
title: Delete a token
seotitle: Delete an API token from InfluxDB
description: Delete an API token from InfluxDB using the InfluxDB UI or the `influx` CLI.
aliases:
  - /influxdb/v2.0/users/tokens/delete-token
menu:
  influxdb_2_0:
    name: Delete a token
    parent: Manage tokens
weight: 204
---

Delete API tokens from the InfluxDB user interface (UI) or the `influx` command line interface (CLI).
Once deleted, all users and external integrations using the API token will no longer
have access to your InfluxDB instance.

## Delete tokens in the InfluxDB UI

1. In the navigation menu on the left, select **Data (Load Data)** > **Tokens**.

    {{< nav-icon "load-data" "v2" >}}

2. Hover over the token you want to delete and click **Delete** and **Confirm**.

## Delete tokens using the influx CLI

Use the [`influx auth delete` command](/influxdb/v2.0/reference/cli/influx/auth/delete)
to delete a token.

_This command requires an auth ID, which is available in the output of `influx auth find`._

```sh
# Syntax
influx auth delete -i <auth-id>

# Example
influx auth delete -i 03a2bee5a9c9a000
```
