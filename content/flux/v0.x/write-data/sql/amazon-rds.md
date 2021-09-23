---
title: Write to Amazon RDS
list_title: Amazon RDS
description: >
  Use [`sql.to()`](/flux/v0.x/stdlib/sql/to/) to write data to a relational
  database hosted on Amazon RDS.
menu:
  flux_0_x:
    name: Amazon RDS
    parent: write-to-sql
    identifier: write-amazon-rds
weight: 101
related:
  - /flux/v0.x/stdlib/sql/to/
list_code_example: |
  ```js
  import "sql"
  
  data
    |> sql.to(
      driverName: "snowflake",
      dataSourceName: "postgresql://my-instance.123456789012.us-east-1.rds.amazonaws.com:5432",
      query: "SELECT * FROM example_table"
    )
  ```
---

To write data to a relational database hosted on [Amazon Relational Database Service (RDS)](https://aws.amazon.com/rds/)
with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/)
2. Pipe-forward data into [`sql.to()`](/flux/v0.x/stdlib/sql/to/) and provide the
  following parameters:

    - **driverName**: _Determined by your [Amazon RDS database engine](#supported-database-engines)_
    - **dataSourceName**: _Determined by your [Amazon RDS database engine](#supported-database-engines)_
    - **table**: Table to write to
    - **batchSize**: Number of parameters or columns that can be queued within
      each call to `Exec` (default is `10000`)

##### Write to an Amazon RDS PostgreSQL database
```js
import "sql"

data
  |> sql.to(
    driverName: "postgres",
    dataSourceName: "postgresql://my-instance.123456789012.us-east-1.rds.amazonaws.com:5432",
    table: "example_table"
  )
```

## Supported database engines
Use the following guides to query supported Amazon RDS database engines:

- [Write to MariaDB](/flux/v0.x/write-data/sql/mariadb/)
- [Write to MySQL](/flux/v0.x/write-data/sql/mysql/)
- [Write to PostgreSQL](/flux/v0.x/write-data/sql/postgresql/)
- [Write to SQL Server](/flux/v0.x/write-data/sql/sql-server/)

## Amazon RDS connection credentials
Amazon RDS provides connection credentials required to connect to your database instance.
The following links provide more information for each database engine:

- [Connect to MariaDB](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToMariaDBInstance.html)
- [Connect to MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstance.html)
- [Connect to PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html)
- [Connect to SQL Server](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToMicrosoftSQLServerInstance.html)
