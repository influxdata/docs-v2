---
title: Query Snowflake
list_title: Snowflake
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `snowflake` driver to query Snowflake.
menu:
  flux_0_x:
    name: Snowflake
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "snowflake",
    dataSourceName: "user:password@account/db/exampleschema?warehouse=wh",
    query: "SELECT * FROM example_table"
  )
  ```
---

To query [Snowflake](https://www.snowflake.com/) with Flux, import the
[`sql` package](/flux/v0.x/stdlib/sql/) and use the [`sql.from()` function](/flux/v0.x/stdlib/sql/from/)
with the `snowflake` driver.
Provide the following parameters:

- **driverName**: snowflake
- **dataSourceName**: [Snowflake data source name (DSN)](#data-source-name)
  _(also known as a **connection string**)_
- **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "snowflake",
  dataSourceName: "user:password@account/db/exampleschema?warehouse=wh",
  query: "SELECT * FROM example_table"
)
```

##### On this page

- [Data source name](#data-source-name)
- [Data types](#data-types)
- [Results structure](#results-structure)
- [Store sensitive credentials as secrets](#store-sensitive-credentials-as-secrets)

## Data source name
The `snowflake` driver uses the following DSN syntaxes:

```
username[:password]@accountname/dbname/schemaname?param1=value1&paramN=valueN
username[:password]@accountname/dbname?param1=value1&paramN=valueN
username[:password]@hostname:port/dbname/schemaname?account=<your_account>&param1=value1&paramN=valueN
```

## Data types
`sql.from()` converts Snowflake data types to Flux data types.

| Snowflake data type         | Flux data type                                                                                                           |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| FIXED, NUMBER               | [int](/flux/v0.x/spec/types/#numeric-types) or [float](/flux/v0.x/spec/types/#numeric-types) (depending on decimal size) |
| REAL, FLOAT                 | [float](/flux/v0.x/spec/types/#numeric-types)                                                                            |
| TIMESTAMP_TZ, TIMESTAMP_LTZ | [time](/flux/v0.x/spec/types/#time-types)                                                                                |
| BOOLEAN                     | [bool](/flux/v0.x/spec/types/#boolean-types)                                                                             |

{{% caption %}}
All other Snowflake data types (including **TIMESTAMP_NTZ**, **DATE** and **TIME**)
are converted to strings.
{{% /caption %}}

## Results structure
`sql.from()` returns a [stream of tables](/flux/v0.x/get-started/data-structure/#stream-of-tables)
with no grouping (all rows in a single table).
For more information about table grouping, see
[Flux data model - Restructure data](/flux/v0.x/get-started/data-model/#restructure-data).

## Store sensitive credentials as secrets
If using **InfluxDB Cloud** or **InfluxDB OSS 2.x**, we recommend storing Snowflake
connection credentials as [InfluxDB secrets](/influxdb/cloud/security/secrets/).
Use [`secrets.get()`](/flux/v0.x/stdlib/influxdata/influxdb/secrets/get/) to
retrieve a secret from the InfluxDB secrets API.

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
