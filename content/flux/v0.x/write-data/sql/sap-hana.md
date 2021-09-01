---
title: Write to SAP HANA
list_title: SAP HANA
description: >
  Use [`sql.to()`](/flux/v0.x/stdlib/sql/to/) with the `hdb` driver to write
  data to SAP HANA.
menu:
  flux_0_x:
    name: SAP HANA
    parent: write-to-sql
    identifier: write-sap-hana
weight: 101
related:
  - /flux/v0.x/stdlib/sql/to/
list_code_example: |
  ```js
  import "sql"
  
  data
    |> sql.to(
      driverName: "hdb",
      dataSourceName: "hdb://username:password@myserver:30015",
      table: "SCHEMA.TABLE"
    )
  ```
---

To write data to [SAP HANA](https://www.sap.com/products/hana.html) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Pipe-forward data into [`sql.to()`](/flux/v0.x/stdlib/sql/to/) and provide
   the following parameters:

    - **driverName**: hdb
    - **dataSourceName**: _See [data source name](#data-source-name)_
    - **table**: Table to write to
    - **batchSize**: Number of parameters or columns that can be queued within
      each call to `Exec` (default is `10000`)

```js
import "sql"
  
data
  |> sql.to(
    driverName: "hdb",
    dataSourceName: "hdb://username:password@myserver:30015",
    table: "SCHEMA.TABLE"
  )
```

##### On this page

- [Data source name](#data-source-name)
- [Data type conversion](#data-type-conversion)

## Data source name
The `hdb` driver uses the following DSN syntaxes (also known as a **connection string**):

```
hdb://<user>:<password>@<host>:<port>?<connection-property>=<value>&<connection-property>=<value>&...
hdb://<user>:<password>@<host>:<port>?DATABASENAME=<tenant-db-name>
hdb://?KEY=<keyname>
```

## Data type conversion
`sql.to()` converts Flux data types to SAP HANA data types.

| Flux data type                                | SAP HANA data type                              |
| :-------------------------------------------- | :---------------------------------------------- |
| [float](/flux/v0.x/spec/types/#numeric-types) | DOUBLE                                          |
| [int](/flux/v0.x/spec/types/#numeric-types)   | BIGINT                                          |
| [string](/flux/v0.x/spec/types/#string-types) | NVARCHAR(5000)                                  |
| [bool](/flux/v0.x/spec/types/#boolean-types)  | BOOLEAN                                         |
| [time](/flux/v0.x/spec/types/#time-types)     | {{< req text="\*" color="magenta" >}} TIMESTAMP |

{{< req text="\*" color="magenta" >}} The SAP HANA **TIMESTAMP** data type does
not store time zone information and
[SAP strongly discourages storing data in the local time zone](https://blogs.sap.com/2018/03/28/trouble-with-time/).
For more information, see [Timestamps in SAP HANA](https://help.sap.com/viewer/f1b440ded6144a54ada97ff95dac7adf/2.4/en-US/a394f75dcbe64b42b7a887231af8f15f.html).
