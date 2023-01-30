---
title: Use Superset to visualize data
seotitle: Use Apache Superset to visualize data stored in InfluxDB
list_title: Superset
description: >
  Use [Apache Superset](https://superset.apache.org/) to query and visualize data
  stored in an InfluxDB bucket backed by InfluxDB IOx.
weight: 101
menu:
  influxdb_cloud_iox:
    name: Superset
    parent: Visualize data
influxdb/cloud-iox/tags: [visualization]
---

Use [Apache Superset](https://superset.apache.org/) to query and visualize data
stored in an InfluxDB bucket backed by InfluxDB IOx.

> Apache Superset is a modern, enterprise-ready business intelligence web application.
> It is fast, lightweight, intuitive, and loaded with options that make it easy for
> users of all skill sets to explore and visualize their data, from simple pie
> charts to highly detailed deck.gl geospatial charts.
>
> {{% caption %}}[Apache Superset documentation](https://superset.apache.org/docs/intro){{% /caption %}}

## Install and start Superset

We recommend using **Docker and docker-compose** to run Superset.

1.  **Download and install Docker Engine and docker-compose**:

    - **macOS**: [Install Docker for macOS](https://docs.docker.com/desktop/install/mac-install/)
    - **Linux**: [Install Docker for Linux](https://docs.docker.com/desktop/install/linux-install/)
    - **Windows**: [Install Docker for Windows](https://docs.docker.com/desktop/install/windows-install/)

      {{% warn %}}
**Superset** is not officially supported on Windows. For more information, see the
[Superset documentation](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose#1-install-a-docker-engine-and-docker-compose).
      {{% /warn %}}

2.  **Download Apache Superset**.
    Clone the Superset repository and navigate into the repository directory.

    ```sh
    git clone https://github.com/apache/superset.git && cd ./superset
    ```

3.  **Add FlightSQL SQL Alchemy to your Superset Docker configuration**.
    FlightSQL SQL Alchemy is a Python library that provides a
    [DB API 2](https://peps.python.org/pep-0249/) interface and
    [SQLAlchemy](https://www.sqlalchemy.org/) dialect for
    [Flight SQL](https://arrow.apache.org/docs/format/FlightSql.html).

    {{% warn %}}
The `flightsql-dbapi` library is experimental and under active development.
The APIs it provides could change at any time.
    {{% /warn %}}

    ```sh
    cat <<EOF >./docker/requirements-local.txt
    flightsql-dbapi
    EOF
    ```

4.  Use docker-compose to create and start all the Docker containers necessary
    to run Superset. _Superset does require multiple Docker containers._

    ```sh
    docker-compose -f docker-compose-non-dev.yml pull
    docker-compose -f docker-compose-non-dev.yml up
    ```

    Once completed, Superset is running.

## Log in to Superset

1.  Navigate to [localhost:8088](http://localhost:8088) in your browser.
    If Superset is configured to use a custom domain, navigate to your custom domain.

2.  If this is your first time logging into Superset, use the following username
    and password:
    
    - **Username**: admin
    - **Password**: admin

3.  _(Optional)_ Create a new admin user with a unique password.

    1.  In the Superset user interface (UI), click **Settings** in the top right
        and select **List Users**.
    2.  Click **{{< icon "plus" >}}** in the top right.
    3.  Select the **Admin** role and provide the remaining credentials for the new user.
    4.  Click **Save**.
    5.  Delete the default **admin** users.

## Set up a new database connection

1.  In the Superset UI, click **Settings** in the top right and select
    **Database Connections**.
2.  Click **+ Database** in the top right.
3.  In the **Connect a Database** window, click on the **Supported Databases**
    drop-down menu and select **Other**.

    {{< img-hd src="/img/influxdb/cloud-iox-superset-connect.png" alt="Configure InfluxDB connection in Superset" />}}

4.  Enter a **Display Name** for the database connection.
5.  Enter your **SQL Alchemy URI** comprised of the following:

    - **Protocol**: `datafusion+flightsql`
    - **Domain**: InfluxDB Cloud region domain
    - **Port**:
      {{% cloud-only %}}443{{% /cloud-only %}}
      {{% oss-only %}}8086 or your custom-configured bind address{{% /oss-only %}}
    
    ##### Query parameters

    - **bucket-name**: URL-encoded InfluxDB bucket name
    - **token**: InfluxDB API token with read access to the specified bucket

    {{< code-callout "&lt;(influxdb-url|port|bucket-name|token)&gt;" >}}
{{< code-callout "us-east-1-1\.aws\.cloud2\.influxdata\.com|443|example-bucket|example-token" >}}
```sh
# Syntax
datafusion+flightsql://<influxdb-url>:<port>?bucket-name=<bucket-name>&token=<token>

# Example
datafusion+flightsql://us-east-1-1.aws.cloud2.influxdata.com:443?bucket-name=example-bucket&token=example-token
```
{{< /code-callout >}}
    {{< /code-callout >}}

6.  Click **Test Connection** to ensure the connection works.
7.  Click **Connect** to save the database connection.

## Query InfluxDB with Superset

With a connection to InfluxDB {{< current-version >}} established, you can begin
to query and visualize data from InfluxDB.

1.  In the Superset UI, click **SQL ▾** in the top navigation bar and select **SQL Lab**.
2.  In the left pane:
    
    1. Under **Database**, select your InfluxDB connection.
    2. Under **Schema**, select **iox**.
    3. Under **See table schema**, select the InfluxDB measurement to query.

    The measurement schema appears in the left pane:

    {{< img-hd src="/img/influxdb/cloud-iox-superset-schema.png" alt="Select your InfluxDB schema in Superset" />}}

3.  Use the **query editor** to write a SQL query that queries data from your 
    InfluxDB bucket.
4.  Click **Run** to execute the query.

Query results appear below the query editor.

## Build visualizations with Superset

With a connection to InfluxDB {{< current-version >}} established and a query
that returns results, you can begin build out data visualizations and dashboards
in Superset. For a comprehensive walk-through of creating visualizations with
Superset, see the [Creating Charts and Dashboards in Superset documentation](https://superset.apache.org/docs/creating-charts-dashboards/creating-your-first-dashboard).

{{< img-hd src="/img/influxdb/cloud-iox-superset-dashboard.png" alt="Build InfluxDB dashboards in Apache Superset" />}}
