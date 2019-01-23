---
title: View tokens
seotitle: View authentication tokens in InfluxDB
description: View authentication tokens in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  v2_0:
    name: View tokens
    parent: Manage tokens
    weight: 2
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to view tokens.

## View tokens in the InfluxDB UI

1. Click the **Influx** icon in the navigation bar.
2. In the right panel labeled **My Settings**, click **Tokens**. All of your account's tokens appear.
3. Click on a token name from the list to view the token and a summary of access permissions.

## View tokens using the influx CLI

Use the [`influx auth find` command](/v2.0/reference/cli/influx/auth/find)
to view tokens.

```sh
influx auth find
```

Filtering options such as filtering by authorization ID, username, or user ID are available.
See the [`influx auth find` documentation](/v2.0/reference/cli/influx/auth/find)
for information about other available flags.
