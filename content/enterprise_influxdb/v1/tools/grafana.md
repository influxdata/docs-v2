---
title: Use Grafana with InfluxDB Enterprise
seotitle: Use Grafana with InfluxDB Enterprise v1.8
description: >
  Configure Grafana to query and visualize data from InfluxDB Enterprise v1.8.
menu:
  enterprise_influxdb_v1:
    name: Grafana
    weight: 60
    parent: Tools
canonical: /influxdb/v2/tools/grafana/
---

Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from your **InfluxDB Enterprise** cluster.

{{% note %}}
#### Required
- The instructions in this guide require **Grafana Cloud** or **Grafana v10.3+**.
  For information about using InfluxDB with other versions of Grafana,
  see the [Grafana documentation](https://grafana.com/docs/grafana/latest/datasources/influxdb/).
- To use **Flux**, use **InfluxDB 1.8.1+** and [enable Flux](/influxdb/v1/flux/installation/)
  in your InfluxDB configuration file.
{{% /note %}}

1.  [Set up an InfluxDB Enterprise cluster](/enterprise_influxdb/v1/introduction/installation/).
2.  [Sign up for Grafana Cloud](https://grafana.com/products/cloud/) or
    [download and install Grafana](https://grafana.com/grafana/download).
3.  Visit your **Grafana Cloud user interface** (UI) or, if running Grafana locally,
    [start Grafana](https://grafana.com/docs/grafana/latest/installation/) and visit
    <http://localhost:3000> in your browser.
4.  In the left navigation of the Grafana UI, expand the **Connections** section
    and click **Add new connection**.
5.  Select **InfluxDB** from the list of available data sources and click
    **Add data source**.
6.  On the **Data Source configuration page**, enter a **name** for your InfluxDB data source.
7.  In the **Query Language** drop-down menu, select one of the query languages
    supported by InfluxDB {{< current-version >}} (InfluxQL or Flux):

    {{% note %}}
SQL is only supported in InfluxDB v3.
    {{% /note %}}

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

    - **URL**: Your **InfluxDB Enterprise URL** or **load balancer URL**.

        ```sh
        http://localhost:8086
        ```

2. Under **InfluxDB Details**, enter the following:

    - **Database**: your database name
    - **User**: your InfluxDB username _(if [authentication is enabled](/enterprise_influxdb/v1/administration/authentication_and_authorization/))_
    - **Password**: your InfluxDB password _(if [authentication is enabled](/enterprise_influxdb/v1/administration/authentication_and_authorization/))_
    - **HTTP Method**: Select **GET** or **POST** _(for differences between the two,
      see the [query HTTP endpoint documentation](/enterprise_influxdb/v1/tools/api/#query-http-endpoint))_

3. Provide a **[Min time interval](https://grafana.com/docs/grafana/latest/datasources/influxdb/#min-time-interval)**
   (default is 10s).

    {{< img-hd src="/img/influxdb/v1-tools-grafana-influxql.png" />}}

4. Click **Save & Test**. Grafana attempts to connect to InfluxDB and returns
   the result of the test.

{{% /tab-content %}}
<!---------------------------- END INFLUXQL CONTENT --------------------------->
<!----------------------------- BEGIN FLUX CONTENT ---------------------------->
{{% tab-content %}}
## Configure Grafana to use Flux

With **Flux** selected as the query language in your InfluxDB data source,
configure your InfluxDB connection:

1.  Ensure [Flux is enabled](/enterprise_influxdb/v1/flux/installation/) in
    your InfluxDB Enterprise data nodes.

2.  Under **HTTP**, enter the following:

    - **URL**: Your **InfluxDB Enterprise URL** or **load balancer URL**.

        ```sh
        http://localhost:8086
        ```

3.  Under **InfluxDB Details**, enter the following:

    - **Organization**: Provide an arbitrary value.
    - **Token**: If [InfluxDB authentication is enabled](/enterprise_influxdb/v1/administration/authentication_and_authorization/),
      provide your InfluxDB username and password using the following syntax:

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

      {{< img-hd src="/img/influxdb/v1-tools-grafana-flux.png" />}}

3. Click **Save & Test**. Grafana attempts to connect to InfluxDB and returns
   the result of the test.
{{% /tab-content %}}
<!------------------------------ END FLUX CONTENT ----------------------------->
{{< /tabs-wrapper >}}
