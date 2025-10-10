<!-- Allow beginning shortcode -->
{{< product-name >}} enforces database{{% show-in "enterprise" %}} and table{{% /show-in %}} retention periods at query time.
Any points with timestamps beyond a retention period
are filtered out of query results, even though the data may still exist in storage.

- [Database retention period](#database-retention-period)
{{% show-in "enterprise" %}}
- [Table retention period](#table-retention-period)
{{% /show-in %}}
- [Retention period duration formats](#retention-period-duration-formats)
- [Set database retention period](#set-database-retention-period)
{{% show-in "enterprise" %}}
- [Update retention periods](#update-retention-periods)
- [Retention period precedence](#retention-period-precedence)
- [When does data actually get deleted?](#when-does-data-actually-get-deleted)
{{% /show-in %}}

## Database retention period

A **database retention period** is the duration of time that a database retains data.
Retention periods are designed to automatically delete expired data and optimize
storage without any user intervention.

By default, data does not expire. When you [create a database](/influxdb3/version/admin/databases/create/),
you can optionally set a retention period. Retention periods can be as short as an hour
or infinite (`none`).

[Points](/influxdb3/version/reference/glossary/#point) in a database with
timestamps beyond the defined retention period (relative to now) are not queryable,
but may still exist in storage until {{% show-in "core" %}}fully deleted by the retention enforcement service{{% /show-in %}}{{% show-in "enterprise" %}}[fully deleted](#when-does-data-actually-get-deleted){{% /show-in %}}.

{{% show-in "enterprise" %}}
Database retention periods serve as the default retention period for all tables in
the database, unless a table has its own retention period defined.
{{% /show-in %}}

{{% show-in "enterprise" %}}
## Table retention period

In addition to database-level retention periods, {{< product-name >}} supports
**table-level retention periods**. A table retention period overrides the database
retention period for that specific table.

This allows you to:
- Keep different types of data for different durations within the same database
- Apply shorter retention periods to high-volume, low-value data
- Apply longer retention periods to critical data that needs extended retention
{{% /show-in %}}

## Retention period duration formats

Retention periods are specified as [duration](/influxdb3/version/reference/glossary/#duration)
values using a numeric value plus a duration unit. The retention period value cannot
be negative or contain whitespace.

### Valid duration units

| Unit | Description |
|:-----|:------------|
| `h`  | hour        |
| `d`  | day         |
| `w`  | week        |
| `mo` | month (30 days) |
| `y`  | year (365 days) |

> [!Note]
> Minute (`m`) and second (`s`) units are not supported for retention periods.

> [!Warning]
> #### Retention period constraints
>
> - **Minimum for data retention**: The practical minimum retention period is 1 hour (`1h`).
> - **Zero-duration periods**: Setting a retention period to `0<unit>` (for example,
>   `0d` or `0h`) is allowed but marks all data for immediate deletion at query time.
>   _This differs from InfluxDB 1.x and 2.x where `0d` meant infinite retention._
> - **Infinite retention**: Use `none` to set an infinite retention period.

### Example retention period values

| Value | Description |
|:------|:------------|
| `1h` | 1 hour |
| `24h` | 24 hours (1 day) |
| `7d` | 7 days |
| `4w` | 4 weeks (28 days) |
| `1mo` | 1 month (30 days) |
| `90d` | 90 days |
| `1y` | 1 year (365 days) |
| `none` | Infinite - data never expires |

You can combine multiple duration units in a single value:

| Value | Description |
|:------|:------------|
| `30d12h` | 30 days and 12 hours (30.5 days) |
| `2w3d` | 2 weeks and 3 days (17 days) |
| `1y6mo` | 1 year and 6 months (545 days) |

### Set database retention period

Use the [`influxdb3 create database` command](/influxdb3/version/reference/cli/influxdb3/create/database/) or the [/api/v3/configure/database](/influxdb3/version/api/v3/#operation/PostConfigureDatabase) HTTP API endpoint to create a database with a retention period:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3 CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
# Create a database with a 30-day retention period
influxdb3 create database --retention-period 30d DATABASE_NAME

# Create a database with infinite retention
influxdb3 create database --retention-period none DATABASE_NAME

# Create a database with a 90-day retention period using authentication
influxdb3 create database \
  --retention-period 90d \
  --token AUTH_TOKEN \
  DATABASE_NAME
```
{{% /code-tab-content %}}
{{% code-tab-content %}}

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
# Create a database with a 30-day retention period
curl --request POST "{{< influxdb/host >}}/api/v3/configure/database" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "db": "DATABASE_NAME",
    "retention_period": "30d"
  }'

# Create a database with infinite retention
curl --request POST "{{< influxdb/host >}}/api/v3/configure/database" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "db": "DATABASE_NAME",
    "retention_period": "none"
  }'

# Create a database with a 90-day retention period
curl --request POST "{{< influxdb/host >}}/api/v3/configure/database" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "db": "DATABASE_NAME",
    "retention_period": "90d"
  }'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

{{% show-in "core" %}}


> [!Note]
> #### Retention periods are immutable in Core
>
> In {{< product-name >}}, retention periods can only be set when
> [creating a database](/influxdb3/core/admin/databases/create/) and cannot be
> changed afterward. If you need to change a retention period, you must create a
> new database with the desired retention period and migrate your data.
>
> #### Upgrade to InfluxDB 3 Enterprise for advanced retention features
>
> With InfluxDB 3 Enterprise, you can set table-level retention policies and update
> retention periods after creation. For more information, see
> [InfluxDB 3 Enterprise data retention](/influxdb3/enterprise/reference/internals/data-retention/).
{{% /show-in %}}

{{% show-in "enterprise" %}}

### Set table retention period

Use the [`influxdb3 create table` command](/influxdb3/enterprise/reference/cli/influxdb3/create/table/) or the [/api/v3/configure/table](/influxdb3/enterprise/reference/api/v3/#operation/PostConfigureTable) HTTP API endpoint to create a table with a retention period:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3 CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
# Create a table with a 7-day retention period
influxdb3 create table \
  --tags sensor_id,location \
  --retention-period 7d \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME

# Create a table with field definitions and retention period
influxdb3 create table \
  --tags room,sensor_id \
  --fields temp:float64,hum:float64 \
  --retention-period 30d \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
# Create a table with a 7-day retention period
curl --request POST "{{< influxdb/host >}}/api/v3/configure/table" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["sensor_id", "location"],
    "retention_period": "7d"
  }'

# Create a table with field definitions and retention period
curl --request POST "{{< influxdb/host >}}/api/v3/configure/table" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["room", "sensor_id"],
    "fields": [
      {"name": "temp", "type": "float64"},
      {"name": "hum", "type": "float64"}
    ],
    "retention_period": "30d"
  }'
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database
{{% show-in "enterprise" %}}
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to create
{{% /show-in %}}
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

## Update retention periods

{{< product-name >}} allows you to update database retention
periods after creation using the
[`influxdb3 update database` command](/influxdb3/enterprise/reference/cli/influxdb3/update/database/).

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3 CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
# Update a database retention period to 60 days
influxdb3 update database --retention-period 60d DATABASE_NAME

# Clear a database retention period (set to infinite)
influxdb3 update database --retention-period none DATABASE_NAME

# Update with authentication
influxdb3 update database \
  --retention-period 90d \
  --token AUTH_TOKEN \
  DATABASE_NAME
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
# Update a database retention period to 60 days
curl --request PATCH "{{< influxdb/host >}}/api/v3/configure/database/DATABASE_NAME" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "retention_period": "60d"
  }'

# Clear a database retention period (set to infinite)
curl --request PATCH "{{< influxdb/host >}}/api/v3/configure/database/DATABASE_NAME" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "retention_period": "none"
  }'

# Update a database retention period to 90 days
curl --request PATCH "{{< influxdb/host >}}/api/v3/configure/database/DATABASE_NAME" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "retention_period": "90d"
  }'
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

> [!Note]
> {{< product-name >}} does not currently support updating table retention periods
> after creation. Table retention periods can only be set when creating the table.

## Retention period precedence

When both database and table retention periods are defined, the **table retention
period takes precedence** for that specific table. This allows fine-grained control
over data retention within a database.

### Examples

#### Example: Table retention shorter than database retention

```bash
# Database with 90-day retention
influxdb3 create database --retention-period 90d mydb

# Table with 7-day retention (overrides database retention)
influxdb3 create table \
  --tags sensor_id \
  --retention-period 7d \
  --database mydb \
  metrics
```

In this example:
- Data in the `metrics` table expires after 7 days
- Data in other tables in `mydb` expires after 90 days

#### Example: Table retention longer than database retention

```bash
# Database with 30-day retention
influxdb3 create database --retention-period 30d mydb

# Table with 1-year retention (overrides database retention)
influxdb3 create table \
  --tags device_id \
  --retention-period 1y \
  --database mydb \
  audit_logs
```

In this example:
- Data in the `audit_logs` table expires after 1 year
- Data in other tables in `mydb` expires after 30 days

#### Example: Database retention updated after table creation

```bash
# Original database with 30-day retention
influxdb3 create database --retention-period 30d mydb

# Table with 7-day retention
influxdb3 create table \
  --tags sensor_id \
  --retention-period 7d \
  --database mydb \
  metrics

# Update database retention to 90 days
influxdb3 update database --retention-period 90d mydb
```

After the update:
- Data in the `metrics` table still expires after 7 days (table retention unchanged)
- Data in other tables in `mydb` now expires after 90 days (affected by database update)

## When does data actually get deleted?

{{< product-name >}} routinely deletes expired data to optimize storage.
The retention enforcement service runs periodically and:

1. **Identifies expired data**: Finds data with timestamps beyond the retention period
2. **Deletes expired files**: Permanently removes Parquet files containing only expired data
3. **Optimizes mixed files**: For files containing both expired and non-expired data,
   the system may compact and rewrite files to remove expired data

The timing of physical deletion depends on:
- The retention enforcement service schedule
- The compaction strategy configured for your installation
- The ratio of expired to non-expired data in Parquet files

> [!Important]
> Even though expired data may still exist in storage temporarily, it will never
> appear in query results. Retention period enforcement at query time ensures
> expired data is always filtered out.
{{% /show-in %}}
