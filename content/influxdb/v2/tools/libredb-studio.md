---
title: Use LibreDB Studio with InfluxDB OSS
description: >
  Use [LibreDB Studio](https://github.com/libredb/libredb-studio), an open source
  web-based database IDE, to browse buckets and run read-only InfluxQL queries
  against InfluxDB OSS v2.
menu:
  influxdb_v2:
    name: LibreDB Studio
    parent: Tools & integrations
weight: 141
influxdb/v2/tags: [InfluxQL, query, visualization]
related:
  - https://github.com/libredb/libredb-studio, LibreDB Studio on GitHub
  - /influxdb/v2/query-data/influxql/
  - /influxdb/v2/query-data/influxql/dbrp/
---

Use [LibreDB Studio](https://github.com/libredb/libredb-studio), an open source
(MIT) web-based database IDE, to browse the buckets in InfluxDB OSS v2,
run InfluxQL queries, and chart the results.
LibreDB Studio queries InfluxDB through the
[InfluxDB 1.x compatibility API](/influxdb/v2/api-guide/influxdb-1x/)
and reads each bucket through its
[DBRP mapping](/influxdb/v2/query-data/influxql/dbrp/).

LibreDB Studio is read-only on InfluxDB.
It runs only `SELECT`, `SHOW`, and `EXPLAIN` statements and refuses any other statement before it reaches InfluxDB.
It doesn't run Flux.

The examples on this page use the `get-started` bucket and the sample home sensor data from
[Get started writing data](/influxdb/v2/get-started/write/).

- [Create a read-only token](#create-a-read-only-token)
- [Start LibreDB Studio](#start-libredb-studio)
- [Connect to InfluxDB](#connect-to-influxdb)
- [Query data](#query-data)
- [Chart query results](#chart-query-results)

## Create a read-only token

LibreDB Studio needs an [API token](/influxdb/v2/admin/tokens/) with read access to the buckets you want to query.
To create a token that can only read the `get-started` bucket,
use the [`influx auth create` command](/influxdb/v2/reference/cli/influx/auth/create/):

```sh { placeholders="ORG_NAME|BUCKET_ID" }
influx auth create \
  --org ORG_NAME \
  --read-bucket BUCKET_ID \
  --description "LibreDB Studio read-only"
```

Replace the following:

- {{% code-placeholder-key %}}`ORG_NAME`{{% /code-placeholder-key %}}: your organization name
- {{% code-placeholder-key %}}`BUCKET_ID`{{% /code-placeholder-key %}}: the ID of the bucket to read.
  To find it, run `influx bucket list --name get-started`.

Copy the token from the command output.

## Start LibreDB Studio

Run the LibreDB Studio Docker image:

```sh
docker run --name libredb-studio -p 3000:3000 ghcr.io/libredb/libredb-studio:latest
```

On first start, LibreDB Studio prints a generated admin email and password to the container log.
To view them, run `docker logs libredb-studio`.
Open `http://localhost:3000` and sign in with those credentials.

The host name you enter in the next section must resolve from inside the LibreDB Studio container,
where `localhost` is the container itself:

- If InfluxDB runs in a Docker container, start LibreDB Studio on the same Docker network
  (`docker run --network NETWORK_NAME ...`) and use the InfluxDB container name as the host.
- If InfluxDB runs directly on a Linux host, start LibreDB Studio with `--network host` instead of `-p 3000:3000`
  and use `localhost` as the host.

## Connect to InfluxDB

1. In the LibreDB Studio sidebar, click **+** to add a connection.
2. Select **InfluxDB (InfluxQL)**.
3. Enter the following:

   - **Host**: the InfluxDB host name, for example `localhost`
   - **Port**: `8086`
   - **Username**: leave empty
   - **Password or token**: the read-only token you created
   - **Database Name**: the bucket name, for example `get-started`

4. If the host isn't `localhost` and InfluxDB doesn't use TLS,
   LibreDB Studio refuses to send the token in cleartext.
   Configure **SSL / TLS**, use an **SSH Tunnel**, or select **Send the password without TLS** to accept that risk.
5. Click **Test Connection**, and then click **Establish Connection**.

{{< img-hd src="/img/influxdb/2-0-tools-libredb-studio-connect.png" alt="LibreDB Studio InfluxDB connection dialog" />}}

## Query data

The sidebar lists the bucket and its measurements.
Click a measurement to open a query tab with a starter `SELECT` statement.

Enter an [InfluxQL](/influxdb/v2/query-data/influxql/) query and click **Run**.
For example, the following query returns the hourly mean temperature and maximum carbon monoxide
reading in the kitchen from the sample data:

```sql
SELECT mean("temp") AS "temp", max("co") AS "co"
FROM "home"
WHERE "room" = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z' AND time <= '2022-01-01T20:00:00Z'
GROUP BY time(1h)
```

{{< img-hd src="/img/influxdb/2-0-tools-libredb-studio-query.png" alt="InfluxQL query results in LibreDB Studio" />}}

To query a bucket other than the one in **Database Name**,
name it in the query as `"BUCKET_NAME".."MEASUREMENT"`.

## Chart query results

1. Run a query.
2. Select the **Charts** tab.
3. Select a chart type, and then set **X-Axis** to `time` and **Y-Axis** to a field.

{{< img-hd src="/img/influxdb/2-0-tools-libredb-studio-chart.png" alt="Line chart of query results in LibreDB Studio" />}}
