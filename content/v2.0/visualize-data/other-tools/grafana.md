---
title: Use Grafana with InfluxDB v2.0
description: >
  Use the Grafana Flux datasource plugin to connect Grafana to InfluxDB v2.0 or an
  InfluxDB Cloud instance.
menu:
  v2_0:
    name: Use Grafana
    parent: Other visualization tools
weight: 201
v2.0/tags: [grafana]
---

Use the [Grafana Flux Data Source plugin](https://grafana.com/grafana/plugins/grafana-influxdb-flux-datasource)
to connect Grafana to InfluxDB v2.0 or an InfluxDB Cloud instance.

{{% warn %}}
The **Grafana Flux Data Source plugin** is currently in beta.
{{% /warn %}}

1. Ensure you have a running InfluxDB instance. You can connect Grafana to InfluxDB
   v2.0 OSS or InfluxDB Cloud instances.
2. [Downland and install Grafana](https://grafana.com/grafana/download).
2. Install the **Grafana Flux Data Source plugin** manually or with `grafana-cli` (installed
   with Grafana).

    {{< tabs-wrapper >}}
    {{% tabs %}}
[Install with Grafana CLI](#)
[Install manually](#)
    {{% /tabs %}}
    {{% tab-content %}}
```sh
grafana-cli plugins install grafana-influxdb-flux-datasource
```
    {{% /tab-content %}}
    {{% tab-content %}}
  Download the [latest release](https://github.com/grafana/influxdb-flux-datasource/releases)
  of Flux Datasource Plugin into into Grafana's `data/plugins` directory and unzip it.
    {{% /tab-content %}}
    {{< /tabs-wrapper >}}

3. Start Grafana and visit `http://localhost:3000` in your browser.
4. In the left navigation of the Grafana user interface (UI), hover over the gear
   icon to reveal the **Configuration** section. Click **Data Sources**.
5. Click **Add data source**.
6. Select **Flux (InfluxDB) [BETA]** from the list of available plugins.

## Configure your InfluxDB 2.0 connection
1. Name your Flux datasource.
2. Under **HTTP**, Configure your **InfluxDB URL**.
   If running InfluxDB 2.0 OSS locally, use `http://localhost:9999`.
   If connecting to an {{< cloud-name "short" >}} instance, see [InfluxDB Cloud URLs](/v2.0/cloud/urls/)
   for information about what URL to use.
3. Under the **Auth** section, select **With Credentials**.
4. Under **InfluxDB 2.0.0 Details**, enter your **organization name** _or_ **organization ID**,
   **default bucket**, and **authentication token**.

    _For information about retrieving your organization name and ID, see
    [View organizations](/v2.0/organizations/view-orgs/).
    For information about viewing your authentication token, see
    [View tokens](/v2.0/security/tokens/view-tokens/)._

    {{< img-hd src="/img/2-0-visualize-grafana-flux-plugin.png" />}}

5. Click **Save & Test**. Grafana will attempt to connect to the InfluxDB 2.0 datasource
   and return the results of the test.

## Query and visualize data
With your InfluxDB connection configured, use Grafana and Flux to query and
visualize time series data stored in InfluxDB 2.0.

[Grafana documentation](https://grafana.com/docs/grafana/latest/).
If you're just learning Flux, see [Getting started with Flux](/v2.0/query-data/get-started/).
