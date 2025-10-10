Use the [`influxdb3 create table` command](/influxdb3/version/reference/cli/influxdb3/create/table/)
or the [HTTP API](/influxdb3/version/api/v3/) to create a table in a specified database in {{< product-name >}}.

With {{< product-name >}}, tables and measurements are synonymous.
Typically, tables are created automatically on write using the table name
specified in line protocol written to InfluxDB.
However, you can manually create tables to define a custom schema or apply custom settings before writing data.

- [Create a table using the influxdb3 CLI](#create-a-table-using-the-influxdb3-cli)
- [Create a table using the HTTP API](#create-a-table-using-the-http-api)
{{% show-in "enterprise" %}}
- [Retention period](#retention-period)
{{% /show-in %}}
{{% show-in "core" %}}
- [Data retention](#data-retention)
{{% /show-in %}}
- [Table naming restrictions](#table-naming-restrictions)

## Create a table using the influxdb3 CLI

Use the `influxdb3 create table` command and provide the following:

- _Required_: The name of the database to create the table in
- _Required_: The name of the table to create (see [Table naming restrictions](#table-naming-restrictions))
- _Required_: Tag columns to include in the table (must have at least one tag column)
- _Optional_: Field columns and their data types to include in the table
{{% show-in "enterprise" %}}
- _Optional_: [Retention period](#retention-period). If omitted, uses database retention period.
{{% /show-in %}}

> [!Note]
> Tables must include at least one tag column.
> Field columns are optional and can be added later when you write data.

> [!Important]
> #### Tag order affects query performance
> When considering your schema and creating your table, order your tags by query priority.
> Place the most commonly queried tags first.
> Columns that appear earlier are typically faster to filter and access during query execution.
>
> For more information, see [Optimize writes](/influxdb3/version/write-data/best-practices/optimize-writes/#sort-tags-by-query-priority).

```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
# Create a table with tag columns
influxdb3 create table \
  --tags tag1,tag2,tag3 \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME

# Create a table with tag and field columns
influxdb3 create table \
  --tags room,sensor_id \
  --fields temp:float64,hum:float64,co:int64 \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```

{{% show-in "enterprise" %}}
```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
# Create a table with a 7-day retention period
influxdb3 create table \
  --tags room,sensor_id \
  --fields temp:float64,hum:float64 \
  --retention-period 7d \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME

# Create a table with database default retention (omit --retention-period)
influxdb3 create table \
  --tags room,sensor_id \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```
{{% /show-in %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create the table in
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to create
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

## Create a table using the HTTP API

To create a table using the HTTP API, send a `POST` request to the `/api/v3/configure/table` endpoint:

{{% api-endpoint method="POST" endpoint="{{< influxdb/host >}}/api/v3/configure/table" %}}

Include the following in your request:

- **Headers**:
  - `Authorization: Bearer` with your authentication token
  - `Content-Type: application/json`
- **Request body**: JSON object with table configuration
  - `db` _(string, required)_: Database name
  - `table` _(string, required)_: Table name
  - `tags` _(array, required)_: Tag column names
  - `fields` _(array, optional)_: Field definitions with name and type
  {{% show-in "enterprise" %}}
  - `retention_period` _(string, optional)_: [Retention period](#retention-period). If omitted, uses database retention period.
  {{% /show-in %}}

```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
# Create a table with tag columns
curl -X POST "{{< influxdb/host >}}/api/v3/configure/table" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["tag1", "tag2", "tag3"]
  }'

# Create a table with tag and field columns
curl -X POST "{{< influxdb/host >}}/api/v3/configure/table" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["room", "sensor_id"],
    "fields": [
      {"name": "temp", "type": "float64"},
      {"name": "hum", "type": "float64"},
      {"name": "co", "type": "int64"}
    ]
  }'
```

{{% show-in "enterprise" %}}
```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
# Create a table with a 7-day retention period
curl -X POST "{{< influxdb/host >}}/api/v3/configure/table" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["room", "sensor_id"],
    "fields": [
      {"name": "temp", "type": "float64"},
      {"name": "hum", "type": "float64"}
    ],
    "retention_period": "7d"
  }'

# Create a table with database default retention (omit retention_period)
curl -X POST "{{< influxdb/host >}}/api/v3/configure/table" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["room", "sensor_id"]
  }'
```
{{% /show-in %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create the table in
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to create
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

{{% show-in "enterprise" %}}
## Retention period

By default, tables use the database retention period. When creating a table, set a table-specific _retention period_ to automatically delete expired data and optimize storage for that table.

A table retention period overrides the database retention period for that specific table.
This allows you to maintain different retention policies for different types of data within the same database.

### Retention period syntax

The retention period value is a time duration value made up of a numeric value
plus a duration unit.
For example, `7d` means 7 days.
A zero duration (`0d`) retention period is infinite and data won't expire.
The retention period value cannot be negative or contain whitespace.

#### Valid durations units include

- **m**: minute
- **h**: hour
- **d**: day
- **w**: week
- **mo**: month
- **y**: year

### Retention period precedence

When both a database and a table have retention periods defined, the **table retention
period takes precedence** for that specific table.

**Example scenarios:**

- **Short-term data in long-term database**: Store high-volume sensor data with 7-day
  retention in a database with 90-day retention
- **Long-term data in short-term database**: Store audit logs with 1-year retention in
  a database with 30-day retention
- **Mixed retention requirements**: Maintain both real-time metrics (7 days) and
  aggregated metrics (1 year) in the same database

For complete details about retention period precedence and behavior, see
[Data retention in {{< product-name >}}](/influxdb3/version/reference/internals/data-retention/#retention-period-precedence).
{{% /show-in %}}

{{% show-in "core" %}}
## Data retention

In {{< product-name >}}, tables use the database retention period.

When data in a table exceeds the database retention period, it is no longer queryable.
To control data retention for your tables, set a retention period when [creating the database](/influxdb3/version/admin/databases/create/#retention-period).

For more information, see [Data retention in {{% product-name %}}](/influxdb3/version/reference/internals/data-retention/).

> [!Note]
> #### Upgrade to Enterprise for table-specific retention
>
> With InfluxDB 3 Enterprise, you can set table-level retention periods that override
> the database retention period. This allows you to maintain different retention policies
> for different types of data within the same database.
>
> For more information, see [InfluxDB 3 Enterprise](/influxdb3/enterprise/).
{{% /show-in %}}

## Table naming restrictions

Table names in {{< product-name >}} must adhere to the following naming restrictions:

- **Allowed characters**: Alphanumeric characters (a-z, A-Z, 0-9), underscore (`_`), dash (`-`)
- **Starting character**: Should start with a letter or number and should not start with underscore (`_`)
- **Case sensitivity**: Table names are case-sensitive
- **Quoting**: Use double quotes when names contain special characters or whitespace

> [!Caution]
> #### Underscore prefix reserved for system use
>
> Names starting with an underscore (`_`) may be reserved for InfluxDB system use.
> While {{< product-name >}} might not explicitly reject these names, using them risks
> conflicts with current or future system features and may result in
> unexpected behavior or data loss.
