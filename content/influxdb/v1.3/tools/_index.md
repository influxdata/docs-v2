---
title: InfluxDB tools
aliases:
    - influxdb/v1.3/clients/
    - influxdb/v1.3/write_protocols/json/
menu:
  influxdb_1_3:
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

* [Launching `influx`](/influxdb/v1.3/tools/shell/#launch-influx)
* [Writing data with `influx`](/influxdb/v1.3/tools/shell/#write-data-to-influxdb-with-insert)

## API Reference

Reference documentation for InfluxDB's HTTP API.

Go straight to the reference documentation on:

* [Writing data with the HTTP API](/influxdb/v1.3/tools/api/#write)
* [Querying data with the HTTP API](/influxdb/v1.3/tools/api/#query)

For friendlier documentation, see the guides on
[writing data](/influxdb/v1.3/guides/writing_data/) and
[querying data](/influxdb/v1.3/guides/querying_data/) with the HTTP API.

## API Client Libraries

The list of [client libraries](/influxdb/v1.3/tools/api_client_libraries/) for interacting with InfluxDB.

## Web Admin Interface

In version 1.3, the web admin interface is no longer available in InfluxDB.
The interface does not run on port `8083` and InfluxDB ignores the `[admin]` section in the configuration file if that section is present.
[Chronograf](/chronograf/v1.3/) replaces the web admin interface with improved tooling for querying data, writing data, and database management.
See [Chronograf's transition guide](/chronograf/v1.3/guides/transition-web-admin-interface/) for more information.

## Influx Inspect

[Influx Inspect](/influxdb/v1.3/tools/influx_inspect/) is a tool designed to view detailed information about on disk shards, as well as export data from a shard to line protocol that can be inserted back into the database.

## Grafana Graphs and Dashboards

[Grafana](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/)
is a convenient dashboard tool for visualizing time series data.
It was originally built for Graphite, modeled after Kibana, and since been updated to support InfluxDB.

{{% warn %}}
Because of the [changes](/influxdb/v0.11/concepts/010_vs_011/#breaking-api-changes) to the `SHOW SERIES` and `SHOW TAG VALUES` formats in InfluxDB 0.11, InfluxDB 1.3 will not work with the Query Editor in Grafana 2.6.
This issue does not affect existing queries and dashboards or users working with Grafana 3.0.
{{% /warn %}}

## Service Plugins

InfluxDB accepts writes over
[UDP](https://github.com/influxdata/influxdb/blob/master/services/udp/README.md)
and provides an easy way to set up
[Graphite](https://github.com/influxdata/influxdb/blob/master/services/graphite/README.md),
[CollectD](https://github.com/influxdata/influxdb/blob/master/services/collectd/README.md),
and [OpenTSDB](https://github.com/influxdb/influxdb/blob/1.3/services/opentsdb/README.md) as input sources.
