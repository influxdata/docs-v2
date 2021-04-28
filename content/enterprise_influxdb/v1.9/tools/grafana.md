---
title: Use Grafana with InfluxDB Enterprise
seotitle: Use Grafana with InfluxDB Enterprise v1.8
description: >
  Configure Grafana to query and visualize data from InfluxDB Enterprise v1.8.
menu:
  enterprise_influxdb_1_9:
    name: Grafana
    weight: 60
    parent: Tools
canonical: /{{< latest "influxdb" >}}/tools/grafana/
---

Use [Grafana](https://grafana.com/) or [Grafana Cloud](https://grafana.com/products/cloud/)
to visualize data from your **InfluxDB Enterprise v1.8** instance.

{{% note %}}
#### Required
- The instructions in this guide require **Grafana Cloud** or **Grafana v7.1+**.
  For information about using InfluxDB with other versions of Grafana,
  see the [Grafana documentation](https://grafana.com/docs/grafana/v7.0/features/datasources/influxdb/).
- To use **Flux**, use **InfluxDB Enterprise 1.8.1+** and [enable Flux](/enterprise_influxdb/v1.9/flux/installation/)
  in your InfluxDB data node configuration file.
{{% /note %}}

1. [Set up an InfluxDB Enterprise cluster](/enterprise_influxdb/v1.9/install-and-deploy/).
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

    - **URL**: Your **InfluxDB Enterprise URL** or **load balancer URL**.

        ```sh
        http://localhost:8086/
        ```
    - **Access**: Server (default)

2. Under **InfluxDB Details**, enter the following:

    - **Database**: your database name
    - **User**: your InfluxDB Enterprise username _(if [authentication is enabled](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/))_
    - **Password**: your InfluxDB Enterprise password _(if [authentication is enabled](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/))_
    - **HTTP Method**: select **GET** or **POST** _(for differences between the two,
      see the [query HTTP endpoint documentation](/enterprise_influxdb/v1.9/tools/api/#query-http-endpoint))_

3. Provide a **[Min time interval](https://grafana.com/docs/grafana/latest/datasources/influxdb/#min-time-interval)**
   (default is 10s).

    {{< img-hd src="/img/enterprise/1-7-tools-grafana-influxql.png" />}}

4. Click **Save & Test**. Grafana attempts to connect to InfluxDB Enterprise and returns
   the result of the test.
{{% /tab-content %}}
<!---------------------------- END INFLUXQL CONTENT --------------------------->
<!----------------------------- BEGIN FLUX CONTENT ---------------------------->
{{% tab-content %}}
## Configure Grafana to use Flux

With **Flux** selected as the query language in your InfluxDB data source,
configure your InfluxDB connection:

1. Ensure [Flux is enabled](/enterprise_influxdb/v1.9/flux/installation/) in InfluxDB Enterprise data nodes.

2. Under **Connection**, enter the following:

    - **URL**: Your **InfluxDB Enterprise URL** or **load balancer URL**.

        ```sh
        http://localhost:8086/
        ```

    - **Organization**: Provide an arbitrary value.
    - **Token**: Provide your InfluxDB Enterprise username and password using the following syntax:

      ```sh
      # Syntax
      username:password

      # Example
      johndoe:mY5uP3rS3crE7pA5Sw0Rd
      ```

      We recommend [enabling authentication](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/)
      on all InfluxDB Enterprise clusters. If you choose to leave authentication disabled,
      leave this field blank.

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

      {{< img-hd src="/img/enterprise/1-8-tools-grafana-flux.png" />}}

3. Click **Save & Test**. Grafana attempts to connect to InfluxDB Enterprise and returns
   the result of the test.
{{% /tab-content %}}
<!------------------------------ END FLUX CONTENT ----------------------------->
{{< /tabs-wrapper >}}
