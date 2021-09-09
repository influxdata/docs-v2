---
title: Write to SQL databases
list_title: SQL databases
description: >
  Use [`sql.to()`](/flux/v0.x/stdlib/sql/to/) to write data to SQL databases with Flux.
menu:
  flux_0_x:
    name: SQL databases
    parent: Write to data sources
    identifier: write-to-sql
weight: 102
related:
  - /flux/v0.x/stdlib/sql/to/
list_code_example: |
  ```js
  import "sql"
  
  sql.to(
    driverName: "postgres",
    dataSourceName: "postgresql://user:password@localhost",
    table: "ExampleTable",
    batchSize: 10000
  )
  ```
---

Use [`sql.to()`](/flux/v0.x/stdlib/sql/to/) to write data to SQL databases with Flux.

- [Databases](#databases)
- [Drivers](#drivers)
- [Data source names](#data-source-names)
  - [Store sensitive credentials as secrets](#store-sensitive-credentials-as-secrets)
- [Data structure](#data-structure)
  - [Column data types](#column-data-types)
- [Example](#example)

## Databases
`sql.to()` supports the following SQL databases:

{{< children type="list" >}}

## Drivers
`sql.to()` uses [Go SQL drivers](https://github.com/golang/go/wiki/SQLDrivers)
in the [Go sql package](https://pkg.go.dev/database/sql) to connect to SQL databases.
The following drivers are available:

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

sql.to(
  driverName: "postgres",
  dataSourceName: "postgresql://${username}:${password}@localhost:5432",
  table: "example_table"
)
```

## Data Structure
`sql.to()` ungroups all rows into a single table and writes all existing columns
as the specified destination table.
If the destination table doesn't exist, `sql.to()` attempts to create it.

{{% note %}}
#### Column data types
Each `sql.to()` [driver](#drivers) converts [Flux basic data types](/flux/v0.x/data-types/basic/).
to corresponding data types supported by the target database.
_See the [database guides](#databases) for information about data type conversions._
{{% /note %}}


## Example
Given the following following [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables):

##### data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |     -2 |
| 2021-01-01T00:00:10Z | t1  |     10 |
| 2021-01-01T00:00:20Z | t1  |      7 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |     19 |
| 2021-01-01T00:00:10Z | t2  |      4 |
| 2021-01-01T00:00:20Z | t2  |     -3 |

##### Flux query
```js
import "sql"

data
  |> sql.from(
    driver: "mysql",
    dataSourceName: "username:passwOrd@tcp(localhost:3306)/db",
    table: "exampleTable"
  )
```

##### SQL Query
```sql
SELECT * FROM exampleTable
```

##### SQL output
| _time               | tag | _value |
| :------------------ | :-- | -----: |
| 2021-01-01 00:00:00 | t1  |     -2 |
| 2021-01-01 00:00:10 | t1  |     10 |
| 2021-01-01 00:00:20 | t1  |      7 |
| 2021-01-01 00:00:00 | t2  |     19 |
| 2021-01-01 00:00:10 | t2  |      4 |
| 2021-01-01 00:00:20 | t2  |     -3 |
