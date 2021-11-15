---
title: sql.from() function
description: The `sql.from()` function retrieves data from a SQL data source.
aliases:
  - /influxdb/v2.0/reference/flux/functions/sql/from/
  - /influxdb/v2.0/reference/flux/stdlib/sql/from/
  - /influxdb/cloud/reference/flux/stdlib/sql/from/
menu:
  flux_0_x_ref:
    name: sql.from
    parent: sql
weight: 202
flux/v0.x/tags: [inputs]
related:
  - /flux/v0.x/query-data/sql/
introduced: 0.34.0
---

The `sql.from()` function retrieves data from a SQL data source.

```js
import "sql"

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://user:password@localhost",
  query:"SELECT * FROM TestTable"
)
```

## Parameters

### driverName {data-type="string"}
Driver to use to connect to the SQL database.

The following drivers are available:

- awsathena
- bigquery
- hdb
- mysql
- postgres
- snowflake
- sqlite3 – _Does not work with InfluxDB OSS or InfluxDB Cloud. More information [below](#query-an-sqlite-database)._
- sqlserver, mssql
- vertica, vertigo

### dataSourceName {data-type="string"}
Data source name (DSN) or connection string to use to connect to the SQL database.
The string's form and structure depend on the [driver](#drivername) used.

##### Driver dataSourceName examples
```sh
# Amazon Athena Driver DSN
s3://myorgqueryresults/?accessID=AKIAJLO3F...&region=us-west-1&secretAccessKey=NnQ7MUMp9PYZsmD47c%2BSsXGOFsd%2F...
s3://myorgqueryresults/?accessID=AKIAJLO3F...&db=dbname&missingAsDefault=false&missingAsEmptyString=false&region=us-west-1&secretAccessKey=NnQ7MUMp9PYZsmD47c%2BSsXGOFsd%2F...&WGRemoteCreation=false

# MySQL Driver DSN
username:password@tcp(localhost:3306)/dbname?param=value

# Postgres Driver DSN
postgres://pqgotest:password@localhost/pqgotest?sslmode=verify-full

# Snowflake Driver DSNs
username[:password]@accountname/dbname/schemaname?param1=value1&paramN=valueN
username[:password]@accountname/dbname?param1=value1&paramN=valueN
username[:password]@hostname:port/dbname/schemaname?account=<your_account>&param1=value1&paramN=valueN

# SQLite Driver DSN
file:/path/to/test.db?cache=shared&mode=ro

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

### query {data-type="string"}
Query to run against the SQL database.

## Examples

For examples and more information about each supported SQL database, see
[Query SQL databases](/flux/v0.x/query-data/sql/).