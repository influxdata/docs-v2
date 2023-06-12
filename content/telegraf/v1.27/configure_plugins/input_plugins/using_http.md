---
title: Using the HTTP input plugin with Citi Bike data
description: Collect live metrics on Citi Bike stations in New York City with the HTTP input plugin.
menu:
  telegraf_1_27:

    name: Using the HTTP plugin
    weight: 30
    parent: Input plugins
---

This example walks through using the Telegraf HTTP input plugin to collect live metrics on Citi Bike stations in New York City. Live station data is available in JSON format directly from [Citi Bike](https://ride.citibikenyc.com/system-data).

For the following example to work, configure [`influxdb_v2` output plugin](/telegraf/v1.27/plugins/#output-influxdb_v2). This plugin is what allows Telegraf to write the metrics to InfluxDB.

## Configure the HTTP Input plugin in your Telegraf configuration file

To retrieve data from the Citi Bike URL endpoint, enable the `inputs.http` input plugin in your Telegraf configuration file.

Specify the following options:

### `urls`
One or more URLs to read metrics from. For this example,  use `https://gbfs.citibikenyc.com/gbfs/en/station_status.json`.

### `data_format`
The format of the data in the HTTP endpoints that Telegraf will ingest. For this example, use JSON.


## Add parser information to your Telegraf configuration

Specify the following JSON-specific options. In this example, we use the objects subtable to gather
data from [JSON Objects](https://www.w3schools.com/js/js_json_objects.asp).

### JSON

#### `path`
To parse a JSON object, set the `path` option with a [GJSON](https://github.com/tidwall/gjson) path. The result of the query should contain a JSON object or an array of objects. The [GJSON playground](https://gjson.dev/) is a very helpful tool in checking your query.

#### `tags`
List of one or more JSON keys that should be added as tags. For this example, we'll use the tag key `station_id`.

#### `timestamp_key`
Key from the JSON file that creates the timestamp metric. In this case, we want to use the time that station data was last reported, or the `last_reported`. If you don't specify a key, the time that Telegraf reads the data becomes the timestamp.

#### `timestamp_format`
The format used to interpret the designated `timestamp_key`. The `last_reported` time in this example is reported in unix format.

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

                #Set station metadata as tags
                tags = ["station_id"]

                # Latest station information reported at `last_reported`
                timestamp_key = "last_reported"

                # Time is reported in unix timestamp format
                timestamp_format = "unix"
  ```



## Start Telegraf and verify data appears

[Start the Telegraf service](/telegraf/v1.27/get_started/#start-telegraf).

To test that the data is being sent to InfluxDB, run the following (replacing `telegraf.conf` with the path to your configuration file):

```
telegraf -config ~/telegraf.conf -test
```

This command should return line protocol that looks similar to the following:

```
citibike,station_id=4703 eightd_has_available_keys=false,is_installed=1,is_renting=1,is_returning=1,legacy_id="4703",num_bikes_available=6,num_bikes_disabled=2,num_docks_available=26,num_docks_disabled=0,num_ebikes_available=0,station_status="active" 1641505084000000000
citibike,station_id=4704 eightd_has_available_keys=false,is_installed=1,is_renting=1,is_returning=1,legacy_id="4704",num_bikes_available=10,num_bikes_disabled=2,num_docks_available=36,num_docks_disabled=0,num_ebikes_available=0,station_status="active" 1641505084000000000
citibike,station_id=4711 eightd_has_available_keys=false,is_installed=1,is_renting=1,is_returning=1,legacy_id="4711",num_bikes_available=9,num_bikes_disabled=0,num_docks_available=36,num_docks_disabled=0,num_ebikes_available=1,station_status="active" 1641505084000000000
```

Now, you can explore and query the Citi Bike data in InfluxDB. The example below is an Flux query and visualization showing the number of available bikes over the past 15 minutes.

![Citi Bike visualization](/img/telegraf/new-citibike-query.png)
