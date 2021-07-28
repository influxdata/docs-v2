---
title: Query Google BigQuery
list_title: BigQuery
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `bigquery` driver to query Google BigQuery.
menu:
  flux_0_x:
    name: BigQuery
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"

  sql.from(
    driverName: "bigquery",
    dataSourceName: "bigquery://projectid/?apiKey=mySuP3r5ecR3tAP1K3y",
    query: "SELECT * FROM exampleTable"
  )
  ```
---

To query [Google BigQuery](https://cloud.google.com/bigquery) with Flux, import
the [`sql` package](/flux/v0.x/stdlib/sql/) and use the [`sql.from()` function](/flux/v0.x/stdlib/sql/from/)
with the `bigquery` driver.
Provide the following parameters:

- **driverName**: bigquery
- **dataSourceName**: [BigQuery data source name (DSN)](#data-source-name)
  _(also known as **connection string**)_
- **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "bigquery",
  dataSourceName: "bigquery://projectid/?apiKey=mySuP3r5ecR3tAP1K3y",
  query: "SELECT * FROM exampleTable"
)
```

##### On this page

- [Data source name](#data-source-name)
- [Data types](#data-types)
- [Results structure](#results-structure)
- [Store sensitive credentials as secrets](#store-sensitive-credentials-as-secrets)

## Data source name
The `bigquery` driver uses the following DSN syntaxes:

```
bigquery://projectid/?param1=value&param2=value
bigquery://projectid/location?param1=value&param2=value
```

### Common BigQuery URL parameters
- **dataset** - BigQuery dataset ID. When set, you can use unqualified table names in queries.

### BigQuery authentication parameters
The Flux BigQuery implementation uses the [Google Cloud Go SDK](https://cloud.google.com/go/docs/reference/cloud.google.com/go/latest).
Provide your authentication credentials using one of the following methods:

- Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to identify the
  location of your credential JSON file.
- Provide your BigQuery API key using the **apiKey** URL parameter in your BigQuery DSN.

    ###### Example apiKey URL parameter
    ```
    bigquery://projectid/?apiKey=AIzaSyB6XK8IO5AzKZXoioQOVNTFYzbDBjY5hy4
    ```

- Provide your base-64 encoded service account, refresh token, or JSON credentials
  using the **credentials** URL parameter in your BigQuery DSN.

    ###### Example credentials URL parameter
    ```
    bigquery://projectid/?credentials=eyJ0eXBlIjoiYXV0...
    ```

## Data types
`sql.from()` converts BigQuery data types to Flux data types.

| BigQuery data type | Flux data type                                |
| :----------------- | :-------------------------------------------- |
| INTEGER            | [int](/flux/v0.x/spec/types/#numeric-types)   |
| FLOAT, NUMERIC     | [float](/flux/v0.x/spec/types/#numeric-types) |
| TIMESTAMP          | [time](/flux/v0.x/spec/types/#time-types)     |
| BOOLEAN            | [bool](/flux/v0.x/spec/types/#boolean-types)  |

{{% caption %}}
All other BigQuery data types (including **DATE**, **TIME** and **DATETIME**)
are converted to strings.
{{% /caption %}}

## Results structure
`sql.from()` returns a [stream of tables](/flux/v0.x/get-started/data-structure/#stream-of-tables)
with no grouping (all rows in a single table).
For more information about table grouping, see
[Flux data model - Restructure data](/flux/v0.x/get-started/data-model/#restructure-data).

## Store sensitive credentials as secrets
If using **InfluxDB Cloud** or **InfluxDB OSS 2.x**, we recommend storing BigQuery
connection credentials as [InfluxDB secrets](/influxdb/cloud/security/secrets/).
Use [`secrets.get()`](/flux/v0.x/stdlib/influxdata/influxdb/secrets/get/) to
retrieve a secret from the InfluxDB secrets API.

```js
import "sql"
import "influxdata/influxdb/secrets"

projectID = secrets.get(key: "BIGQUERY_PROJECT_ID")
apiKey = secrets.get(key: "BIGQUERY_APIKEY")

sql.from(
  driverName: "bigquery",
  dataSourceName: "bigquery://${projectID}/?apiKey=${apiKey}",
  query:"SELECT * FROM exampleTable"
)
```
