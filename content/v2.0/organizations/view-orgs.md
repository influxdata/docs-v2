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

* Click the **Organizations** tab in the navigation bar.

    {{< img-hd src="/img/organizations-icon.png" title="Organizations icon" />}}

The list of organizations appears.


## View organizations using the influx CLI

Use the [`influx org find` command](/v2.0/reference/cli/influx/org/find)
to view organizations.

```sh
influx org find
```

Filtering options such as filtering by name or ID are available.
See the [`influx org find` documentation](/v2.0/reference/cli/influx/org/find)
for information about other available flags.
