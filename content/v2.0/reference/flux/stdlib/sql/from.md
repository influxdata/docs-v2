---
title: sql.from() function
description: The `sql.from()` function retrieves data from a SQL data source.
aliases:
  - /v2.0/reference/flux/functions/sql/from/
menu:
  v2_0_ref:
    name: sql.from
    parent: SQL
weight: 202
related:
  - /v2.0/query-data/flux/sql/
---

The `sql.from()` function retrieves data from a SQL data source.

_**Function type:** Input_

```js
import "sql"

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://user:password@localhost",
  query:"SELECT * FROM TestTable"
)
```

## Parameters

### driverName
The driver used to connect to the SQL database.

_**Data type:** String_

The following drivers are available:

- mysql
- postgres
- snowflake
- sqlite3 – _Does not work with InfluxDB OSS or InfluxDB Cloud. More information [below](#query-an-sqlite-database)._

### dataSourceName
The data source name (DSN) or connection string used to connect to the SQL database.
The string's form and structure depend on the [driver](#drivername) used.

_**Data type:** String_

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
file:/path/to/test.db?cache=shared&mode=ro
```

### query
The query to run against the SQL database.

_**Data type:** String_

## Examples

{{% note %}}
The examples below use [InfluxDB secrets](/v2.0/security/secrets/) to populate
sensitive connection credentials.
{{% /note %}}

### Query a MySQL database
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "MYSQL_USER")
password = secrets.get(key: "MYSQL_PASS")

sql.from(
 driverName: "mysql",
 dataSourceName: "${username}:${password}@tcp(localhost:3306)/db",
 query:"SELECT * FROM example_table"
)
```

### Query a Postgres database
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "POSTGRES_USER")
password = secrets.get(key: "POSTGRES_PASS")

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://${username}:${password}@localhost",
  query:"SELECT * FROM example_table"
)
```

### Query a Snowflake database
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "SNOWFLAKE_USER")
password = secrets.get(key: "SNOWFLAKE_PASS")
account = secrets.get(key: "SNOWFLAKE_ACCT")

sql.from(
  driverName: "snowflake",
  dataSourceName: "${username}:${password}@${account}/db/exampleschema?warehouse=wh",
  query: "SELECT * FROM example_table"
)
```

### Query an SQLite database

{{% warn %}}
**InfluxDB OSS** and **InfluxDB Cloud** do not have direct access to the local filesystem
and cannot query SQLite data sources.
Use the [Flux REPL](/v2.0/reference/cli/influx/repl/) to query a SQLite data source
on your local filesystem.
{{% /warn %}}

```js
import "sql"

sql.from(
  driverName: "sqlite3",
  dataSourceName: "file:/path/to/test.db?cache=shared&mode=ro",
  query: "SELECT * FROM example_table"
)
```
