---
title: InfluxDB tools
description: Tools and utilities for interacting with InfluxDB.
aliases:
    - /influxdb/v1/clients/
    - /influxdb/v1/write_protocols/json/
    - /influxdb/v1/tools/flux-vscode/
menu:
  influxdb_v1:
    name: Tools
    weight: 60
alt_links:
  v2: /influxdb/v2/tools/
prepend: |
  > [!Important]
  > #### Flux VS Code extension no longer available
  >
  > The `vsflux` extension is no longer available in the Visual Studio Marketplace.
  >  `vsflux` and the `flux-lsp` Flux Language Server Protocol plugin are no longer maintained.
  > Their repositories have been archived and are no longer receiving updates.
---

This section covers the available tools for interacting with InfluxDB.

## `influx` command line interface (CLI)

The [InfluxDB command line interface (`influx`)](/influxdb/v1/tools/influx-cli/)
includes commands to manage many aspects of InfluxDB, including databases, organizations, users, and tasks.

## `influxd` command

The [`influxd` command](/influxdb/v1/tools/influxd) starts and runs all the processes necessary for InfluxDB to function.

## InfluxDB API client libraries

The list of [client libraries](/influxdb/v1/tools/api_client_libraries/) for interacting with the InfluxDB API.

## Influx Inspect disk shard utility

[Influx Inspect](/influxdb/v1/tools/influx_inspect/) is a tool designed to view detailed information about on disk shards, as well as export data from a shard to line protocol that can be inserted back into the database.

## InfluxDB inch tool

Use the [InfluxDB `inch` tool](/influxdb/v1/tools/inch/) to test InfluxDB performance. Adjust metrics such as the batch size, tag values, and concurrent write streams to test how ingesting different tag cardinalities and metrics affects performance.


## Graphs and dashboards

Use [Chronograf](/chronograf/v1/) or [Grafana](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/) dashboards to visualize your time series data.

> **Tip:** Use template variables in your dashboards to filter meta query results by a specified period of time (see example below).

### Filter meta query results using template variables

The example below shows how to filter hosts retrieving data in the past hour.

##### Example

```sh
# Create a retention policy.
CREATE RETENTION POLICY "lookup" ON "prod" DURATION 1d REPLICATION 1

# Create a continuous query that groups by the tags you want to use in your template variables.
CREATE CONTINUOUS QUERY "lookupquery" ON "prod" BEGIN SELECT mean(value) as value INTO "your.system"."host_info" FROM "cpuload"
WHERE time > now() - 1h GROUP BY time(1h), host, team, status, location END;

# In your Grafana or Chronograf templates, include your tag values.
SHOW TAG VALUES FROM "your.system"."host_info" WITH KEY = “host”
```

> **Note:** In Chronograf, you can also filter meta query results for a specified time range by [creating a `custom meta query` template variable](/chronograf/v1/guides/dashboard-template-variables/#create-custom-template-variables) and adding a time range filter.

## Flux tools

> [!NOTE]
> #### vsflux and Flux-LSP no longer maintained
>
> The `vsflux` Flux VS Code extension and the `flux-lsp` language server plugin for Vim are no longer maintained.
> Their repositories have been archived and are no longer receiving updates.
> `vsflux` is no longer available in the Visual Studio Marketplace.
