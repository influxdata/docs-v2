---
title: Forecast time series data
seotitle: Forecast time series data with InfluxDB 3 Explorer
description: >
  Use InfluxDB 3 Explorer and the Chronos forecasting plugin to continue Line
  and Area chart series past the current time, check how far to trust a
  forecast, and keep forecasts up to date on dashboards.
menu:
  influxdb3_explorer:
    name: Forecast data
    parent: Visualize data
weight: 103
metadata: [Explorer v1.12+]
related:
  - /influxdb3/explorer/visualize-data/chart-options/
  - /influxdb3/explorer/dashboards/
  - /influxdb3/explorer/manage-plugins/plugin-library/
  - /influxdb3/enterprise/plugins/library/official/chronos-forecasting/, Chronos forecasting plugin
---

{{% product-name %}} can continue the series of a Line or Area chart past the
current time.
For each series, Explorer draws a forecast with shaded ranges, checks how well
it would have predicted your recent data, and tells you when the series could
reach a threshold.

Forecasts run on your InfluxDB 3 server in the
[Processing Engine](/influxdb3/enterprise/plugins/), with the
[Chronos forecasting plugin](/influxdb3/enterprise/plugins/library/official/chronos-forecasting/).
Nothing is trained, and your data stays on the server.

- [Requirements](#requirements)
- [Turn on forecasting](#turn-on-forecasting)
- [Forecast a chart](#forecast-a-chart)
- [Read a forecast](#read-a-forecast)
- [Change forecast settings](#change-forecast-settings)
- [Keep forecasts on dashboards](#keep-forecasts-on-dashboards)
- [Limitations](#limitations)

## Requirements

- **The Processing Engine**: the InfluxDB 3 server must be started with a
  plugin directory (`--plugin-dir`).
- **Admin access**: an admin token, or a user with the **Admin** role.
  Other roles can't forecast, because the plugin reads data with the
  Processing Engine's access, not yours.
- **Admin mode**: Explorer in
  [query mode](/influxdb3/explorer/install/docker/#choose-operational-mode)
  can't forecast.
- **A SQL query**: InfluxQL charts can't be forecast.

## Turn on forecasting

Turn on forecasting once per server.
Explorer installs the Chronos plugin and its Python packages, and adds a
Processing Engine trigger to each database you forecast.

> [!Warning]
> #### The server might stop responding during installation
>
> The Python packages are about 1 GB (several GB on Linux).
> Until the installation finishes, the server might not answer queries or
> writes.
> Turn on forecasting outside busy hours.

1.  On a Line or Area chart, click **Forecast**, and then click **Turn on…**.
    You can also click **Turn on…** on the Chronos card in
    **Manage Plugins** > **Plugin Library**.
2.  Select a model:
    - **Fast** _(default)_: Chronos-Bolt (tiny), a 35 MB download.
    - **Most accurate**: Chronos-2, about a 480 MB download.
3.  Click **Turn on**.

The model downloads the first time you use it, so the first forecast takes
longer.
In a database you haven't forecast in before, click **Set up** when Explorer
asks.

To change the model later, click the arrow next to **Forecast**, and then
click **Change model…**.

### Turn on forecasting on an air-gapped server

If the server can't reach the plugin library, Explorer shows the commands to
run instead.
Copy `chronos_forecasting.py` into the server's plugin directory, and then run
commands like the following:

```bash { placeholders="DATABASE_NAME" }
influxdb3 install package chronos-forecasting torch influxdata-plugin-utils

influxdb3 create trigger \
  --database DATABASE_NAME \
  --path chronos_forecasting.py \
  --trigger-spec "request:explorer_forecast/DATABASE_NAME" \
  --trigger-arguments model=amazon/chronos-bolt-tiny \
  --run-asynchronous \
  explorer_forecast
```

Replace {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}
with the database to forecast.

## Forecast a chart

1.  In the **Data Explorer**, run a SQL query that returns a time column and a
    numeric column.
2.  Show the result as a **Line** or **Area** chart.
3.  Click **Forecast**.
    Click it again to hide the forecast.

You can also click **Forecast** next to a field in the schema panel.
Explorer opens a new tab that charts the field over the past 6 hours and
forecasts it.

{{< img-hd src="/img/influxdb3/explorer-forecast-chart.png" alt="Line chart of CPU usage for four servers over six hours. After a Now line, each series continues as a forecast inside two shaded ranges, and a dashed threshold marks when one server could reach it." />}}

## Read a forecast

After the **Now** line, each series continues as its median forecast, with
shaded ranges where 80% and 50% of values are likely to fall.
To see the details, click the arrow next to **Forecast**.

{{< img-hd src="/img/influxdb3/explorer-forecast-menu.png" alt="Forecast menu over a line chart with Horizon, History, and Ranges settings, the model and points read, the share of recent values inside the 80% range for each server with some marked Low confidence, and when each server could reach the threshold." />}}

**How far to trust it**:
Explorer forecasts the most recent part of the history from the data before
it, and reports how often the actual values fell inside the 80% range.
A series under 60% is marked **Low confidence**.
A short history gets a note that patterns may not hold.

**When a threshold could be reached**:
If the chart has absolute
[thresholds](/influxdb3/explorer/visualize-data/chart-options/#thresholds),
Explorer says when each series could reach or fall to one--for example,
**server-b could reach 50 by 1:15 PM**--and marks it on the chart.

## Change forecast settings

Change these in the **Forecast** menu or in the **Forecast** section of
[chart options](/influxdb3/explorer/visualize-data/chart-options/):

| Setting | Values | |
| :------ | :----- | :- |
| **Horizon** | 5 min to 1 week | How far ahead to forecast |
| **History** | **Chart's range**, or 6 h to 30 days | How much history the model reads. A longer history captures cycles such as daily patterns. |
| **Ranges** | **80% and 50%**, **80% only**, **None** | Which ranges to shade |
| **Updates every** | **5 minutes**, **15 minutes**, **Hour** | How often a dashboard forecast runs |

If the history is too short for the horizon, Explorer shortens the horizon and
says so.

## Keep forecasts on dashboards

On a dashboard, a forecast runs on a schedule on the server and stores its
results in the database.
Refreshing the dashboard reads the stored forecast and never runs the model.

1.  [Add the chart to a dashboard](/influxdb3/explorer/dashboards/#add-a-cell),
    or open **Visualization…** on an existing Line or Area cell.
2.  In the **Forecast** section, turn on **Forecast these series**.
3.  Choose how often it **Updates every**, and save the cell.

The cell's caption says when the forecast last updated.

{{< img-hd src="/img/influxdb3/explorer-forecast-dashboard.png" alt="Dashboard with a CPU by host forecast cell whose caption says when the stored forecast was updated, beside a single stat and a ranking chart." />}}

## Limitations

- Line and Area charts only, and not stacked.
- Each chart forecasts its first five series, sorted by name.
- Dashboard forecast triggers run in InfluxDB, so they keep running if you
  stop using or downgrade Explorer.
  Disable or delete them in [Manage Plugins](/influxdb3/explorer/manage-plugins/).
