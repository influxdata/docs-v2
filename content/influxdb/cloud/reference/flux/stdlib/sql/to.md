---
title: sql.to() function
description: The `sql.to()` function writes data to a SQL database.
aliases:
  - /influxdb/cloud/reference/flux/functions/sql/to/
menu:
  influxdb_cloud_ref:
    name: sql.to
    parent: SQL
weight: 202
---

The `sql.to()` function writes data to a SQL database.

_**Function type:** Output_

```js
import "sql"

sql.to(
  driverName: "mysql",
  dataSourceName: "username:password@tcp(localhost:3306)/dbname?param=value",
  table: "example_table",
  batchSize: 10000
)
```

## Parameters

### driverName
The driver used to connect to the SQL database.

_**Data type:** String_

The following drivers are available:

- bigquery
- mysql
- postgres
- snowflake
- sqlite3 – _Does not work with InfluxDB OSS or InfluxDB Cloud. More information [below](#write-data-to-an-sqlite-database)._
- sqlserver, mssql

{{% warn %}}
#### sql.to does not support Amazon Athena
The `sql.to` function does not support writing data to [Amazon Athena](https://aws.amazon.com/athena/).
{{% /warn %}}

### dataSourceName
The data source name (DSN) or connection string used to connect to the SQL database.
The string's form and structure depend on the [driver](#drivername) used.

_**Data type:** String_

##### Driver dataSourceName examples
```sh
# Postgres Driver DSN
postgres://pqgotest:password@localhost/pqgotest?sslmode=verify-full

# MySQL Driver DSN
username:password@tcp(localhost:3306)/dbname?param=value

# Snowflake Driver DSNs
username[:password]@accountname/dbname/schemaname?param1=value1&paramN=valueN
username[:password]@accountname/dbname?param1=value1&paramN=valueN
username[:password]@hostname:port/dbname/schemaname?account=<your_account>&param1=value1&paramN=valueN

# SQLite Driver DSN
file:/path/to/test.db?cache=shared&mode=rw

# Microsoft SQL Server Driver DSNs
sqlserver://username:password@localhost:1234?database=examplebdb
server=localhost;user id=username;database=examplebdb;
server=localhost;user id=username;database=examplebdb;azure auth=ENV
server=localhost;user id=username;database=examplebdbr;azure tenant id=77e7d537;azure client id=58879ce8;azure client secret=0123456789

# Google BigQuery DSNs
bigquery://projectid/?param1=value&param2=value
bigquery://projectid/location?param1=value&param2=value
```

### table
The destination table.

_**Data type:** String_

### batchSize
The number of parameters or columns that can be queued within each call to `Exec`.
Defaults to `10000`.

_**Data type:** Integer_

{{% note %}}
If writing to a **SQLite** database, set `batchSize` to `999` or less.
{{% /note %}}

## Examples

- [MySQL](#write-data-to-a-mysql-database)
- [Postgres](#write-data-to-a-postgres-database)
- [Snowflake](#write-data-to-a-snowflake-database)
- [SQLite](#write-data-to-an-sqlite-database)
- [SQL Server](#write-data-to-a-sql-server-database)
- [Google BigQuery](#write-data-to-a-sql-server-database)

{{% note %}}
The examples below use [InfluxDB secrets](/influxdb/cloud/security/secrets/) to populate
sensitive connection credentials.
{{% /note %}}

### Write data to a MySQL database
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "MYSQL_USER")
password = secrets.get(key: "MYSQL_PASS")

sql.to(
  driverName: "mysql",
  dataSourceName: "${username}:${password}@tcp(localhost:3306)/db",
  table: "example_table"
)
```

### Write data to a Postgres database
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "POSTGRES_USER")
password = secrets.get(key: "POSTGRES_PASS")

sql.to(
  driverName: "postgres",
  dataSourceName: "postgresql://${username}:${password}@localhost",
  table: "example_table"
)
```

### Write data to a Snowflake database
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "SNOWFLAKE_USER")
password = secrets.get(key: "SNOWFLAKE_PASS")
account = secrets.get(key: "SNOWFLAKE_ACCT")

sql.to(
  driverName: "snowflake",
  dataSourceName: "${username}:${password}@${account}/db/exampleschema?warehouse=wh",
  table: "example_table"
)
```

### Write data to an SQLite database

{{% warn %}}
**InfluxDB OSS** and **InfluxDB Cloud** do not have direct access to the local filesystem
and cannot write to SQLite data sources.
Use the [Flux REPL](/influxdb/cloud/tools/repl/) to write to an SQLite data
source on your local filesystem.
{{% /warn %}}

```js
import "sql"

sql.to(
  driverName: "sqlite3",
  dataSourceName: "file:/path/to/test.db?cache=shared&mode=rw",
  table: "example_table"
)
```

### Write data to a SQL Server database
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "SQLSERVER_USER")
password = secrets.get(key: "SQLSERVER_PASS")

sql.to(
  driverName: "sqlserver",
  dataSourceName: "sqlserver://${username}:${password}@localhost:1234?database=examplebdb",
  table: "Example.Table"
)
```

#### SQL Server ADO authentication
Use one of the following methods to provide SQL Server authentication credentials as
[ActiveX Data Objects (ADO)](https://docs.microsoft.com/en-us/sql/ado/guide/ado-introduction?view=sql-server-ver15)
connection string parameters:

- [Retrieve authentication credentials from environment variables](#retrieve-authentication-credentials-from-environment-variables)
- [Retrieve authentication credentials from a file](#retrieve-authentication-credentials-from-a-file)
- [Specify authentication credentials in the connection string](#specify-authentication-credentials-in-the-connection-string)
- [Use a Managed identity in an Azure VM](#use-a-managed-identity-in-an-azure-vm)

##### Retrieve authentication credentials from environment variables
```
azure auth=ENV
```

##### Retrieve authentication credentials from a file
{{% warn %}}
**InfluxDB OSS** and **{{< cloud-name "short" >}}** user interfaces do _**not**_ provide
access to the underlying file system and do not support reading credentials from a file.
To retrieve SQL Server credentials from a file, execute the query in the
[Flux REPL](/influxdb/cloud/tools/repl/) on your local machine.
{{% /warn %}}

```powershell
azure auth=C:\secure\azure.auth
```

##### Specify authentication credentials in the connection string
```powershell
# Example of providing tenant ID, client ID, and client secret token
azure tenant id=77...;azure client id=58...;azure client secret=0cf123..

# Example of providing tenant ID, client ID, certificate path and certificate password
azure tenant id=77...;azure client id=58...;azure certificate path=C:\secure\...;azure certificate password=xY...

# Example of providing tenant ID, client ID, and Azure username and password
azure tenant id=77...;azure client id=58...;azure username=some@myorg;azure password=a1...
```

##### Use a managed identity in an Azure VM
_For information about managed identities, see [Microsoft managed identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview)._

```
azure auth=MSI
```

### Write to a BigQuery database
```js
import "sql"
import "influxdata/influxdb/secrets"
projectID = secrets.get(key: "BIGQUERY_PROJECT_ID")
apiKey = secrets.get(key: "BIGQUERY_APIKEY")
sql.to(
 driverName: "bigquery",
 dataSourceName: "bigquery://${projectID}/?apiKey=${apiKey}",
 table:"exampleTable"
)
```

#### Common BigQuery URL parameters
- **dataset** - BigQuery dataset ID. When set, you can use unqualified table names in queries.

#### BigQuery authentication parameters
The Flux BigQuery implementation uses the Google Cloud Go SDK.
Provide your authentication credentials using one of the following methods:

- The `GOOGLE_APPLICATION_CREDENTIALS` environment variable that identifies the
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
