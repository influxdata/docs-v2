---
title: Use Grafana with InfluxDB
seotitle: Use Grafana with InfluxDB v1.8
description: >
  Configure Grafana to query and visualize data from InfluxDB v1.8.
menu:
  influxdb_1_8:
    name: Grafana
    weight: 60
    parent: Tools
v2: /influxdb/v2.0/tools/grafana/
canonical: /{{< latest "influxdb" >}}/tools/grafana/
---

Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from your **InfluxDB v1.8** instance.

{{% note %}}
#### Required
- The instructions in this guide require **Grafana Cloud** or **Grafana v7.1+**.
  For information about using InfluxDB with other versions of Grafana,
  see the [Grafana documentation](https://grafana.com/docs/grafana/v7.0/features/datasources/influxdb/).
- To use **Flux**, use **InfluxDB 1.8.1+** and [enable Flux](/influxdb/v1.8/flux/installation/)
  in your InfluxDB configuration file.
{{% /note %}}

1. [Start InfluxDB](/influxdb/v1.8/get-started/).
2. [Sign up for Grafana Cloud](https://grafana.com/products/cloud/) or
   [download and install Grafana](https://grafana.com/grafana/download).
3. Visit your **Grafana Cloud user interface** (UI) or, if running Grafana locally,
   [start Grafana](https://grafana.com/docs/grafana/latest/installation/) and visit
   `http://localhost:3000` in your browser.
4. In the left navigation of the Grafana UI, hover over the gear
   icon to expand the **Configuration** section. Click **Data Sources**.
5. Click **Add data source**.
6. Select **InfluxDB** from the list of available data sources.
7. On the **Data Source configuration page**, enter a **name** for your InfluxDB data source.
8. Under **Query Language**, select one of the following:

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxQL](#)
[Flux](#)                 
{{% /tabs %}}
<!--------------------------- BEGIN INFLUXQL CONTENT -------------------------->
{{% tab-content %}}
## Configure Grafana to use InfluxQL

With **InfluxQL** selected as the query language in your InfluxDB data source settings:

1. Under **HTTP**, enter the following:

    - **URL**: Your **InfluxDB URL**.

        ```sh
        http://localhost:8086/
        ```
    - **Access**: Server (default)

2. Under **InfluxDB Details**, enter the following:

    - **Database**: your database name
    - **User**: your InfluxDB username _(if [authentication is enabled](/influxdb/v1.8/administration/authentication_and_authorization/))_
    - **Password**: your InfluxDB password _(if [authentication is enabled](/influxdb/v1.8/administration/authentication_and_authorization/))_
    - **HTTP Method**: Select **GET** or **POST** _(for differences between the two,
      see the [query HTTP endpoint documentation](/influxdb/v1.8/tools/api/#query-http-endpoint))_

3. Provide a **[Min time interval](https://grafana.com/docs/grafana/latest/datasources/influxdb/#min-time-interval)**
   (default is 10s).

    {{< img-hd src="/img/influxdb/2-0-tools-grafana-influxql.png" />}}

4. Click **Save & Test**. Grafana attempts to connect to InfluxDB and returns
   the result of the test.

{{% /tab-content %}}
<!---------------------------- END INFLUXQL CONTENT --------------------------->
<!----------------------------- BEGIN FLUX CONTENT ---------------------------->
{{% tab-content %}}
## Configure Grafana to use Flux

With **Flux** selected as the query language in your InfluxDB data source,
configure your InfluxDB connection:

1. Ensure [Flux is enabled](/influxdb/v1.8/flux/installation/) in InfluxDB.

2. Under **Connection**, enter the following:

    - **URL**: Your **InfluxDB URL**.

        ```sh
        http://localhost:8086/
        ```

    - **Organization**: Provide an arbitrary value
    - **Token**: If [InfluxDB authentication is enabled](/influxdb/v1.8/administration/authentication_and_authorization/),
      provide your InfluxDB username and password using the syntax below.

      ```sh
      # Syntax
      username:password

      # Example
      johndoe:mY5uP3rS3crE7pA5Sw0Rd
      ```

      If authentication is not enabled, leave blank.

    - **Default Bucket**: Provide a default database and retention policy combination
      using the following syntax:

      ```sh
      # Syntax
      database-name/retention-policy-name

      # Examples
      example-db/example-rp
      telegraf/autogen
      ```

    - **Min time interval**: [Grafana minimum time interval](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/#min-time-interval).

      {{< img-hd src="/img/influxdb/1-8-tools-grafana-flux.png" />}}

3. Click **Save & Test**. Grafana attempts to connect to InfluxDB and returns
   the result of the test.
{{% /tab-content %}}
<!------------------------------ END FLUX CONTENT ----------------------------->
{{< /tabs-wrapper >}}
