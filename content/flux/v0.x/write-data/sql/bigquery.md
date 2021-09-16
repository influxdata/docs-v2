---
title: Write to Google BigQuery
list_title: BigQuery
description: >
  Use [`sql.to()`](/flux/v0.x/stdlib/sql/to/) with the `bigquery` driver to
  write data to Google BigQuery.
menu:
  flux_0_x:
    name: BigQuery
    parent: write-to-sql
    identifier: write-bigquery
weight: 101
related:
  - /flux/v0.x/stdlib/sql/to/
list_code_example: |
  ```js
  import "sql"

  data
    |> sql.from(
      driverName: "bigquery",
      dataSourceName: "bigquery://projectid/?apiKey=mySuP3r5ecR3tAP1K3y",
      query: "SELECT * FROM exampleTable"
    )
  ```
---

To write data to [Google BigQuery](https://cloud.google.com/bigquery) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Pipe-forward data into [`sql.to()`](/flux/v0.x/stdlib/sql/to/) and provide
   the following parameters:

    - **driverName**: bigquery
    - **dataSourceName**: _See [data source name](#bigquery-data-source-name)_
    - **table**: Table to write to
    - **batchSize**: Number of parameters or columns that can be queued within
      each call to `Exec` (default is `10000`)

```js
import "sql"

data
  |> sql.to(
    driverName: "bigquery",
    dataSourceName: "bigquery://projectid/?apiKey=mySuP3r5ecR3tAP1K3y",
    table: "exampleTable"
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

## Flux to BigQuery data type conversion
`sql.to()` converts Flux data types to BigQuery data types.

| Flux data type                                | BigQuery data type |
| :-------------------------------------------- | :----------------- |
| [int](/flux/v0.x/data-types/basic/int/)       | INT64              |
| [float](/flux/v0.x/data-types/basic/float/)   | FLOAT64            |
| [string](/flux/v0.x/data-types/basic/string/) | STRING             |
| [bool](/flux/v0.x/data-types/basic/bool/)     | BOOL               |
| [time](/flux/v0.x/data-types/basic/time/)     | TIMESTAMP          |
