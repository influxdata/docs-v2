---
title: Collect JSON data from an HTTP API
description: >
  Use the Telegraf HTTP input plugin and the json_v2 parser to collect live
  JSON data from a REST API, using New York City's Citi Bike station data
  as the example.
menu:
  telegraf_v1:
    name: Collect JSON from an HTTP API
    parent: Configuration examples
weight: 103
aliases:
  - /telegraf/v1/configure_plugins/input_plugins/using_http/
related:
  - /telegraf/v1/input-plugins/http/
  - /telegraf/v1/data_formats/input/json_v2/
  - /telegraf/v1/configure_plugins/input_plugins/parse-data/
---

Poll a REST API on an interval, parse the JSON response into metrics, and
write them to InfluxDB 3.
This example collects live station status from
[Citi Bike](https://ride.citibikenyc.com/system-data), New York City's
public bike-share system, which publishes JSON without authentication.

## Configuration

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[inputs.http]]
  ## URL for NYC's Citi Bike station data in JSON format
  urls = ["https://gbfs.citibikenyc.com/gbfs/en/station_status.json"]

  ## Overwrite measurement name from default `http` to `citibike`
  name_override = "citibike"

  ## Exclude url and host items from tags
  tagexclude = ["url", "host"]

  ## Parse the JSON response with the json_v2 parser
  data_format = "json_v2"

  [[inputs.http.json_v2]]
    [[inputs.http.json_v2.object]]
      ## Parse data in the `data.stations` path only
      path = "data.stations"

      ## Set station metadata as tags
      tags = ["station_id"]

      ## Latest station information reported at `last_reported`
      timestamp_key = "last_reported"

      ## Time is reported as a Unix timestamp
      timestamp_format = "unix"

[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your InfluxDB authorization token
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the database to write to

## How it works

- **`urls`** lists the endpoints to poll.
  The plugin requests each URL on every collection interval.
  For authenticated APIs, the `http` plugin supports header, basic-auth,
  token, and OAuth 2.0 options.
- **`name_override`** replaces the default `http` measurement name with
  `citibike`.
- **`tagexclude`** drops the `url` and `host` tags the plugin adds by
  default, which aren't useful for this data.
- **The `json_v2` object table** selects the `data.stations` array.
  Each element of the array becomes one metric.
  The `station_id` key becomes a tag, `last_reported` becomes the metric
  timestamp, and every other key becomes a field.
  To build the `path` for your own API, test a
  [GJSON path](https://gjson.dev/) against a sample response.
  For parser details, see
  [Parse JSON objects](/telegraf/v1/configure_plugins/input_plugins/parse-data/#parse-json-objects).

## Test the configuration

Run a single collection and print the results without writing them:

<!--pytest.mark.skip-->

```bash
telegraf --config citibike.conf --test
```

## Example output

```text
citibike,station_id=4703 eightd_has_available_keys=false,is_installed=1,is_renting=1,is_returning=1,legacy_id="4703",num_bikes_available=6,num_bikes_disabled=2,num_docks_available=26,num_docks_disabled=0,num_ebikes_available=0,station_status="active" 1641505084000000000
citibike,station_id=4704 eightd_has_available_keys=false,is_installed=1,is_renting=1,is_returning=1,legacy_id="4704",num_bikes_available=10,num_bikes_disabled=2,num_docks_available=36,num_docks_disabled=0,num_ebikes_available=0,station_status="active" 1641505084000000000
citibike,station_id=4711 eightd_has_available_keys=false,is_installed=1,is_renting=1,is_returning=1,legacy_id="4711",num_bikes_available=9,num_bikes_disabled=0,num_docks_available=36,num_docks_disabled=0,num_ebikes_available=1,station_status="active" 1641505084000000000
```

## Extend this example

- Poll multiple endpoints by adding URLs to `urls`, or add a second
  `[[inputs.http]]` instance with different parser settings.
- If your API reports flat JSON, the simpler
  [JSON input data format](/telegraf/v1/data_formats/input/json/) may be
  all you need.
  For deeply nested or array-heavy responses, see the
  [XPath JSON input data format](/telegraf/v1/data_formats/input/xpath_json/).
