---
title: sql.to() function
description: The `sql.to()` function writes data to a SQL database.
aliases:
  - /influxdb/v2.0/reference/flux/functions/sql/to/
  - /influxdb/v2.0/reference/flux/stdlib/sql/to/
  - /influxdb/cloud/reference/flux/stdlib/sql/to/
menu:
  flux_0_x_ref:
    name: sql.to
    parent: sql
weight: 202
flux/v0.x/tags: [outputs]
introduced: 0.35.0
---

The `sql.to()` function writes data to a SQL database.

```js
import "sql"

sql.to(
  driverName: "mysql",
  dataSourceName: "username:password@tcp(localhost:3306)/dbname?param=value",
  table: "example_table",
  batchSize: 10000
)
```

## Parameters

### driverName {data-type="string"}
The driver used to connect to the SQL database.

The following drivers are available:

- bigquery
- hdb
- mysql
- postgres
- snowflake
- sqlite3 – _Does not work with InfluxDB OSS or InfluxDB Cloud. More information [below](#write-data-to-an-sqlite-database)._
- sqlserver, mssql
- vertica, vertigo

{{% warn %}}
#### sql.to does not support Amazon Athena
The `sql.to` function does not support writing data to [Amazon Athena](https://aws.amazon.com/athena/).
{{% /warn %}}

### dataSourceName {data-type="string"}
The data source name (DSN) or connection string used to connect to the SQL database.
The string's form and structure depend on the [driver](#drivername) used.

##### Driver dataSourceName examples
```sh
# Postgres Driver DSN
postgres://pqgotest:password@localhost/pqgotest?sslmode=verify-full

# MySQL Driver DSN
username:password@tcp(localhost:3306)/dbname?param=value

# Snowflake Driver DSNs
username[:password]@accountname/dbname/schemaname?param1=value1&paramN=valueN
username[:password]@accountname/dbname?param1=value1&paramN=valueN
username[:password]@hostname:port/dbname/schemaname?account=<your_account>&param1=value1&paramN=valueN

# SQLite Driver DSN
file:/path/to/test.db?cache=shared&mode=rw

# Microsoft SQL Server Driver DSNs
sqlserver://username:password@localhost:1234?database=examplebdb
server=localhost;user id=username;database=examplebdb;
server=localhost;user id=username;database=examplebdb;azure auth=ENV
server=localhost;user id=username;database=examplebdbr;azure tenant id=77e7d537;azure client id=58879ce8;azure client secret=0123456789

# Google BigQuery DSNs
bigquery://projectid/?param1=value&param2=value
bigquery://projectid/location?param1=value&param2=value

# SAP HANA driver DSN
hdb://<user>:<password>@<host>:<port>?<connection-property>=<value>&<connection-property>=<value>&...
hdb://<user>:<password>@<host>:<port>?DATABASENAME=<tenant-db-name>
hdb://?KEY=<keyname>

# Vertica driver DSN
vertica://<user>:<password>@<host>:<port>/<database>?<queryArgs>
```

### table {data-type="string"}
The destination table.

### batchSize {data-type="int"}
The number of parameters or columns that can be queued within each call to `Exec`.
Defaults to `10000`.

{{% note %}}
If writing to a **SQLite** database, set `batchSize` to `999` or less.
{{% /note %}}

## Examples

For examples and more information about each supported SQL database, see
[Write to SQL databases](/flux/v0.x/write-data/sql/).
