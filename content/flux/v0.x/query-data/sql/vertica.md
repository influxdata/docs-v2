---
title: Query Vertica
list_title: Vertica
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `vertica` driver to query Vertica.
menu:
  flux_0_x:
    name: Vertica
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
  - /flux/v0.x/write-data/sql/vertica/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "vertica",
    dataSourceName: "vertica://username:password@localhost:5432",
    query: "SELECT * FROM public.example_table"
  )
  ```
---

To query [Vertica](https://www.vertica.com/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: vertica or vertigo
    - **dataSourceName**: _See [data source name](#vertica-data-source-name)_
    - **query**: PSQL query to execute

```js
import "sql"

sql.from(
  driverName: "vertica",
  dataSourceName: "vertica://username:password@localhost:5433/dbname",
  query: "SELECT * FROM public.example_table"
)
```

---

## Vertica data source name
The `vertica` and `vertigo` drivers use the following DSN syntax (also known as a **connection string**):

```
vertica://<user>:<password>@<host>:<port>/<database>?<queryArgs>
```

The `vertica` and `vertigo` drivers use the `vertica/vertica-sql-go` implementation.
For information about supported DSN query arguments, see the
[`vertica/vertica-sql-go` documentation](https://github.com/vertica/vertica-sql-go#creating-a-connection).

## Vertica to Flux data type conversion
`sql.from()` converts Vertica data types to Flux data types.

| Vertica data type                                                                    | Flux data type                                |
| :----------------------------------------------------------------------------------- | :-------------------------------------------- |
| INT, INTEGER, BIGINT, SMALLINT, TINYINT, INT2, INT4, INT8, SERIAL2, SERIAL4, SERIAL8 | [int](/flux/v0.x/data-types/basic/int/)       |
| FLOAT, FLOAT4, FLOAT8                                                                | [float](/flux/v0.x/data-types/basic/float/)   |
| DATE, TIME, TIMESTAMP                                                                | [time](/flux/v0.x/data-types/basic/time/)     |
| BOOL                                                                                 | [bool](/flux/v0.x/data-types/basic/bool/)     |
| TEXT, VARCHAR, VARBINARY                                                             | [string](/flux/v0.x/data-types/basic/string/) |

{{% caption %}}
All other Vertica data types are converted to strings.
{{% /caption %}}
