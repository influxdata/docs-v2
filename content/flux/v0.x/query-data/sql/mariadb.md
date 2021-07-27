---
title: Query MariaDB
list_title: MariaDB
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `mysql` driver to query MariaDB.
menu:
  flux_0_x:
    name: MariaDB
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "mysql",
    dataSourceName: "user:password@tcp(localhost:3306)/db",
    query: "SELECT * FROM example_table"
  )
  ```
---

To query [MariaDB](https://mariadb.org/) with Flux, import the [`sql` package](/flux/v0.x/stdlib/sql/)
and use the [`sql.from()` function](/flux/v0.x/stdlib/sql/from/) with the `mysql` driver.
Provide the following parameters:

- **driverName**: mysql
- **dataSourceName**: [MariaDB data source name (DSN)](#data-source-name)
  _(also known as **connection string**)_
- **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "mysql",
  dataSourceName: "user:password@tcp(localhost:3306)/db",
  query: "SELECT * FROM example_table"
)
```

##### On this page

- [Data source name](#data-source-name)
- [Data types](#data-types)
- [Results structure](#results-structure)
- [Store sensitive credentials as secrets](#store-sensitive-credentials-as-secrets)

## Data source name
The `mysql` driver uses the following data source name (DSN) syntax:

```
username:password@tcp(localhost:3306)/dbname?param=value
```

## Data types
`sql.from()` converts MariaDB data types to Flux data types.

| MariaDB data type              | Flux data type                                |
| :----------------------------- | :-------------------------------------------- |
| INT, BIGINT, SMALLINT, TINYINT | [int](/flux/v0.x/spec/types/#numeric-types)   |
| FLOAT, DOUBLE                  | [float](/flux/v0.x/spec/types/#numeric-types) |
| DATETIME                       | [time](/flux/v0.x/spec/types/#time-types)     |
| STRING                         | [string](/flux/v0.x/spec/types/#string-types) |

{{% caption %}}
All other MariaDB data types are converted to strings.
{{% /caption %}}

## Results structure
`sql.from()` returns a stream of tables with no grouping (all rows are in a single table).
For more information about table grouping, see
[Flux data model - Restructure data](/flux/v0.x/get-started/data-model/#restructure-data).

## Store sensitive credentials as secrets
If using **InfluxDB Cloud** or **InfluxDB OSS 2.x**, we recommend storing MariaDB
connection credentials as [InfluxDB secrets](/influxdb/cloud/security/secrets/).
Use [`secrets.get()`](/flux/v0.x/stdlib/influxdata/influxdb/secrets/get/) to
retrieve a secret from the InfluxDB secrets API.

```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "MARIADB_USERNAME")
password = secrets.get(key: "MARIADB_PASSWORD")

sql.from(
  driverName: "mysql",
  dataSourceName: "${username}:${password}@tcp(localhost:3306)/db",
  query: "SELECT * FROM example_table"
)
```
