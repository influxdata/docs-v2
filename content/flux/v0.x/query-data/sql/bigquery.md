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

To query [Google BigQuery](https://cloud.google.com/bigquery) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: bigquery
    - **dataSourceName**: _See [data source name](#bigquery-data-source-name)_
    - **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "bigquery",
  dataSourceName: "bigquery://projectid/?apiKey=mySuP3r5ecR3tAP1K3y",
  query: "SELECT * FROM exampleTable"
)
```

---

## BigQuery data source name
The `bigquery` driver uses the following DSN syntaxes (also known as a **connection string**):

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

## Data type conversion
`sql.from()` converts BigQuery data types to Flux data types.

| BigQuery data type | Flux data type                              |
| :----------------- | :------------------------------------------ |
| INTEGER            | [int](/flux/v0.x/data-types/basic/int/)     |
| FLOAT, NUMERIC     | [float](/flux/v0.x/data-types/basic/float/) |
| TIMESTAMP          | [time](/flux/v0.x/data-types/basic/time/)   |
| BOOLEAN            | [bool](/flux/v0.x/data-types/basic/bool/)   |

{{% caption %}}
All other BigQuery data types (including **DATE**, **TIME** and **DATETIME**)
are converted to strings.
{{% /caption %}}
