---
title: Use Grafana with InfluxDB 2.0
description: >
  Use the Grafana Flux datasource plugin to connect Grafana to InfluxDB 2.0 or
  InfluxDB Cloud 2.0.
menu:
  v2_0:
    name: Use Grafana
    parent: Other visualization tools
weight: 201
v2.0/tags: [grafana]
---

Use the [Grafana Flux Data Source plugin](https://grafana.com/grafana/plugins/grafana-influxdb-flux-datasource)
to connect Grafana to InfluxDB 2.0 or InfluxDB Cloud 2.0.

{{% warn %}}
The **Grafana Flux Data Source plugin** is currently in beta.
{{% /warn %}}

1. [Sign up for {{< cloud-name >}}](/v2.0/get-started/) or
   [Start InfluxDB 2.0 OSS](/v2.0/get-started/#start-with-influxdb-oss).
2. [Download and install Grafana](https://grafana.com/grafana/download).
3. Install the **Grafana Flux Data Source plugin** manually or with `grafana-cli` (installed
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
  of the Flux Datasource Plugin into the Grafana `data/plugins` directory and unzip it.
    {{% /tab-content %}}
    {{< /tabs-wrapper >}}

4. [Start Grafana](https://grafana.com/docs/grafana/latest/installation/) and
   visit `http://localhost:3000` in your browser.
5. In the left navigation of the Grafana user interface (UI), hover over the gear
   icon to expand the **Configuration** section. Click **Data Sources**.
6. Click **Add data source**.
7. Select **Flux (InfluxDB) [BETA]** from the list of available plugins.

## Configure your InfluxDB 2.0 connection
1. Enter a name for your Flux datasource.
2. Under **HTTP**, enter your [InfluxDB URL](/v2.0/reference/urls/).
3. Under **Auth**, select **With Credentials**.
4. Under **InfluxDB 2.0.0 Details**, enter your **organization name** _or_ **organization ID**,
   **default bucket**, and **authentication token**.

    _For information about retrieving your organization name and ID, see
    [View organizations](/v2.0/organizations/view-orgs/).
    For information about viewing your authentication token, see
    [View tokens](/v2.0/security/tokens/view-tokens/)._

    {{< img-hd src="/img/2-0-visualize-grafana-flux-plugin.png" />}}

5. Click **Save & Test**. Grafana attempts to connect to the InfluxDB 2.0 datasource
   and returns the results of the test.

## Query and visualize data
With your InfluxDB connection configured, use Grafana and Flux to query and
visualize time series data stored in InfluxDB 2.0 or {{< cloud-name >}}.

[Grafana documentation](https://grafana.com/docs/grafana/latest/).
If you're just learning Flux, see [Getting started with Flux](/v2.0/query-data/get-started/).
