---
title: Query Amazon Athena
list_title: Amazon Athena
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `awsathena` driver to query Athena.
menu:
  flux_0_x:
    name: Athena
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

To query [Amazon Athena](https://aws.amazon.com/athena) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: awsathena
    - **dataSourceName**: _See [data source name](#data-source-name)_
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
- [Data type conversion](#data-type-conversion)

## Data source name
The `awsathena` driver uses the following data source name (DSN) syntaxes (also known as a **connection string**):

```
s3://myorgqueryresults/?accessID=AKIAJLO3F...&region=us-west-1&secretAccessKey=NnQ7MUMp9PYZsmD47c%2BSsXGOFsd%2F...
s3://myorgqueryresults/?accessID=AKIAJLO3F...&db=dbname&missingAsDefault=false&missingAsEmptyString=false&region=us-west-1&secretAccessKey=NnQ7MUMp9PYZsmD47c%2BSsXGOFsd%2F...&WGRemoteCreation=false
```

Use the following query parameters in your Athena S3 DSN:

{{< req type="key" >}}

- {{< req "\*" >}} **region** - AWS region
- {{< req "\*" >}} **accessID** - AWS IAM access ID
- {{< req "\*" >}} **secretAccessKey** - AWS IAM secret key
- **db** - database name
- **WGRemoteCreation** - controls workgroup and tag creation
- **missingAsDefault** - replace missing data with default values
- **missingAsEmptyString** - replace missing data with empty strings

## Data type conversion
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
