---
title: Get started with InfluxDB 3 Explorer
description: >
  Learn how to use InfluxDB 3 Explorer to connect to InfluxDB 3, write data, and
  query data.
menu:
  influxdb3_explorer:
    name: Get started
weight: 3
---

Get started with {{% product-name %}} by connecting it to an InfluxDB 3 instance,
writing data to InfluxDB, and then querying that data. This guide walks you
through each of those steps.

1. [Connect to an InfluxDB 3 server](#connect-to-an-influxdb-3-server)
2. [Write data to InfluxDB](#write-data-to-influxdb)
3. [Query data from InfluxDB](#query-data-from-influxdb)

> [!Note]
> This guide assumes you have already [installed {{% product-name %}}](/influxdb3/explorer/install/).

## Connect to an InfluxDB 3 server

InfluxDB 3 Explorer supports the following InfluxDB 3 products:

- [InfluxDB 3 Core](/influxdb3/core/)
- [InfluxDB 3 Enterprise](/influxdb3/enterprise/)

1.  Navigate to **Configure** > **Servers**.
2.  Click **+ Connect Your First Server**.
3.  Provide the following InfluxDB 3 server information:

    - **Server name**: A name to identify the InfluxDB 3 server you're connecting to.
    - **Server URL**: The URL used to connect to your InfluxDB 3 server.
      - Select the protocol to use (http or https).
      - Provide the host and, if necessary, the port.
        - _If connecting to a local, non-Docker instance, use `host.docker.internal`._ For more information about host.docker.internal, see the [Docker documentation](https://docs.docker.com/desktop/features/networking).
    - **Token**: The authorization token to use to connect to your InfluxDB 3 server.
      We recommend using an InfluxDB 3 _admin_ token.
      
      > [!Important]
      > #### Token permissions may limit Explorer functionality
      >
      > The permissions associated with the provided token determine what
      > databases you can access using this server configuration. InfluxDB 3
      > tokens with limited permissions may not be able to use some Explorer
      > functionality.

4.  Click **Add Server**.

InfluxDB 3 Explorer attempts to verify the connection. If successful, Explorer
saves the server configuration and selects it as the active server.

> [!Note]
> If you already have data in your InfluxDB 3 instance, skip to
> [Query data from InfluxDB](#query-data-from-influxdb).

## Write data to InfluxDB

{{% product-name %}} lets you write data to InfluxDB 3 and provides multiple
options. For this getting started guide, use Explorer to write one of the
sample data sets to InfluxDB:

1. Navigate to **Write Data** > **Sample/Dev Data**.
2. Select any of the available sample data sets.
3. Click **Write Sample Data**.

{{% product-name %}} creates a new database and then writes the sample data to
the database.

### Other write methods

{{% product-name %}} provides other ways to write data to InfluxDB, including
the following:

- Line protocol
- CSV or JSON
- InfluxDB 3 client libraries
- Telegraf

## Query data from InfluxDB

To use {{% product-name %}} to query data from InfluxDB 3, navigate to
**Query Data** > **Data Explorer**.

The _Data Explorer_ lets you explore the
schema of your database and automatically builds SQL queries by either
selecting columns in the _Schema Browser_ or by using _Natural Language_ with
the {{% product-name %}} AI integration.

For this getting started guide, use the Schema Browser to build a SQL query
that returns data from the newly written sample data set.

1.  On the **Data Explorer** in the **Schema** column, select the database you
    want to query from the database dropdown menu.
    Once selected, all tables in the database appear.
2.  Click the name of the table you want to query to expand and view all the
    columns in that table.
3.  Select each column you want to query.
    As you select columns in the Schema Browser, Explorer generates and updates
    an SQL query in the _Query pane_.
4.  Use the time range dropdown menu above the Query pane to select a time range
    to query. You can select one of the predefined relative time ranges, or you
    can select _Custom Range_ to define an absolute time range to query.
5.  With columns and a time range selected, click **Run Query**.

{{% product-name %}} runs the query and returns the results in the _Results pane_.
The Results pane provides three view options:

- **Table** _(default)_: Displays raw query results in paginated table format.
- **Line**: Displays query results in a line graph.
- **Bar**: Displays query results in a bar graph.

> [!Tip]
> SQL query results may not be ordered by `time` and Line and Bar graph
> visualizations may behave unexpectedly. To order results by time:
>
> - Ensure that you query the `time` column
> - Update the query to include an `ORDER BY time` clause.

Congratulations! You have successfully used {{% product-name %}} to connect to,
write data to, and query data from an InfluxDB 3 instance.

## Video walkthrough

{{< youtube "zW2Hi1Ki4Eo" >}}

<!-- 
## Next steps

TO-DO: Provide links to deeper content as we release it
-->
