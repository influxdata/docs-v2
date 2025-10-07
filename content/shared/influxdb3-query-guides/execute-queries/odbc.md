Use the Arrow Flight SQL ODBC driver to execute SQL queries against
{{% product-name %}} from ODBC-compatible applications and programming languages.

ODBC (Open Database Connectivity) is a standard API for accessing database
management systems. The Arrow Flight SQL ODBC driver enables ODBC-compatible
applications to connect to {{% product-name %}} and query data using SQL.

- [Download and install the ODBC driver](#download-and-install-the-odbc-driver)
- [Configure a data source](#configure-a-data-source)
- [Connect and query from applications](#connect-and-query-from-applications)
- [Use ODBC with programming languages](#use-odbc-with-programming-languages)

## Download and install the ODBC driver

{{% product-name %}} uses the Arrow Flight SQL ODBC driver to enable ODBC connectivity.

> [!Note]
> For more information about the Arrow Flight SQL ODBC Driver, see the [Dremio documentation](https://docs.dremio.com/current/client-applications/drivers/arrow-flight-sql-odbc-driver/).

{{< tabs-wrapper >}}
{{% tabs %}}
[Windows (PowerShell)](#)
[Windows (Manual)](#)
[macOS and Linux](#)
{{% /tabs %}}

{{% tab-content %}}
Run the following PowerShell commands to download and install:

{{% code-placeholders "YOUR_USER" %}}
```powershell
# Set the driver path
$driverPath = "C:\Users\YOUR_USER\Downloads\arrow-flight-sql-odbc-0.9.7.1195-win64.msi"

# Download the driver
Invoke-WebRequest -Uri "https://docs.influxdata.com/downloads/arrow-flight-sql-odbc-0.9.7.1195-win64.msi" `
  -OutFile $driverPath

# Mark as trusted
Unblock-File $driverPath

# Install
Start-Process msiexec.exe -Wait -ArgumentList "/i `"$driverPath`""
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`YOUR_USER`{{% /code-placeholder-key %}}: Your Windows username

#### Verify installation

1. Open **ODBC Data Source Administrator (64-bit)**
2. Navigate to the **Drivers** tab
3. Verify **Arrow Flight SQL ODBC Driver** appears in the list

{{% /tab-content %}}

{{% tab-content %}}
<a class="btn" href="https://docs.influxdata.com/downloads/arrow-flight-sql-odbc-0.9.7.1195-win64.msi">Download the Arrow Flight SQL ODBC driver</a>

1. Run the downloaded `.msi` installer
2. Follow the installation wizard using default settings
3. Complete the installation

#### Verify installation

1. Open **ODBC Data Source Administrator (64-bit)**
2. Navigate to the **Drivers** tab
3. Verify **Arrow Flight SQL ODBC Driver** appears in the list

{{% /tab-content %}}

{{% tab-content %}}
Download from Dremio:

- [**macOS (Universal)**](https://download.dremio.com/arrow-flight-sql-odbc-driver/arrow-flight-sql-odbc-LATEST-universal.pkg)
- [**Linux (x86_64)**](https://download.dremio.com/arrow-flight-sql-odbc-driver/arrow-flight-sql-odbc-LATEST-linux-x86_64.tar.gz)

#### Install on macOS

1. Run the downloaded `.pkg` installer
2. Follow the installation prompts
3. Enter your administrator password when prompted
4. Complete the installation

#### Install on Linux

1. Extract the downloaded archive:

   ```bash
   tar -xzf arrow-flight-sql-odbc-LATEST-linux-x86_64.tar.gz
   ```

2. Install the driver (installation location may vary by distribution):

   ```bash
   sudo mkdir -p /opt/arrow-flight-sql-odbc
   sudo cp -r lib /opt/arrow-flight-sql-odbc/
   ```

3. Configure the driver in `/etc/odbcinst.ini`:

   ```ini
   [Arrow Flight SQL ODBC Driver]
   Description = Arrow Flight SQL ODBC Driver
   Driver = /opt/arrow-flight-sql-odbc/lib/libarrow-odbc.so
   ```

#### Verify installation

To verify the driver is installed correctly, run:

```bash
odbcinst -q -d
```

The output should include **Arrow Flight SQL**.

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Configure a data source

After installing the Arrow Flight SQL ODBC driver, configure a data source to
connect to {{% product-name %}}.

{{< tabs-wrapper >}}
{{% tabs %}}
[Windows](#)
[macOS and Linux](#)
{{% /tabs %}}

{{% tab-content %}}
1. Open **ODBC Data Source Administrator (64-bit)**
2. Navigate to the **System DSN** or **User DSN** tab
3. Click **Add**
4. Select **Arrow Flight SQL ODBC Driver** and click **Finish**
5. Configure the connection:

   - **Data Source Name**: Provide a descriptive name (for example, `InfluxDB3`)
   - **Host**: Your {{% product-name %}} host (for example, {{% show-in "cloud-serverless" %}}`us-west-2-1.aws.cloud2.influxdata.com`{{% /show-in %}}{{% show-in "enterprise,core" %}}`localhost`{{% /show-in %}}{{% show-in "cloud-dedicated" %}}`cluster-id.a.influxdb.io`{{% /show-in %}}{{% show-in "clustered" %}}`cluster-host.com`{{% /show-in %}})
   - **Port**: Your InfluxDB URL port {{% show-in "cloud-serverless,cloud-dedicated,clustered" %}}(for example, `443` (HTTPS){{% /show-in %}}{{% show-in "enterprise,core" %}}`8181` (default){{% /show-in %}})
   - **Database**: Your database name
   - **Auth Token**: Your {{% show-in "cloud-dedicated,clustered" %}}{{% token-link "database" %}}{{% /show-in %}}{{% show-in "cloud-serverless" %}}{{% token-link %}}{{% /show-in %}}{{% show-in "core,enterprise" %}}{{% token-link "admin" "database" %}}{{% /show-in %}}{{% show-in "cloud-dedicated,clustered,enterprise" %}}&nbsp;with query permissions for the target database{{% /show-in %}}
   - **Use Encryption**: Enable for HTTPS connections

6. Click **Test** to verify the connection
7. Click **OK** to save

{{% /tab-content %}}

{{% tab-content %}}
Create or edit `~/.odbc.ini` (user DSN) or `/etc/odbc.ini` (system DSN):

{{% show-in "enterprise,core" %}}
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```ini
[InfluxDB3]
Driver = Arrow Flight SQL ODBC Driver
Host = localhost
Port = 8181
Database = DATABASE_NAME
AuthToken = DATABASE_TOKEN
UseEncryption = 1
```
{{% /code-placeholders %}}
{{% /show-in %}}

{{% show-in "cloud-serverless" %}}
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```ini
[InfluxDB3]
Driver = Arrow Flight SQL ODBC Driver
Host = us-west-2-1.aws.cloud2.influxdata.com
Port = 443
Database = DATABASE_NAME
AuthToken = DATABASE_TOKEN
UseEncryption = 1
```
{{% /code-placeholders %}}
{{% /show-in %}}

{{% show-in "cloud-dedicated" %}}
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```ini
[InfluxDB3]
Driver = Arrow Flight SQL ODBC Driver
Host = cluster-id.a.influxdb.io
Port = 443
Database = DATABASE_NAME
AuthToken = DATABASE_TOKEN
UseEncryption = 1
```
{{% /code-placeholders %}}
{{% /show-in %}}

{{% show-in "clustered" %}}
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```ini
[InfluxDB3]
Driver = Arrow Flight SQL ODBC Driver
Host = cluster-host.com
Port = 443
Database = DATABASE_NAME
AuthToken = DATABASE_TOKEN
UseEncryption = 1
```
{{% /code-placeholders %}}
{{% /show-in %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Your database name
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: Your {{% token-link "database" %}}{{% show-in "enterprise" %}} with query permissions{{% /show-in %}}

Test the connection:

```bash
isql -v InfluxDB3
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Connect and query from applications

After configuring a data source, connect from ODBC-compatible applications:

### Power BI

See [Use Power BI to visualize data](/influxdb3/version/visualize-data/powerbi/).

### Tableau

See [Use Tableau to visualize data](/influxdb3/version/visualize-data/tableau/).

### Excel

1. Open Excel
2. Go to **Data** > **Get Data** > **From Other Sources** > **From ODBC**
3. Select your InfluxDB data source
4. Enter credentials if prompted
5. Select tables and load data

### DBeaver

1. Create a new database connection
2. Select **ODBC** as the connection type
3. Configure the connection:
   - **Database/Schema**: Your InfluxDB database
   - **ODBC DSN**: Your configured data source name
4. Test and save the connection

## Use ODBC with programming languages

### Python with pyodbc

```python
import pyodbc

# Connect to InfluxDB
conn = pyodbc.connect(
    'DSN=InfluxDB3',
    autocommit=True
)

# Create cursor
cursor = conn.cursor()

# Execute query
cursor.execute("""
    SELECT
        time,
        temp,
        location
    FROM
        home
    WHERE
        time >= now() - INTERVAL '1 hour'
    ORDER BY
        time DESC
""")

# Fetch results
for row in cursor.fetchall():
    print(row)

# Close connection
cursor.close()
conn.close()
```

### R with RODBC

```r
library(RODBC)

# Connect to InfluxDB
conn <- odbcConnect("InfluxDB3")

# Execute query
result <- sqlQuery(conn, "
    SELECT
        time,
        temp,
        location
    FROM
        home
    WHERE
        time >= now() - INTERVAL '1 hour'
    ORDER BY
        time DESC
")

# View results
print(result)

# Close connection
odbcClose(conn)
```

### C# with `System.Data.Odbc`

```csharp
using System;
using System.Data.Odbc;

class Program
{
    static void Main()
    {
        string connectionString = "DSN=InfluxDB3";

        using (OdbcConnection conn = new OdbcConnection(connectionString))
        {
            conn.Open();

            string query = @"
                SELECT
                    time,
                    temp,
                    location
                FROM
                    home
                WHERE
                    time >= now() - INTERVAL '1 hour'
                ORDER BY
                    time DESC
            ";

            using (OdbcCommand cmd = new OdbcCommand(query, conn))
            using (OdbcDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    Console.WriteLine($"{reader["time"]} - {reader["temp"]} - {reader["location"]}");
                }
            }
        }
    }
}
```

## Connection string format

For applications that use connection strings directly:

```
Driver={Arrow Flight SQL ODBC Driver};Host=HOST;Port=PORT;Database=DATABASE;AuthToken=TOKEN;UseEncryption=1
```

Example:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```
Driver={Arrow Flight SQL ODBC Driver};Host=localhost;Port=8181;Database=DATABASE_NAME;AuthToken=DATABASE_TOKEN;UseEncryption=1
```
{{% /code-placeholders %}}

{{% show-in "cloud-serverless,cloud-dedicated" %}}
For {{% product-name %}}, use port `443`:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```
Driver={Arrow Flight SQL ODBC Driver};Host=cluster-id.a.influxdb.io;Port=443;Database=DATABASE_NAME;AuthToken=DATABASE_TOKEN;UseEncryption=1
```
{{% /code-placeholders %}}
{{% /show-in %}}

## Configuration options

### Connection parameters

| Parameter                        | Description                     | Default                                                                                         |
| -------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `Host`                           | InfluxDB server hostname        | Required                                                                                        |
| `Port`                           | InfluxDB server port            | Required {{% show-in "core,enterprise" %}}(`8181`){{% /show-in %}} |
| `Database`                       | Database name                   | Required                                                                                        |
| `AuthToken`                      | Authentication token            | Required                                                                                        |
| `UseEncryption`                  | Use encrypted connection        | `1` (enabled)                                                                                   |
| `TrustedCerts`                   | Path to trusted CA certificates | System default                                                                                  |
| `DisableCertificateVerification` | Skip certificate verification   | `0` (disabled)                                                                                  |

### Advanced options

Add these to your DSN configuration or connection string as needed:

{{% show-in "enterprise,core" %}}
```ini
[InfluxDB3]
Driver = Arrow Flight SQL ODBC Driver
Host = localhost
Port = 8181
Database = mydb
AuthToken = your-token
UseEncryption = 1
DisableCertificateVerification = 0
```
{{% /show-in %}}

{{% show-in "cloud-serverless" %}}
```ini
[InfluxDB3]
Driver = Arrow Flight SQL ODBC Driver
Host = us-west-2-1.aws.cloud2.influxdata.com
Port = 443
Database = mydb
AuthToken = your-token
UseEncryption = 1
DisableCertificateVerification = 0
```
{{% /show-in %}}

{{% show-in "cloud-dedicated" %}}
```ini
[InfluxDB3]
Driver = Arrow Flight SQL ODBC Driver
Host = cluster-id.a.influxdb.io
Port = 443
Database = mydb
AuthToken = your-token
UseEncryption = 1
DisableCertificateVerification = 0
```
{{% /show-in %}}

{{% show-in "clustered" %}}
```ini
[InfluxDB3]
Driver = Arrow Flight SQL ODBC Driver
Host = cluster-host.com
Port = 443
Database = mydb
AuthToken = your-token
UseEncryption = 1
DisableCertificateVerification = 0
```
{{% /show-in %}}

## Troubleshooting

### Driver not found

If applications cannot find the Arrow Flight SQL ODBC driver:

{{< tabs-wrapper >}}
{{% tabs %}}
[Windows](#)
[macOS and Linux](#)
{{% /tabs %}}

{{% tab-content %}}
1. Open **ODBC Data Source Administrator (64-bit)**
2. Navigate to the **Drivers** tab
3. Verify **Arrow Flight SQL ODBC Driver** appears in the list
4. If not listed, reinstall the driver

{{% /tab-content %}}

{{% tab-content %}}
1. Run the following command to list installed drivers:

   ```bash
   odbcinst -q -d
   ```

2. Verify **Arrow Flight SQL** appears in the output
3. Check `/etc/odbcinst.ini` for proper driver configuration
4. Ensure the driver library path is correct

{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Connection failures

If you cannot connect to {{% product-name %}}:

- Verify your {{% product-name %}} instance is running and accessible
- Check host and port settings:
  - Local instances: `localhost:8181`
  - {{% show-in "cloud-serverless,cloud-dedicated" %}}{{% product-name %}}: Use your cluster URL with port `443`{{% /show-in %}}
- Ensure `UseEncryption` is set correctly for your connection type
- Verify network connectivity and firewall rules allow connections

### Authentication errors

If authentication fails:

- Confirm your token is valid and not expired
- Ensure the token is specified in the `AuthToken` parameter (not `Token`)
- {{% show-in "enterprise" %}}Verify the token has query permissions for the target database{{% /show-in %}}
- Check that the token was copied correctly without extra spaces or characters

### Query errors

If queries fail or return errors:

- Verify SQL syntax is correct for InfluxDB SQL
- Check that referenced tables (measurements) exist in the database
- Ensure column names match your schema
- Review the [SQL reference](/influxdb3/version/reference/sql/) for supported features
- For large result sets, consider adding `LIMIT` clauses

### Performance issues

For slow queries or connection timeouts:

- Add time range filters to limit data scanned
- Use appropriate indexes if available
- Increase timeout values in your DSN configuration
- Monitor query execution plans for optimization opportunities

