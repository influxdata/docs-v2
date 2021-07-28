---
title: Query CockroachDB
list_title: CockroachDB
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `postgres` driver to query CockroachDB.
menu:
  flux_0_x:
    name: CockroachDB
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "postgres",
    dataSourceName: "postgresql://username:password@localhost:26257/cluster_name.defaultdb?sslmode=verify-full&sslrootcert=certs_dir/cc-ca.crt",
    query: "SELECT * FROM example_table"
  )
  ```
---

To query [CockroachDB](https://www.cockroachlabs.com/) with Flux, import the
[`sql` package](/flux/v0.x/stdlib/sql/) and use the [`sql.from()` function](/flux/v0.x/stdlib/sql/from/)
with the `postgres` driver.
The `postgres` driver use the [Go `pq` implementation](https://www.cockroachlabs.com/docs/stable/build-a-go-app-with-cockroachdb-pq)
to interact with CockroachDB.
Provide the following parameters:

- **driverName**: postgres
- **dataSourceName**: [CockroachDB data source name (DSN)](#data-source-name)
  _(also known as **connection string**)_
- **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://username:password@localhost:26257/cluster_name.defaultdb?sslmode=verify-full&sslrootcert=certs_dir/cc-ca.crt",
  query: "SELECT * FROM example_table"
)
```

##### On this page

- [Data source name](#data-source-name)
- [Data types](#data-types)
- [Results structure](#results-structure)
- [Store sensitive credentials as secrets](#store-sensitive-credentials-as-secrets)

## Data source name
The `postgres` driver uses the following DSN syntax to connect to CockroachDB:

```
postgres://username:password@localhost:26257/cluster_name.defaultdb?sslmode=verify-full&sslrootcert=certs_dir/cc-ca.crt
```

## Data types
`sql.from()` converts PostgreSQL and CockroachDB data types to Flux data types.

| CockroachDB data type                                                        | Flux data type                                  |
| :-------------------------------------------------------------------------- | :---------------------------------------------- |
| INT, BIGINT, SMALLINT, TINYINT, INT2, INT4, INT8, SERIAL2, SERIAL4, SERIAL8 | [int](/flux/v0.x/spec/types/#numeric-types)     |
| FLOAT4, FLOAT8                                                              | [float](/flux/v0.x/spec/types/#numeric-types)   |
| DATE, TIME, TIMESTAMP                                                       | [time](/flux/v0.x/spec/types/#time-types)       |
| BOOL                                                                        | [bool](/flux/v0.x/spec/types/#boolean-types)    |
| TEXT                                                                        | [string](/flux/v0.x/spec/types/#string-types)   |

{{% caption %}}
All other CockroachDB data types are converted to strings.
{{% /caption %}}

## Results structure
`sql.from()` returns a [stream of tables](/flux/v0.x/get-started/data-structure/#stream-of-tables)
with no grouping (all rows in a single table).
For more information about table grouping, see
[Flux data model - Restructure data](/flux/v0.x/get-started/data-model/#restructure-data).

## Store sensitive credentials as secrets
If using **InfluxDB Cloud** or **InfluxDB OSS 2.x**, we recommend storing CockroachDB
connection credentials as [InfluxDB secrets](/influxdb/cloud/security/secrets/).
Use [`secrets.get()`](/flux/v0.x/stdlib/influxdata/influxdb/secrets/get/) to
retrieve a secret from the InfluxDB secrets API.

```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "COCKROACHDB_USER")
password = secrets.get(key: "COCKROACHDB_PASS")

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://${username}:${password}@localhost:26257/mycluster.mydb?sslmode=verify-full&sslrootcert=certs_dir/cc-ca.crt",
  query: "SELECT * FROM example_table"
)
```
