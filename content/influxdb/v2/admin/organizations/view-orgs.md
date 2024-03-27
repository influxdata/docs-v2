---
title: View organizations
seotitle: View organizations in InfluxDB
description: Review a list of organizations in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_v2:
    name: View organizations
    parent: Manage organizations
weight: 102
aliases:
  - /influxdb/v2/organizations/view-orgs/
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to view organizations.

## View organizations in the InfluxDB UI

1. In the navigation menu on the left, click the **Account dropdown**.

    {{< nav-icon "account" >}}

2. Select **Switch Organizations**. The list of organizations appears.

## View organizations using the influx CLI

Use the [`influx org list` command](/influxdb/v2/reference/cli/influx/org/list)
to view organizations. Provide the following:

- An [operator token](/influxdb/v2/admin/tokens/#operator-token) using your
  [`influx` CLI connection configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials),
  `INFLUX_TOKEN` environment variable, or the `--token, -t` flag.

```sh
influx org list
```

Filtering options such as filtering by name or ID are available.
See the [`influx org list` documentation](/influxdb/v2/reference/cli/influx/org/list)
for information about other available flags.

## View your organization ID

Use the InfluxDB UI or `influx` CLI to view your organization ID.

### Organization ID in the UI

After logging in to the InfluxDB UI, your organization ID appears in the URL.

{{< code-callout "03a2bbf46249a000" >}}
```sh
http://localhost:8086/orgs/03a2bbf46249a000/...
```
{{< /code-callout >}}


### Organization ID in the CLI

Use [`influx org list`](#view-organizations-using-the-influx-cli) to view your
organization ID. Provide the following:

- An [operator token](/influxdb/v2/admin/tokens/#operator-token) using your
  [`influx` CLI connection configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials),
  `INFLUX_TOKEN` environment variable, or the `--token, -t` flag.

```sh
influx org list
```

The command returns output similar to:

```
ID                  Name
03a2bbf46249a000    org-1
03ace3a859669000    org-2
```
