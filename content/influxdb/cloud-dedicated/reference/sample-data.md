---
title: Sample data sets
description: >
  ...
menu:
  influxdb_cloud_dedicated:
    name: Sample data
    parent: Reference
weight: 110
---

## Home sensor

- home _(measurement)_
  - room _(tag)_
    - Kitchen
    - Living Room
  - co _(field)_
  - temp _(field)_
  - hum _(field)_

## NOAA Bay Area weather
Includes daily weather metrics from three San Francisco Bay Area airports from
**January 1, 2020 to December 31, 2022**.
This sample dataset provides a

- weather <em style="opacity: .5">(measurement)</em>
  - location <em style="opacity: .5">(tag)</em>
    - Concord
    - Hayward
    - San Francisco
  - precip <em style="opacity: .5">(field)</em>
  - temp_avg <em style="opacity: .5">(field)</em>
  - temp_max <em style="opacity: .5">(field)</em>
  - temp_min <em style="opacity: .5">(field)</em>
  - wind_avg <em style="opacity: .5">(field)</em>

#### Write the NOAA Bay Area weather data to InfluxDB

Use the InfluxDB v2 or v1 API to write the NOAA Bay Area weather sample data to
{{< cloud-name >}}.
Replace the following in the script below:

- `DATABASE_NAME`: your InfluxDB Cloud Dedicated database
- `DATABASE_TOKEN`: a [database token](/influxdb/cloud-dedicated/admin/tokens/)
  with sufficient permissions to the database

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[v2 API](#)
[v1 API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
export INFLUX_HOST=http://cluster-id.influxdb.io
export INFLUX_TOKEN=DATABASE_TOKEN

INFLUX_DATABASE=DATABASE_NAME

curl --request POST \
  "$INFLUX_HOST/api/v2/write?bucket=$INFLUX_DATABASE" \
  --header "Authorization: Bearer $INFLUX_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --header "Accept: application/json" \
  --data-binary "$(curl --request GET https://docs.influxdata.com/downloads/bay-area-weather.lp)"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
export INFLUX_HOST=http://cluster-id.influxdb.io
export INFLUX_TOKEN=DATABASE_TOKEN

INFLUX_DATABASE=DATABASE_NAME

curl --request POST \
  "$INFLUX_HOST/write?db=$INFLUX_DATABASE" \
  --header "Authorization: Bearer $INFLUX_TOKEN" \
  --header "Content-type: text/plain; charset=utf-8" \
  --data-binary "$(curl --request GET https://docs.influxdata.com/downloads/bay-area-weather.lp)"
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
