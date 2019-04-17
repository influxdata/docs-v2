---
title: View organizations
seotitle: View organizations in InfluxDB
description: Review a list of organizations in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  v2_0:
    name: View organizations
    parent: Manage organizations
weight: 102
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to view organizations.

## View organizations in the InfluxDB UI

*  Click the **Influx** icon in the navigation bar.

    {{< nav-icon "admin" >}}

* Select **Switch Organizations**. The list of organizations appears.


## View organizations using the influx CLI

Use the [`influx org find` command](/v2.0/reference/cli/influx/org/find)
to view organizations.

```sh
influx org find
```

Filtering options such as filtering by name or ID are available.
See the [`influx org find` documentation](/v2.0/reference/cli/influx/org/find)
for information about other available flags.

## View your organization ID
Use the InfluxDB UI or `influx` CLI to see your organization ID.

### Organization ID in the UI
Your organization ID is in the InfluxDB UI URL after logging in.

```sh
# Pattern
http://localhost:9999/orgs/<org-id>

# Example
http://localhost:9999/orgs/03a2bbf46249a000
```

### Organization ID in the CLI
View your organization ID in the output [`influx org find`](#view-organizations-using-the-influx-cli).

```sh
ID			           Name
03a2bbf46249a000	 org-1
03ace3a859669000	 org-2
```
