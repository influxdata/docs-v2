---
title: Query SQLite
list_title: SQLite
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `sqlite3` driver to query SQLite.
menu:
  flux_0_x:
    name: SQLite
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"

  sql.from(
    driverName: "sqlite3",
    dataSourceName: "file:/path/to/example.db?cache=shared&mode=ro",
    query: "SELECT * FROM example_table"
  )
  ```
---

To query [SQLite](https://www.sqlite.org/index.html) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: sqlite3
    - **dataSourceName**: _See [data source name](#data-source-name)_
    - **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "sqlite3",
  dataSourceName: "file:/path/to/example.db?cache=shared&mode=ro",
  query: "SELECT * FROM example_table"
)
```

{{% note %}}
#### Requires file system access
To query SQLite, Flux must have access to the filesystem.
If Flux does not have access to the file system, the query will return an error
similar to one of the following:

- `Error: unable to open database file`
- `failed to read file: filesystem service is uninitialized`
- `An internal error has occurred`

If using **InfluxDB Cloud** or **InfluxDB OSS**, the Flux process **does not**
have access to the filesystem.
{{% /note %}}

##### On this page

- [Data source name](#data-source-name)
- [Data type conversion](#data-type-conversion)

## Data source name
The `sqlite3` driver uses the following DSN syntax (also known as a **connection string**):

```
file:/path/to/example.db?param=value
```

## Data type conversion
`sql.from()` converts SQLite data types to Flux data types.

| SQLite data type                        | Flux data type                                |
| :-------------------------------------- | :-------------------------------------------- |
| INT, INTEGER, BIGINT, SMALLINT, TINYINT | [int](/flux/v0.x/spec/types/#numeric-types)   |
| FLOAT, DOUBLE                           | [float](/flux/v0.x/spec/types/#numeric-types) |
| DATETIME, TIMESTAMP, DATE               | [time](/flux/v0.x/spec/types/#time-types)     |
| BOOL                                    | [int](/flux/v0.x/spec/types/#numeric-types)   |
| TEXT                                    | [string](/flux/v0.x/spec/types/#string-types) |

{{% caption %}}
All other SQLite data types are converted to strings.
{{% /caption %}}
