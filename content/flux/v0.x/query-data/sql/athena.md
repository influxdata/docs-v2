---
title: Query Amazon Athena
list_title: Amazon Athena
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `awsathena` driver to query Athena.
menu:
  flux_0_x:
    name: Amazon Athena
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"

  sql.from(
    driverName: "awsathena",
    dataSourceName: "s3://myorgqueryresults/?accessID=12ab34cd56ef&region=region-name&secretAccessKey=y0urSup3rs3crEtT0k3n",
    query: "GO SELECT * FROM Example.Table"
  )
  ```
---

To query [Amazon Athena](https://aws.amazon.com/athena) with Flux, import the
[`sql` package](/flux/v0.x/stdlib/sql/) and use the [`sql.from()` function](/flux/v0.x/stdlib/sql/from/)
with the `awsathena` driver.
Provide the following parameters:

- **driverName**: awsathena
- **dataSourceName**: [Athena data source name (DSN)](#data-source-name)
  _(also known as a **connection string**)_
- **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "awsathena",
  dataSourceName: "s3://myorgqueryresults/?accessID=12ab34cd56ef&region=region-name&secretAccessKey=y0urSup3rs3crEtT0k3n",
  query: "GO SELECT * FROM Example.Table"
)
```

##### On this page

- [Data source name](#data-source-name)
- [Data types](#data-types)
- [Results structure](#results-structure)
- [Store sensitive credentials as secrets](#store-sensitive-credentials-as-secrets)

## Data source name
The `awsathena` driver uses the following DSN syntaxes:

```
s3://myorgqueryresults/?accessID=AKIAJLO3F...&region=us-west-1&secretAccessKey=NnQ7MUMp9PYZsmD47c%2BSsXGOFsd%2F...
s3://myorgqueryresults/?accessID=AKIAJLO3F...&db=dbname&missingAsDefault=false&missingAsEmptyString=false&region=us-west-1&secretAccessKey=NnQ7MUMp9PYZsmD47c%2BSsXGOFsd%2F...&WGRemoteCreation=false
```

Use the following query parameters in your Athena S3 connection string (DSN):

{{< req type="key" >}}

- {{< req "\*" >}} **region** - AWS region
- {{< req "\*" >}} **accessID** - AWS IAM access ID
- {{< req "\*" >}} **secretAccessKey** - AWS IAM secret key
- **db** - database name
- **WGRemoteCreation** - controls workgroup and tag creation
- **missingAsDefault** - replace missing data with default values
- **missingAsEmptyString** - replace missing data with empty strings

## Data types
`sql.from()` converts Athena data types to Flux data types.

| Athena data type                        | Flux data type                                |
| :-------------------------------------- | :-------------------------------------------- |
| tinyint, smallint, int, integer, bigint | [int](/flux/v0.x/spec/types/#numeric-types)   |
| float, double, real                     | [float](/flux/v0.x/spec/types/#numeric-types) |
| timestamp with time zone                | [time](/flux/v0.x/spec/types/#time-types)     |
| boolean                                 | [bool](/flux/v0.x/spec/types/#boolean-types)  |

{{% caption %}}
All other Athena data types (including **timestamp**, **date** and **time**)
are converted to strings.
{{% /caption %}}

## Results structure
`sql.from()` returns a [stream of tables](/flux/v0.x/get-started/data-structure/#stream-of-tables)
with no grouping (all rows in a single table).
For more information about table grouping, see
[Flux data model - Restructure data](/flux/v0.x/get-started/data-model/#restructure-data).

## Store sensitive credentials as secrets
If using **InfluxDB Cloud** or **InfluxDB OSS 2.x**, we recommend storing Athena
connection credentials as [InfluxDB secrets](/influxdb/cloud/security/secrets/).
Use [`secrets.get()`](/flux/v0.x/stdlib/influxdata/influxdb/secrets/get/) to
retrieve a secret from the InfluxDB secrets API.

```js
import "sql"
import "influxdata/influxdb/secrets"

region = "us-west-1"
accessID = secrets.get(key: "ATHENA_ACCESS_ID")
secretKey = secrets.get(key: "ATHENA_SECRET_KEY")

sql.from(
 driverName: "awsathena",
 dataSourceName: "s3://myorgqueryresults/?accessID=${accessID}&region=${region}&secretAccessKey=${secretKey}",
 query:"SELECT * FROM example_table"
)
```
