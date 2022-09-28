---
title: View organization
seotitle: View organization in InfluxDB
description: Review a list of organizations in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_cloud:
    name: View organizations
    parent: Manage organizations
weight: 102
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to view organizations.

## View organizations using the influx CLI

Use the [`influx org list` command](/influxdb/cloud/reference/cli/influx/org/list)
to view organizations.

```sh
influx org list
```

Filtering options such as filtering by name or ID are available.
See the [`influx org list` documentation](/influxdb/cloud/reference/cli/influx/org/list)
for information about other available flags.

## View your organization ID

Use the InfluxDB UI or `influx` CLI to view your organization ID.

### Organization ID in the UI

After logging in to the InfluxDB UI, your organization ID appears in the URL.

{{< code-callout "03a2bbf46249a000" >}}
```sh
https://cloud2.influxdata.com/orgs/03a2bbf46249a000/...
```
{{< /code-callout >}}

### Organization ID in the CLI

Use [`influx org list`](#view-organizations-using-the-influx-cli) to view your organization ID.

```sh
> influx org list

ID                  Name
03a2bbf46249a000    org-1
03ace3a859669000    org-2
```
