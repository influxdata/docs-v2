---
title: Query SQL databases
list_title: SQL databases
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) to query SQL databases with Flux.
menu:
  flux_0_x:
    name: SQL databases
    parent: Query data sources
weight: 102
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "postgres",
    dataSourceName: "postgresql://user:password@localhost",
    query:"SELECT * FROM TestTable"
  )
  ```
---

Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) to query SQL databases with Flux.

- [Databases](#databases)
- [Drivers](#drivers)
- [Data source names](#data-source-names)
  - [Store sensitive credentials as secrets](#store-sensitive-credentials-as-secrets)
- [Results structure](#results-structure)
  - [Column data types](#column-data-types)

## Databases
`sql.from()` supports the following SQL databases:

{{< children type="list" >}}

## Drivers
`sql.from()` uses [Go SQL drivers](https://github.com/golang/go/wiki/SQLDrivers)
in the [Go sql package](https://pkg.go.dev/database/sql) to connect to SQL databases.
The following drivers are available:

- `awsathena`
- `bigquery`
- `hdb`
- `mysql`
- `postgres`
- `snowflake`
- `sqlite3`
- `sqlserver`, `mssql`

## Data source names
Each [SQL driver](#drivers) supports unique data source name (DSN) syntaxes
(also known as **connection strings**).
_See the [database guides](#databases) for information about DSNs for each driver._

#### Store sensitive credentials as secrets
If using **InfluxDB Cloud** or **InfluxDB OSS 2.x**, we recommend storing DSN
credentials as [InfluxDB secrets](/influxdb/cloud/security/secrets/).
Use [`secrets.get()`](/flux/v0.x/stdlib/influxdata/influxdb/secrets/get/) to
retrieve a secret from the InfluxDB secrets API.

```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "POSTGRES_USER")
password = secrets.get(key: "POSTGRES_PASS")

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://${username}:${password}@localhost:5432",
  query: "SELECT * FROM example_table"
)
```

## Results structure
`sql.from()` returns a [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables)
with no grouping (all rows in a single table).
_For more information about table grouping, see
[Flux data model - Restructure tables](/flux/v0.x/get-started/data-model/#restructure-tables)._

{{% note %}}
#### Column data types
Each `sql.from()` [driver](#drivers) converts column data types from the source
database into [Flux data types](/flux/v0.x/spec/types/#basic-types).
_See the [database guides](#databases) for information about data type conversions._
{{% /note %}}

Given the following **example_table** in a MySQL database:

##### example_table
| ID  | Name                               | Address                       | Country |
| :-: | :--------------------------------- | :---------------------------- | :------ |
|  1  | Alfreds Futterkiste                | Obere Str. 57                 | Germany |
|  2  | Ana Trujillo Emparedados y helados | Avda. de la Constitución 2222 | Mexico  |
|  3  | Antonio Moreno Taquería            | Mataderos 2312                | Mexico  |
|  4  | Around the Horn                    | 120 Hanover Sq.               | UK      |
|  5  | Berglunds snabbköp                 | Berguvsvägen 8                | Sweden  |

##### Flux query
```js
import "sql"

sql.from(
  driver: "mysql",
  dataSourceName: "username:passwOrd@tcp(localhost:3306)/db",
  query: "SELECT ID, Name FROM example_table"
)
```

##### Output
| ID  | Name                               |
| :-: | :--------------------------------- |
|  1  | Alfreds Futterkiste                |
|  2  | Ana Trujillo Emparedados y helados |
|  3  | Antonio Moreno Taquería            |
|  4  | Around the Horn                    |
|  5  | Berglunds snabbköp                 |

