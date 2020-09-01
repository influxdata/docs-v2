---
title: InfluxDB tools
aliases:
    - influxdb/v1.4/clients/
    - influxdb/v1.4/write_protocols/json/
menu:
  influxdb_1_4:
    name: Tools
    weight: 60
---

This section covers the available tools for interacting with InfluxDB.

## CLI/Shell

InfluxDB's Command Line Interface (`influx`) is an interactive shell for the
HTTP API that comes with every InfluxDB package.
Use `influx` to write data (manually or from a file), query data interactively,
and view query output in different formats:

![CLI GIF](/img/influxdb/1-3-cli-1-0-beta.gif)

Go straight to the documentation on:

* [Launching `influx`](/influxdb/v1.4/tools/shell/#launch-influx)
* [Writing data with `influx`](/influxdb/v1.4/tools/shell/#write-data-to-influxdb-with-insert)

## API Reference

Reference documentation for [InfluxDB's HTTP API](/influxdb/v1.4/tools/api/).

Go straight to the reference documentation on:

* [Writing data with the HTTP API](/influxdb/v1.4/tools/api/#write)
* [Querying data with the HTTP API](/influxdb/v1.4/tools/api/#query)

For friendlier documentation, see the guides on
[writing data](/influxdb/v1.4/guides/writing_data/) and
[querying data](/influxdb/v1.4/guides/querying_data/) with the HTTP API.

## API client libraries

The list of [client libraries]((/influxdb/v1.4/tools/api_client_libraries/)) for interacting with InfluxDB.

## Influx Inspect

[Influx Inspect](/influxdb/v1.4/tools/influx_inspect/) is a tool designed to view
detailed information about on disk shards, as well as export data from a shard to
line protocol that can be inserted back into the database.

## Grafana graphs and dashboards

[Grafana](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/)
is a convenient dashboard tool for visualizing time series data.
It was originally built for Graphite, modeled after Kibana, and since been updated to support InfluxDB.

{{% warn %}} Because of the [changes](/influxdb/v0.11/concepts/010_vs_011/#breaking-api-changes) to the `SHOW SERIES` and `SHOW TAG VALUES` formats in InfluxDB 0.11, InfluxDB 1.3+ will not work with the Query Editor in Grafana 2.6.
This issue does not affect existing queries and dashboards or users working with Grafana 3.0. {{% /warn %}}
