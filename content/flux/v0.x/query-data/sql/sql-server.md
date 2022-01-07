---
title: Query SQL Server
list_title: SQL Server
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `sqlserver` or `mssql`
  driver to query SQL Server.
menu:
  flux_0_x:
    name: SQL Server
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"

  sql.from(
    driverName: "sqlserver",
    dataSourceName: "sqlserver://user:password@localhost:1433?database=examplebdb",
    query: "GO SELECT * FROM Example.Table"
  )
  ```
---

To query [Microsoft SQL Server](https://www.microsoft.com/sql-server/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: sqlserver _or_ mssql
    - **dataSourceName**: _See [data source name](#sql-server-data-source-name)_
    - **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "sqlserver",
  dataSourceName: "sqlserver://user:password@localhost:1433?database=examplebdb",
  query: "GO SELECT * FROM Example.Table"
)
```

---

- [SQL Server data source name](#sql-server-data-source-name)
- [SQL Server ADO authentication](#sql-server-ado-authentication)
- [SQL Server to Flux data type conversion](#sql-server-to-flux-data-type-conversion)

## SQL Server data source name
The `sqlserver` and `mssql` drivers use the following DSN syntaxes (also known as a **connection string**):

```
sqlserver://username:password@localhost:1433?database=examplebdb
server=localhost;user id=username;database=examplebdb;
server=localhost;user id=username;database=examplebdb;azure auth=ENV
server=localhost;user id=username;database=examplebdbr;azure tenant id=77e7d537;azure client id=58879ce8;azure client secret=0143356789
```

## SQL Server ADO authentication
Use one of the following methods to provide SQL Server authentication credentials as
[ActiveX Data Objects (ADO)](https://docs.microsoft.com/en-us/sql/ado/guide/ado-introduction?view=sql-server-ver15)
DSN parameters:

- [Retrieve authentication credentials from environment variables](#retrieve-authentication-credentials-from-environment-variables)
- [Retrieve authentication credentials from a file](#retrieve-authentication-credentials-from-a-file)
- [Specify authentication credentials in the DSN](#specify-authentication-credentials-in-the-dsn)
- [Use a Managed identity in an Azure VM](#use-a-managed-identity-in-an-azure-vm)

### Retrieve authentication credentials from environment variables
```
azure auth=ENV
```

### Retrieve authentication credentials from a file
{{% warn %}}
**{{< cloud-name "short" >}}** and **InfluxDB OSS** _**do not**_ have access to
the underlying file system and do not support reading credentials from a file.
To retrieve SQL Server credentials from a file, execute the query in the
[Flux REPL](/{{< latest "influxdb" >}}/tools/repl/) on your local machine.
{{% /warn %}}

```powershell
azure auth=C:\secure\azure.auth
```

### Specify authentication credentials in the DSN
```powershell
# Example of providing tenant ID, client ID, and client secret token
azure tenant id=77...;azure client id=58...;azure client secret=0cf123..

# Example of providing tenant ID, client ID, certificate path and certificate password
azure tenant id=77...;azure client id=58...;azure certificate path=C:\secure\...;azure certificate password=xY...

# Example of providing tenant ID, client ID, and Azure username and password
azure tenant id=77...;azure client id=58...;azure username=some@myorg;azure password=a1...
```

### Use a managed identity in an Azure VM
_For information about managed identities, see [Microsoft managed identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview)._

```
azure auth=MSI
```

## SQL Server to Flux data type conversion
`sql.from()` converts SQL Server data types to Flux data types.

| SQL Server data type                    | Flux data type                              |
| :-------------------------------------- | :------------------------------------------ |
| INT, TINYINT, SMALLINT, BIGINT          | [int](/flux/v0.x/data-types/basic/int/)     |
| DECIMAL, REAL, FLOAT, MONEY, SMALLMONEY | [float](/flux/v0.x/data-types/basic/float/) |
| DATETIMEOFFSET                          | [time](/flux/v0.x/data-types/basic/time/)   |
| BIT                                     | [bool](/flux/v0.x/data-types/basic/bool/)   |

{{% caption %}}
All other SQL Server data types (including other [date/time types](https://docs.microsoft.com/sql/t-sql/functions/date-and-time-data-types-and-functions-transact-sql?view=sql-server-ver15#DateandTimeDataTypes))
are converted to strings.
{{% /caption %}}
