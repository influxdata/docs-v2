---
title: sql.from() function
description: The `sql.from()` function retrieves data from a SQL data source.
aliases:
  - /influxdb/v2.0/reference/flux/functions/sql/from/
  - /influxdb/v2.0/reference/flux/stdlib/sql/from/
  - /influxdb/cloud/reference/flux/stdlib/sql/from/
menu:
  flux_0_x_ref:
    name: sql.from
    parent: sql
weight: 202
flux/v0.x/tags: [inputs]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/sql/
introduced: 0.34.0
---

The `sql.from()` function retrieves data from a SQL data source.

```js
import "sql"

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://user:password@localhost",
  query:"SELECT * FROM TestTable"
)
```

## Parameters

### driverName {data-type="string"}
The driver used to connect to the SQL database.

The following drivers are available:

- awsathena
- bigquery
- mysql
- postgres
- snowflake
- sqlite3 – _Does not work with InfluxDB OSS or InfluxDB Cloud. More information [below](#query-an-sqlite-database)._
- sqlserver, mssql

### dataSourceName {data-type="string"}
The data source name (DSN) or connection string used to connect to the SQL database.
The string's form and structure depend on the [driver](#drivername) used.

##### Driver dataSourceName examples
```sh
# Amazon Athena Driver DSN
s3://myorgqueryresults/?accessID=AKIAJLO3F...&region=us-west-1&secretAccessKey=NnQ7MUMp9PYZsmD47c%2BSsXGOFsd%2F...
s3://myorgqueryresults/?accessID=AKIAJLO3F...&db=dbname&missingAsDefault=false&missingAsEmptyString=false&region=us-west-1&secretAccessKey=NnQ7MUMp9PYZsmD47c%2BSsXGOFsd%2F...&WGRemoteCreation=false

# MySQL Driver DSN
username:password@tcp(localhost:3306)/dbname?param=value

# Postgres Driver DSN
postgres://pqgotest:password@localhost/pqgotest?sslmode=verify-full

# Snowflake Driver DSNs
username[:password]@accountname/dbname/schemaname?param1=value1&paramN=valueN
username[:password]@accountname/dbname?param1=value1&paramN=valueN
username[:password]@hostname:port/dbname/schemaname?account=<your_account>&param1=value1&paramN=valueN

# SQLite Driver DSN
file:/path/to/test.db?cache=shared&mode=ro

# Microsoft SQL Server Driver DSNs
sqlserver://username:password@localhost:1234?database=examplebdb
server=localhost;user id=username;database=examplebdb;
server=localhost;user id=username;database=examplebdb;azure auth=ENV
server=localhost;user id=username;database=examplebdbr;azure tenant id=77e7d537;azure client id=58879ce8;azure client secret=0123456789

# Google BigQuery DSNs
bigquery://projectid/?param1=value&param2=value
bigquery://projectid/location?param1=value&param2=value
```

### query {data-type="string"}
The query to run against the SQL database.

## Examples

- [MySQL](#query-a-mysql-database)
- [Postgres](#query-a-postgres-database)
- [Snowflake](#query-a-snowflake-database)
- [SQLite](#query-an-sqlite-database)
- [Amazon Athena](#query-an-amazon-athena-database)
- [SQL Server](#query-a-sql-server-database)
- [Google BigQuery](#query-a-bigquery-database)

{{% note %}}
The examples below use [InfluxDB secrets](/influxdb/v2.0/security/secrets/) to populate
sensitive connection credentials.
{{% /note %}}

### Query a MySQL database
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "MYSQL_USER")
password = secrets.get(key: "MYSQL_PASS")

sql.from(
 driverName: "mysql",
 dataSourceName: "${username}:${password}@tcp(localhost:3306)/db",
 query:"SELECT * FROM example_table"
)
```

### Query a Postgres database
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "POSTGRES_USER")
password = secrets.get(key: "POSTGRES_PASS")

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://${username}:${password}@localhost",
  query:"SELECT * FROM example_table"
)
```

### Query a Snowflake database
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "SNOWFLAKE_USER")
password = secrets.get(key: "SNOWFLAKE_PASS")
account = secrets.get(key: "SNOWFLAKE_ACCT")

sql.from(
  driverName: "snowflake",
  dataSourceName: "${username}:${password}@${account}/db/exampleschema?warehouse=wh",
  query: "SELECT * FROM example_table"
)
```

### Query an SQLite database

{{% warn %}}
**InfluxDB OSS** and **InfluxDB Cloud** do not have direct access to the local filesystem
and cannot query SQLite data sources.
Use the [Flux REPL](/influxdb/v2.0/tools/repl/) to query a SQLite data source
on your local filesystem.
{{% /warn %}}

```js
import "sql"

sql.from(
  driverName: "sqlite3",
  dataSourceName: "file:/path/to/test.db?cache=shared&mode=ro",
  query: "SELECT * FROM example_table"
)
```

### Query an Amazon Athena database
```js
import "sql"
import "influxdata/influxdb/secrets"

region = us-west-1
accessID = secrets.get(key: "ATHENA_ACCESS_ID")
secretKey = secrets.get(key: "ATHENA_SECRET_KEY")

sql.from(
 driverName: "awsathena",
 dataSourceName: "s3://myorgqueryresults/?accessID=${accessID}&region=${region}&secretAccessKey=${secretKey}",
 query:"SELECT * FROM example_table"
)
```

##### Athena connection string
To query an Amazon Athena database, use the following query parameters in your Athena
S3 connection string (DSN):

{{< req type="key" >}}

- {{< req "\*" >}} **region** - AWS region
- {{< req "\*" >}} **accessID** - AWS IAM access ID
- {{< req "\*" >}} **secretAccessKey** - AWS IAM secret key
- **db** - database name
- **WGRemoteCreation** - controls workgroup and tag creation
- **missingAsDefault** - replace missing data with default values
- **missingAsEmptyString** - replace missing data with empty strings


### Query a SQL Server database
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "SQLSERVER_USER")
password = secrets.get(key: "SQLSERVER_PASS")

sql.from(
  driverName: "sqlserver",
  dataSourceName: "sqlserver://${username}:${password}@localhost:1234?database=examplebdb",
  query: "GO SELECT * FROM Example.Table"
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
[Flux REPL](/influxdb/v2.0/tools/repl/) on your local machine.
{{% /warn %}}

```powershel
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

### Query a BigQuery database
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
