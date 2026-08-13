---
title: Use the HTTP input plugin with Citi Bike data
description: >
  Collect live metrics on Citi Bike stations in New York City with the HTTP
  input plugin and the json_v2 parser.
menu:
  telegraf_v1:
    name: Using the HTTP plugin
    parent: Input plugins
weight: 202
related:
  - /telegraf/v1/input-plugins/http/
  - /telegraf/v1/data_formats/input/json_v2/
  - /telegraf/v1/configure_plugins/input_plugins/parse-data/
---

This example walks through using the Telegraf HTTP input plugin to collect
live metrics on Citi Bike stations in New York City.
Live station data is available in JSON format directly from
[Citi Bike](https://ride.citibikenyc.com/system-data).

For the following example to work, configure an output plugin, such as the
[`influxdb_v3` output plugin](/telegraf/v1/output-plugins/influxdb_v3/).
The output plugin is what allows Telegraf to write the metrics to your
destination.

## Configure the HTTP input plugin in your Telegraf configuration file

To retrieve data from the Citi Bike URL endpoint, enable the `inputs.http`
input plugin in your Telegraf configuration file.

Specify the following options:

### `urls`

One or more URLs to read metrics from.
For this example, use
`https://gbfs.citibikenyc.com/gbfs/en/station_status.json`.

### `data_format`

The format of the data in the HTTP endpoints that Telegraf ingests.
For this example, use JSON.

## Add parser information to your Telegraf configuration

Specify the following JSON-specific options.
In this example, use the `object` subtable to gather data from
[JSON objects](/telegraf/v1/configure_plugins/input_plugins/parse-data/#parse-json-objects).

### JSON

#### `path`

To parse a JSON object, set the `path` option with a
[GJSON](https://github.com/tidwall/gjson) path.
The result of the query should contain a JSON object or an array of objects.
The [GJSON playground](https://gjson.dev/) is a very helpful tool in
checking your query.

#### `tags`

List of one or more JSON keys that should be added as tags.
For this example, use the tag key `station_id`.

#### `timestamp_key`

Key from the JSON file that creates the timestamp metric.
In this case, use the time that station data was last reported, or
`last_reported`.
If you don't specify a key, the time that Telegraf reads the data becomes
the timestamp.

#### `timestamp_format`

The format used to interpret the designated `timestamp_key`.
The `last_reported` time in this example is reported in Unix format.

#### Example configuration

```toml
[[inputs.http]]
  # URL for NYC's Citi Bike station data in JSON format
  urls = ["https://gbfs.citibikenyc.com/gbfs/en/station_status.json"]

  # Overwrite measurement name from default `http` to `citibikenyc`
  name_override = "citibike"

  # Exclude url and host items from tags
  tagexclude = ["url", "host"]

  # Data from HTTP in JSON format
  data_format = "json_v2"

  # Add a subtable to use the `json_v2` parser
  [[inputs.http.json_v2]]

    # Add an object subtable for to parse a JSON object
    [[inputs.http.json_v2.object]]

      # Parse data in `data.stations` path only
      path = "data.stations"

      # Set station metadata as tags
      tags = ["station_id"]

      # Latest station information reported at `last_reported`
      timestamp_key = "last_reported"

      # Time is reported in unix timestamp format
      timestamp_format = "unix"
```

## Start Telegraf and verify data appears

[Start Telegraf](/telegraf/v1/get-started/#start-telegraf) using the
configuration file.

To test that the data is being sent to your output, run the following
command, replacing `telegraf.conf` with the path to your configuration
file:

<!--pytest.mark.skip-->

```bash
telegraf --config ~/telegraf.conf --test
```

This command should return line protocol that looks similar to the
following:

```text
citibike,station_id=4703 eightd_has_available_keys=false,is_installed=1,is_renting=1,is_returning=1,legacy_id="4703",num_bikes_available=6,num_bikes_disabled=2,num_docks_available=26,num_docks_disabled=0,num_ebikes_available=0,station_status="active" 1641505084000000000
citibike,station_id=4704 eightd_has_available_keys=false,is_installed=1,is_renting=1,is_returning=1,legacy_id="4704",num_bikes_available=10,num_bikes_disabled=2,num_docks_available=36,num_docks_disabled=0,num_ebikes_available=0,station_status="active" 1641505084000000000
citibike,station_id=4711 eightd_has_available_keys=false,is_installed=1,is_renting=1,is_returning=1,legacy_id="4711",num_bikes_available=9,num_bikes_disabled=0,num_docks_available=36,num_docks_disabled=0,num_ebikes_available=1,station_status="active" 1641505084000000000
```
