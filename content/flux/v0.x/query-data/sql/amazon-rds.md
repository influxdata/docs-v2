---
title: Query Amazon RDS
list_title: Amazon RDS
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) to query a relational database
  hosted on Amazon RDS.
menu:
  flux_0_x:
    name: Amazon RDS
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "snowflake",
    dataSourceName: "user:password@account/db/exampleschema?warehouse=wh",
    query: "SELECT * FROM example_table"
  )
  ```
---

To query a relational database hosted on [Amazon Relational Database Service (RDS)](https://aws.amazon.com/rds/)
with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/)
2. Use the [`sql.from()` function](/flux/v0.x/stdlib/sql/from/) and provide the
  following parameters:

    - **driverName**: _Determined by your [Amazon RDS database engine](#supported-database-engines)_
    - **dataSourceName**: _Determined by your [Amazon RDS database engine](#supported-database-engines)_
    - **query**: SQL query to execute

##### Query Amazon RDS PostgreSQL database
```js
import "sql"

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://my-instance.123456789012.us-east-1.rds.amazonaws.com:5432",
  query: "SELECT * FROM example_table"
)
```

## Supported database engines
Use the following guides to query supported Amazon RDS database engines:

- [Query MariaDB](/flux/v0.x/query-data/sql/mariadb/)
- [Query MySQL](/flux/v0.x/query-data/sql/mysql/)
- [Query PostgreSQL](/flux/v0.x/query-data/sql/postgresql/)
- [Query SQL Server](/flux/v0.x/query-data/sql/sql-server/)

## Amazon RDS connection credentials
Amazon RDS provides connection credentials required to connect to your database instance.
The following links provide more information for each database engine:

- [Connect to MariaDB](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToMariaDBInstance.html)
- [Connect to MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstance.html)
- [Connect to PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html)
- [Connect to SQL Server](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToMicrosoftSQLServerInstance.html)
