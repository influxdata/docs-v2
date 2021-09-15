---
title: Query SAP HANA
list_title: SAP HANA
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `hdb` driver to query SAP HANA.
menu:
  flux_0_x:
    name: SAP HANA
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "hdb",
    dataSourceName: "hdb://username:password@myserver:30015",
    query: "SELECT * FROM SCHEMA.TABLE"
  )
  ```
---

To query [SAP HANA](https://www.sap.com/products/hana.html) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: hdb
    - **dataSourceName**: _See [data source name](#sap-hana-data-source-name)_
    - **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "hdb",
  dataSourceName: "hdb://username:password@myserver:30015",
  query: "SELECT * FROM SCHEMA.TABLE"
)
```

---

## SAP HANA data source name
The `hdb` driver uses the following DSN syntaxes (also known as a **connection string**):

```
hdb://<user>:<password>@<host>:<port>?<connection-property>=<value>&<connection-property>=<value>&...
hdb://<user>:<password>@<host>:<port>?DATABASENAME=<tenant-db-name>
hdb://?KEY=<keyname>
```

## SAP HANA to Flux data type conversion
`sql.from()` converts SAP HANA data types to Flux data types.

| SAP HANA data type                 | Flux data type                                |
| :--------------------------------- | :-------------------------------------------- |
| TINYINT, SMALLINT, INTEGER, BIGINT | [int](/flux/v0.x/spec/types/#numeric-types)   |
| REAL, DOUBLE, DECIMAL              | [float](/flux/v0.x/spec/types/#numeric-types) |
| {{< req text="\*" color="magenta" >}} TIMESTAMP         | [time](/flux/v0.x/spec/types/#time-types)     |

{{% caption %}}
All other SAP HANA data types are converted to strings.  
{{% /caption %}}

{{< req text="\*" color="magenta" >}} The SAP HANA **TIMESTAMP** data type does
not store time zone information and
[SAP strongly discourages storing data in the local time zone](https://blogs.sap.com/2018/03/28/trouble-with-time/).
For more information, see [Timestamps in SAP HANA](https://help.sap.com/viewer/f1b440ded6144a54ada97ff95dac7adf/2.4/en-US/a394f75dcbe64b42b7a887231af8f15f.html).
