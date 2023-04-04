---
title: Use Grafana to query and visualize data
seotitle: Use Grafana to query and visualize data stored in InfluxDB Cloud (IOx)
list_title: Use Grafana
description: >
  Install and run [Grafana](https://grafana.com/) to query and visualize data stored in an
  InfluxDB bucket powered by InfluxDB IOx.
weight: 101
menu:
  influxdb_cloud_iox:
    name: Use Grafana
    parent: Visualize data
influxdb/cloud-iox/tags: [visualization]
alt_engine: /influxdb/cloud/tools/grafana/
---

Use [Grafana](https://grafana.com/) to query and visualize data stored in an
InfluxDB bucket powered by InfluxDB IOx.
Install the [grafana-flight-sql-plugin](https://github.com/influxdata/grafana-flightsql-datasource) to query InfluxDB with the Flight SQL protocol.

> [Grafana] enables you to query, visualize, alert on, and explore your metrics,
> logs, and traces wherever they are stored.
> [Grafana] provides you with tools to turn your time-series database (TSDB)
> data into insightful graphs and visualizations.
>
> {{% caption %}}[Grafana documentation](https://grafana.com/docs/grafana/latest/introduction/){{% /caption %}}

<!-- TOC -->

- [Install Grafana](#install-grafana)
- [Download the Grafana Flight SQL Plugin](#download-the-grafana-flight-sql-plugin)
- [Extract the Flight SQL plugin](#extract-the-flight-sql-plugin)
- [Install the Grafana Flight SQL plugin](#install-the-grafana-flight-sql-plugin)
    - [Install with Docker Run](#install-with-docker-run)
    - [Install with Docker-Compose](#install-with-docker-compose)
- [Configure the Flight SQL datasource](#configure-the-flight-sql-datasource)
- [Query InfluxDB with Grafana](#query-influxdb-with-grafana)
- [Build visualizations with Grafana](#build-visualizations-with-grafana)

<!-- /TOC -->

## Install Grafana

Follow [Grafana installations instructions](https://grafana.com/docs/grafana/latest/setup-grafana/installation/)
for your operating system to Install Grafana.


## Download the Grafana Flight SQL plugin

Download the latest release from [influxdata/grafana-flightsql-datasource releases](https://github.com/influxdata/grafana-flightsql-datasource/releases).

{{% warn %}}
Because Grafana Flight SQL Plugin is a custom plugin, you can't use it with Grafana Cloud.
For more information, see [Find and Use Plugins in the Grafana Cloud documentation](https://grafana.com/docs/grafana-cloud/fundamentals/find-and-use-plugins/)

The Grafana Flight SQL plugin is experimental and subject to change.
{{% /warn %}}

```sh
curl -L https://github.com/influxdata/grafana-flightsql-datasource/releases/download/v0.1.9/influxdata-flightsql-datasource-0.1.9.zip --output influxdata-flightsql-datasource.zip
```

<span id="custom-grafana-plugins-directory"></span>

## Extract the Flight SQL plugin

Extract the Flight SQL plugin archive to your Grafana **custom plugins directory**.
The custom plugins directory can be any filesystem location that Grafana can access.

{{% code-callout "/custom/plugins/directory" %}}
```sh
unzip influxdata-flightsql-datasource.zip -d /custom/plugins/directory/
```
{{% /code-callout %}}

## Install the Grafana Flight SQL plugin

Install the custom-built Flight SQL plugin in a local or Docker-based instance
of Grafana OSS or Grafana Enterprise.

{{% warn %}}
Because Grafana Flight SQL Plugin is a custom plugin, you can't use it with Grafana Cloud.
For more information, see [Find and Use Plugins in the Grafana Cloud documentation](https://grafana.com/docs/grafana-cloud/fundamentals/find-and-use-plugins/)
{{% /warn %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[Local](#)
[Docker](#)
{{% /tabs %}}

{{% tab-content %}}
<!---------------------------- BEGIN LOCAL CONTENT ---------------------------->

  Follow these steps to edit the Grafana configuration file or set environment variables to install the plugin. 
  
  {{% note %}}

  If you used **Homebrew** to install Grafana, follow the steps to edit the
  `/homebrew/install/path/etc/grafana/grafana.ini` configuration file.
  
  Replace `/homebrew/install/path` with the output of the [`brew --prefix` command](https://docs.brew.sh/Manpage#--prefix---unbrewed---installed-formula-) for your system.

  For information about where to find your Grafana configuration file or what
  environment variables are available, see the
  [Configure Grafana documentation](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/).
  
  {{% /note %}}
    
  1.  Set your Grafana custom plugin directory. Do one of the following:

      - In your Grafana configuration file, set the `paths.plugins` directive 
        to the path of your [custom plugins directory](#custom-grafana-plugins-directory):
      
        ```ini
        [paths]
        plugins = /custom/plugins/directory/
        ```

      - Set the `GF_PATHS_PLUGINS` environment variable to the path
        of your [custom plugins directory](#custom-grafana-plugins-directory):
      
        ```sh
        GF_PATHS_PLUGINS=/custom/plugins/directory/
        ```

  2.  Allow Grafana to load the unsigned plugin. The Flight SQL plugin is unsigned and Grafana requires you to explicitly load unsigned plugins.
      Do one of the following:

      - Set the `plugins.allow_loading_unsigned_plugins` directive in your
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

4.  Restart Grafana to apply the configuration changes.

<!----------------------------- END LOCAL CONTENT ----------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN DOCKER CONTENT --------------------------->
To add the Flight SQL plugin to your pre-existing Grafana Docker deployment,
use `docker run` or `docker-compose` to do the following:

-  Mount the plugin directory (`/custom/plugins/directory/influxdata-flightsql-datasource`) as a volume to your Grafana container.
-  Set the `GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS` environment variable to the plugin name. The Flight SQL plugin is unsigned and Grafana requires you to explicitly load unsigned plugins. 

### Install with Docker Run

{{% code-callout "/custom/plugins/directory" %}}
```sh 
docker run \
  --volume $PWD/influxdata-flightsql-datasource:/custom/plugins/directory/influxdata-flightsql-datasource \
  --publish 3000:3000 \
  --name grafana \
  --env GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=influxdata-flightsql-datasource \
  grafana/grafana:latest
```
{{% /code-callout %}}

### Install with Docker-Compose

{{% code-callout "/custom/plugins/directory" %}}
```yaml
version: '3'
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - 3000:3000
    environment:
      - GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=influxdata-flightsql-datasource
    volumes: 
      - ./influxdata-flightsql-datasource:/custom/plugins/directory/influxdata-flightsql-datasource
    restart: always
```
{{% /code-callout %}}

- Replace `/custom/plugins/directory` with the path
  of your [custom plugins directory](#custom-grafana-plugins-directory).
<!----------------------------- END DOCKER CONTENT ---------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Configure the Flight SQL datasource

1.  In your Grafana user interface (UI), navigate to **Data Sources**.
2.  Click **Add data source**.
3.  Search for and select the **Flight SQL** plugin.
4   Provide a name for your datasource.
5.  Add your connection credentials:

    - **Host**: Provide the host and port of your Flight SQL client.
      For InfluxDB {{< current-version >}}, this is your
      {{% cloud-only %}}[InfluxDB Cloud region domain](/influxdb/cloud-iox/reference/regions/){{% /cloud-only %}}
      {{% oss-only %}}InfluxDB domain{{% /oss-only %}}
      and port 443. For example:

      ```
      us-east-1-1.aws.cloud2.influxdata.com:443
      ```

    - **AuthType**: Select **token**.
    - **Token**: Provide your InfluxDB API token with read access to the buckets
      you want to query.
    - **Require TLS/SSL**:
      {{% cloud-only %}}Enable this toggle.{{% /cloud-only %}}
      {{% oss-only %}}If TLS is configured and enabled on your InfluxDB instance, enable this toggle.{{% /oss-only %}}

6.  Add connection **MetaData**.
    Provide optional key-value pairs to send to your Flight SQL client.

    InfluxDB {{< current-version >}} requires your **bucket name** or **bucket-id**:
    
    - **Key**: `bucket-name` or `bucket-id`
    - **Value**: Bucket name or bucket ID

7.  Click **Save & test**.

    {{< img-hd src="/img/influxdb/cloud-iox-grafana-flightsql-datasource.png" alt="Grafana Flight SQL datasource" />}}

    If successful, click **Explore** to begin querying InfluxDB with Flight SQL and Grafana.

## Query InfluxDB with Grafana

After you [configure and save a Flight SQL datasource](#configure-the-flight-sql-datasource),
use Grafana to build, run, and inspect queries against InfluxDB buckets.

{{% note %}}
{{% sql/sql-schema-intro %}}
To learn more, see [Query Data](/influxdb/cloud-iox/query-data/sql/).
{{% /note %}}

1. Click **Explore**.
2. In the dropdown, select the saved data source that you want to query.
3. Use the SQL query form to build your query:
    - **FROM**: Select the measurement that you want to query.
    - **SELECT**: Select one or more fields and tags to return as columns in query results.
                  In Grafana, you must specify a **time** column in the `SELECT` list.
    - **WHERE**: To filter the query results, enter a conditional expression.
    - **GROUP BY**: To `GROUP BY` one or more fields or tags, enter them as a comma-delimited list.
                    If you include an aggregate function in the **SELECT** list,
                    then you must include one or more of the queried columns in a `GROUP BY` or `PARTITION BY` clause.
                    SQL will return the aggregation for each group or partition.
4. Click **Run query** to execute the query.
{{< img-hd src="/img/influxdb/cloud-iox-grafana-flightsql-explore-query-1.png" alt="Grafana Flight SQL datasource query" />}}

To learn about query management and inspection in Grafana, see the [Grafana Explore documentation](https://grafana.com/docs/grafana/latest/explore/).

## Build visualizations with Grafana

For a comprehensive walk-through of creating visualizations with
Grafana, see the [Grafana documentation](https://grafana.com/docs/grafana/latest/).
