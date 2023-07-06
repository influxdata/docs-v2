---
title: Use Superset to query data
seotitle: Use Apache Superset to query data stored in InfluxDB Cloud Serverless
description: >
  Install and run [Apache Superset](https://superset.apache.org/)
  to query data stored in an InfluxDB Cloud Serverless bucket.
weight: 101
menu:
  influxdb_cloud_serverless:
    parent: Execute SQL queries
    name: Use Superset
    identifier: query_with_superset
influxdb/cloud-serverless/tags: [query, flightsql, superset]
aliases:
  - /influxdb/cloud-serverless/query-data/tools/superset/
related:
  - /influxdb/cloud-serverless/visualize-data/superset/
---

Use [Apache Superset](https://superset.apache.org/) to query data
stored in an InfluxDB Cloud Serverless bucket.

> Apache Superset is a modern, enterprise-ready business intelligence web application.
> It is fast, lightweight, intuitive, and loaded with options that make it easy for
> users of all skill sets to explore and visualize their data, from simple pie
> charts to highly detailed deck.gl geospatial charts.
>
> {{% caption %}}[Apache Superset documentation](https://superset.apache.org/docs/intro){{% /caption %}}

<!-- TOC -->

- [Set up Docker for Superset and Flight SQL](#set-up-docker-for-superset-and-flight-sql)
  - [Install prerequisites for Superset and Flight SQL](#install-prerequisites-for-superset-and-flight-sql)
  - [Set up Docker for Superset](#set-up-docker-for-superset)
- [Start the Superset Docker containers](#start-the-superset-docker-containers)
- [Log in to Superset](#log-in-to-superset)
- [Create a database connection for InfluxDB](#create-a-database-connection-for-influxdb)
- [Query InfluxDB with Superset](#query-influxdb-with-superset)

<!-- /TOC -->

## Set up Docker for Superset and Flight SQL

### Install prerequisites for Superset and Flight SQL

We recommend using **Docker and docker-compose** to run Superset.
To set up Superset to run in Docker containers with Flight SQL, follow these steps:

{{% warn %}}
**Superset** is not officially supported on Windows. For more information about running Superset with
Windows and Docker, see the
[Superset documentation](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose#1-install-a-docker-engine-and-docker-compose).
{{% /warn %}}

1.  Follow the instructions to download and install Docker and docker-compose for your system:

    - **macOS**: [Install Docker for macOS](https://docs.docker.com/desktop/install/mac-install/)
    - **Linux**: [Install Docker for Linux](https://docs.docker.com/desktop/install/linux-install/)

2. Follow the [Python.org Downloading Python](https://wiki.python.org/moin/BeginnersGuide/Download) instructions for your system.

3. Once you've installed Python, check that you can run Python and Pip.
   Depending on your system, you may need to use the Python version 3 (`python3` and `pip3`) commands.
   Enter the following commands into your terminal:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[python](#python)
[python3](#python3)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
python --version
```
```sh
pip --version
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
python3 --version
```
```sh
pip3 --version
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    If neither `pip` nor `pip3` works, follow one of the [Pypa.io Pip Installation](https://pip.pypa.io/en/stable/installation/) methods for your system.

3. Use Pip to install the `flightsql-dbapi` library.

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[pip](#python)
[pip3](#python3)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
pip install flightsql-dbapi
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
pip3 install flightsql-dbapi
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    The `flightsql-dbapi` library for Python provides a
    [DB API 2](https://peps.python.org/pep-0249/) interface and
    [SQLAlchemy](https://www.sqlalchemy.org/) dialect for
    [Flight SQL](https://arrow.apache.org/docs/format/FlightSql.html).
    Later, you'll add `flightsql-dbapi` to Superset's Docker configuration.

    {{% warn %}}
The `flightsql-dbapi` library is experimental and under active development.
The APIs it provides could change at any time.
    {{% /warn %}}

4.  Use Git to clone the Apache Superset repository:

    ```sh
    git clone https://github.com/apache/superset.git
    ```

    The repository contains Superset code and configuration files for running Superset in Docker containers.
    
### Set up Docker for Superset

1. Change to your **superset** repository directory:

   ```sh
   cd ./superset
   ```

2. In your text editor or terminal, create the file `./docker/requirements-local.txt` and append the line `flightsql-dbapi`--for example:

    ```sh
    cat <<EOF >./docker/requirements-local.txt
    flightsql-dbapi
    EOF
    ```
    
    The `./docker/requirements-local.txt` file is used to specify additional Python packages that Docker should include for Superset.
    For more information about Superset's Docker configuration, see [Getting Started with Superset using Docker](https://github.com/apache/superset/tree/master/docker#readme).
3.  Use the `docker-compose pull` command to fetch dependencies for the Docker containers.

    ```sh
    docker-compose -f docker-compose-non-dev.yml pull
    ```

    The process might take several seconds to complete.
    After it completes, you're ready to [Start the Superset Docker containers](#start-the-superset-docker-containers).

## Start the Superset Docker containers

To start the containers and run Superset, enter the `docker-compose up` command and pass the `-f` flag with the setup file name:

```sh
docker-compose -f docker-compose-non-dev.yml up
```

This might take several seconds to complete.

If successful, the terminal contains output similar to the following:

```sh
superset_init         | Init Step 4/4 [Complete] -- Loading examples
superset_init         | 
superset_init         | 
superset_init         | ######################################################################
superset_init         | 
superset_init exited with code 0
superset_app          | 127.0.0.1 - - [24/Mar/2023:15:14:11 +0000] "GET /health HTTP/1.1" 200 2 "-" "curl/7.74.0"
```

With Superset running, you're ready to [log in](#log-in-to-superset) and set up a database connection.

## Log in to Superset

1.  In a browser, visit [localhost:8088](http://localhost:8088) to log in to the Superset user interface (UI).
    If you configured Superset to use a custom domain, navigate to your custom domain.

2.  If this is your first time logging into Superset, use the following username
    and password:
    
    - **Username**: admin
    - **Password**: admin

3.  Optional: Create a new admin user with a unique password.

    1.  In the Superset UI, click **Settings** in the top right
        and select **List Users**.
    2.  Click **{{< icon "plus" >}}** in the top right.
    3.  Select the **Admin** role and provide the remaining credentials for the new user.
    4.  Click **Save**.
    5.  Delete the default **admin** users.

## Create a database connection for InfluxDB

1.  In the Superset UI, click **Settings** in the top right and select
    **Database Connections**.
2.  Click **+ Database** in the top right.
3.  In the **Connect a Database** window, click on the **Supported Databases**
    drop-down menu and select **Other**.

    {{< img-hd src="/img/influxdb/cloud-serverless-superset-connect.png" alt="Configure InfluxDB connection in Superset" />}}

4.  Enter a **Display Name** (for example, _InfluxDB Cloud Serverless_) for the database connection.
5.  Enter your **SQL Alchemy URI** comprised of the following:

    - **Protocol**: `datafusion+flightsql`
    - **Domain**: [InfluxDB Cloud Serverless region domain](/influxdb/cloud-serverless/reference/regions/)
    - **Port**: 443
    
    **Query parameters**

    - **`?database`**: URL-encoded InfluxDB [bucket name](influxdb/cloud-serverless/admin/buckets/view-buckets/)
    - **`?token`**: InfluxDB [API token](/influxdb/cloud-serverless/get-started/setup/) with `READ` access to the specified bucket

    {{< code-callout "&lt;(domain|port|database|token)&gt;" >}}
{{< code-callout "us-east-1-1\.aws\.cloud2\.influxdata\.com|443|example-bucket|example-token" >}}
```sh
# Syntax
datafusion+flightsql://<domain>:<port>?database=<database>&token=<token>

# Example
datafusion+flightsql://us-east-1-1.aws.cloud2.influxdata.com:443?database=example-bucket&token=example-token
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

    {{< img-hd src="/img/influxdb/cloud-serverless-superset-schema.png" alt="Select your InfluxDB schema in Superset" />}}

3.  Use the **query editor** to write an SQL query that queries data in your 
    InfluxDB bucket.
4.  Click **Run** to execute the query.

Query results appear below the query editor.

With a connection to InfluxDB {{< current-version >}} established and a query
that returns results, you're ready to [visualize data using Superset](/influxdb/cloud-serverless/visualize-data/superset/).
