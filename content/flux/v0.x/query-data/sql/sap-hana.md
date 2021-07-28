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

To query [SAP HANA](https://www.sap.com/products/hana.html) with Flux, import the
[`sql` package](/flux/v0.x/stdlib/sql/) and use the [`sql.from()` function](/flux/v0.x/stdlib/sql/from/)
with the `hdb` driver.
Provide the following parameters:

- **driverName**: hdb
- **dataSourceName**: [SAP HANA data source name (DSN)](#data-source-name)
  _(also known as **connection string**)_
- **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "hdb",
  dataSourceName: "hdb://username:password@myserver:30015",
  query: "SELECT * FROM SCHEMA.TABLE"
)
```

##### On this page

- [Data source name](#data-source-name)
- [Data types](#data-types)
- [Results structure](#results-structure)
- [Store sensitive credentials as secrets](#store-sensitive-credentials-as-secrets)

## Data source name
The `hdb` driver uses the following DSN syntaxes:

```
hdb://<user>:<password>@<host>:<port>?<connection-property>=<value>&<connection-property>=<value>&...
hdb://<user>:<password>@<host>:<port>?DATABASENAME=<tenant-db-name>
hdb://?KEY=<keyname>
```

## Data types
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

## Results structure
`sql.from()` returns a [stream of tables](/flux/v0.x/get-started/data-structure/#stream-of-tables)
with no grouping (all rows in a single table).
For more information about table grouping, see
[Flux data model - Restructure data](/flux/v0.x/get-started/data-model/#restructure-data).

## Store sensitive credentials as secrets
If using **InfluxDB Cloud** or **InfluxDB OSS 2.x**, we recommend storing SAP HANA
connection credentials as [InfluxDB secrets](/influxdb/cloud/security/secrets/).
Use [`secrets.get()`](/flux/v0.x/stdlib/influxdata/influxdb/secrets/get/) to
retrieve a secret from the InfluxDB secrets API.

```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "SAP_HANA_USER")
password = secrets.get(key: "SAP_HANA_PASS")

sql.from(
  driverName: "hdb",
  dataSourceName: "hdb://${username}:{password}@myserver:30015",
  query: "SELECT * FROM SCHEMA.TABLE"
)
```
