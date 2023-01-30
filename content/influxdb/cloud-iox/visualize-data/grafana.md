---
title: Use Grafana to visualize data
seotitle: Use Grafana to visualize data stored in InfluxDB
list_title: Grafana
description: >
  Use [Grafana](https://grafana.com/) to query and visualize data stored in an
  InfluxDB bucket backed by InfluxDB IOx.
weight: 101
menu:
  influxdb_cloud_iox:
    name: Grafana
    parent: Visualize data
influxdb/cloud-iox/tags: [visualization]
---

Use [Grafana](https://grafana.com/) to query and visualize data stored in an
InfluxDB bucket backed by InfluxDB IOx.

> [Grafana] enables you to query, visualize, alert on, and explore your metrics,
> logs, and traces wherever they are stored.
> [Grafana] provides you with tools to turn your time-series database (TSDB)
> data into insightful graphs and visualizations.
>
> {{% caption %}}[Grafana documentation](https://grafana.com/docs/grafana/latest/introduction/){{% /caption %}}

For the most performant queries, use SQL and the
[Flight SQL protocol](https://arrow.apache.org/blog/2022/02/16/introducing-arrow-flight-sql/)
to query InfluxDB.


## Download the FlightSQL Plugin

{{% warn %}}
The Grafana FlightSQL plugin is experimental and is subject to change.
{{% /warn %}}

```sh
$ curl -L https://github.com/influxdata/grafana-flightsql-datasource/releases/download/v0.1.0/influxdata-flightsql-datasource-0.1.0.zip
```

## Install the Grafana FlightSQL plugin

Install the custom-built FlightSQL plugin in a local or Docker-based instance
of Grafana OSS or Grafana Enterprise.

{{% warn %}}
#### Grafana Cloud does not support custom plugins

Only plugins that are uploaded publicly to the Grafana Plugins repo that
include the ability to use “click to install” from the site can be added to
your Grafana Cloud instance. Private, custom-built, or third-party plugins
that require manual uploading or manually modifying Grafana backend files
cannot be installed on or used with Grafana Cloud.

{{% caption %}}
[Grafana Cloud documentation](https://grafana.com/docs/grafana-cloud/fundamentals/find-and-use-plugins/)
{{% /caption %}}

{{% /warn %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[Local](#)
[Docker](#)
{{% /tabs %}}

{{% tab-content %}}
<!---------------------------- BEGIN LOCAL CONTENT ---------------------------->

<div id="custom-grafana-plugins-directory"></div>

1. **Unzip the [FlightSQL plugin files](#flightsql-plugin-path) to your Grafana
   plugin directory**:

    ```sh
	unzip influxdata-grafana-datasource-0.1.0.zip -d grafana-plugins/
    ```

2.  **Edit your Grafana configuration**.
    
    Configure Grafana using configuration file or environment variable.
    For information about where to find your Grafana configuration file or what
    environment variables are available, see the
    [Configure Grafana documentation](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/).
    
    1.  **Point Grafana to your custom plugin directory**.
        Do one of the following:

        - Edit the `paths.plugins` directive in your Grafana configuration file
          to point to the path of your [custom plugins directory](#custom-grafana-plugins-directory):
        
          ```ini
          [paths]
          plugins = /path/to/grafana-plugins/
          ```

        - Set the `GF_PATHS_PLUGINS` environment variable to point to the path
          of your [custom plugins directory](#custom-grafana-plugins-directory):
        
          ```sh
          GF_PATHS_PLUGINS=/path/to/grafana-plugins/
          ```

    2.  **Allow Grafana to load unsigned plugins**.
        The FlightSQL plugin is unsigned and cannot be loaded by default.
        Do one of the following:

        - Edit the `plugins.allow_loading_unsigned_plugins` directive in your
          Grafana configuration file to allow the `influxdata-flightsql-datasource`:

          ```ini
          [plugins]
          allow_loading_unsigned_plugins = influxdata-flightsql-datasource
          ```

        - Set the `GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS` environment variable
          to `influxdata-flightsql-datasource`:

          ```sh
          GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=influxdata-flightsql-datasource
          ```

4.  **Restart Grafana to apply the configuration changes**.

<!----------------------------- END LOCAL CONTENT ----------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN DOCKER CONTENT --------------------------->

To add the FlightSQL plugin to your pre-existing Grafana Docker deployment
mount the following volume to your Grafana container:

```bash 
docker run \
  --volume $PWD/dist:/var/lib/grafana/plugins/influxdata-flightsql-datasource \
  --publish 3000:3000 \
  --name grafana \
  --env GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=influxdata-flightsql-datasource \
  grafana/grafana:latest
```

{{% note %}} It's important to set the
`GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS` environment variable, because the
plugin is unsigned and Grafana requires explicit loading of unsigned plugins. 
{{% /note %}}

<!----------------------------- END DOCKER CONTENT ---------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Configure the Flight SQL datasource

1.  In your Grafana user interface (UI), navigate to **Data Sources**.
2.  Click **Add data source**.
3.  Search for and select the **FlightSQL** plugin.
4   Provide a name for your datasource.
5.  Add your connection credentials:

    - **Host**: Provide the host and port of your Flight SQL client.
      For InfluxDB {{< current-version >}}, this is your
      {{% cloud-only %}}InfluxDB Cloud region URL{{% /cloud-only %}}
      {{% oss-only %}}InfluxDB URL{{% /oss-only %}}
      and port 443. For example:

      ```
      us-east-1-1.aws.cloud2.influxdata.com:433
      ```

    - **AuthType**: Select **token**.
    - **Token**: Provide your InfluxDB API token with read access to the buckets
      you want to query.
    - **Require TLS/SSL**:
      {{% cloud-only %}}Enable this toggle.{{% /cloud-only %}}
      {{% oss-only %}}If TLS is configured and enabled on your InfluxDB instance, enable this toggle.{{% /oss-only %}}

6.  Add connection **MetaData**.
    Provide optional key, value pairs to send to your Flight SQL client.

    InfluxDB {{< current-version >}} requires your **bucket name**:
    
    - **Key**: `bucket-name`
    - **Value**: Your bucket name

7.  Select **Save & Test**.

    {{< img-hd src="/img/influxdb/cloud-iox-grafana-flightsql-datasource.png" alt="Grafana FlightSQL datasource" />}}

8. Click **Explore** to begin exploring your schema and querying InfluxDB with SQL.

## Build visualizations with Grafana

For a comprehensive walk-through of creating visualizations with
Grafana, see the [Grafana documentation](https://grafana.com/docs/grafana/latest/).
