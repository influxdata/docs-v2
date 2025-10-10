
Use the [`influxdb3 create database` command](/influxdb3/version/reference/cli/influxdb3/create/database/),
the [HTTP API](/influxdb3/version/api/v3/), or [InfluxDB 3 Explorer](/influxdb3/explorer/)
to create a database in {{< product-name >}}.

- [Create a database using the influxdb3 CLI](#create-a-database-using-the-influxdb3-cli)
- [Create a database using the HTTP API](#create-a-database-using-the-http-api)
- [Create a database using InfluxDB 3 Explorer](#create-a-database-using-influxdb-3-explorer)
- [Retention period](#retention-period)
- [Database naming restrictions](#database-naming-restrictions)
- [InfluxQL DBRP naming convention](#influxql-dbrp-naming-convention)
- [Database limit](#database-limit)

## Create a database using the influxdb3 CLI

Use the [`influxdb3 create database` command](/influxdb3/version/reference/cli/influxdb3/create/database/)
to create a database. Provide the following:

- Database name _(see [Database naming restrictions](#database-naming-restrictions))_
- {{< product-name >}} {{% token-link "admin" "admin" %}}
- _(Optional)_ [Retention period](#retention-period). If omitted, data doesn't expire.

{{% show-in "core" %}}
> [!Important]
> #### Retention periods are immutable in Core
>
> In {{< product-name >}}, retention periods can only be set when creating a database
> and cannot be changed afterward. If you need to change a retention period, you must
> create a new database with the desired retention period and migrate your data.
{{% /show-in %}}

<!--pytest.mark.skip-->

```sh{placeholders="DATABASE_NAME|AUTH_TOKEN"}
# Create a database with a 30-day retention period
influxdb3 create database --retention-period 30d DATABASE_NAME

# Create a database with a 90-day retention period using authentication
influxdb3 create database \
  --retention-period 90d \
  --token AUTH_TOKEN \
  DATABASE_NAME

# Create a database with infinite retention (default)
influxdb3 create database DATABASE_NAME
```

Replace the following:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

## Create a database using the HTTP API

To create a database using the HTTP API, send a `POST` request to the `/api/v3/configure/database` endpoint:

{{% api-endpoint method="POST" endpoint="{{< influxdb/host >}}/api/v3/configure/database" %}}

Include the following in your request:

- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer` with your {{% token-link "admin" %}}
- **Request body** (JSON object):
  - `db` _(string, required)_: Database name
  - `retention_period` _(string, optional)_: [Retention period](#retention-period). If omitted, data doesn't expire.

{{% show-in "core" %}}
> [!Important]
> #### Retention periods are immutable in Core
>
> In {{< product-name >}}, retention periods can only be set when creating a database
> and cannot be changed afterward. If you need to change a retention period, you must
> create a new database with the desired retention period and migrate your data.
{{% /show-in %}}

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
# Create a database with a 30-day retention period
curl --request POST "{{< influxdb/host >}}/api/v3/configure/database" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "db": "DATABASE_NAME",
    "retention_period": "30d"
  }'

# Create a database with a 90-day retention period
curl --request POST "{{< influxdb/host >}}/api/v3/configure/database" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "db": "DATABASE_NAME",
    "retention_period": "90d"
  }'

# Create a database with infinite retention (default)
curl --request POST "{{< influxdb/host >}}/api/v3/configure/database" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "db": "DATABASE_NAME"
  }'
```

Replace the following:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

### Response

A successful request returns HTTP status `200` with the database configuration.

## Create a database using InfluxDB 3 Explorer

> [!Caution]
> Currently, you can't set a retention period when creating a database in Explorer.
> To create a database with a retention period, see one of the following:
> - [Create a database using the influxdb3 CLI](#create-a-database-using-the-influxdb3-cli)
> - [Create a database using the HTTP API](#create-a-database-using-the-http-api)

{{% show-in "core" %}}
> [!Important]
> #### Retention periods are immutable in Core
>
> After creating a database in {{< product-name >}}, you cannot change its retention period.
{{% /show-in %}}

Use the [InfluxDB 3 Explorer](/influxdb3/explorer/) web interface to create a database in {{% product-name %}}:

1. If you haven't already, see how to [get started with Explorer and connect to your {{% product-name %}} server](/influxdb3/explorer/get-started/).
2. In Explorer, click **Manage Databases** in the left navigation.
3. Click **+ Create New**.
4. Enter a database name.
5. Click **Create Database**.

For more information, see [Manage databases with InfluxDB 3 Explorer](/influxdb3/explorer/manage-databases/).

- [Retention period](#retention-period)
- [Database naming restrictions](#database-naming-restrictions)
- [InfluxQL DBRP naming convention](#influxql-dbrp-naming-convention)
- [Database limit](#database-limit)

## Retention period

By default, data does not expire. When creating a database, set a _retention period_ to automatically delete expired data and optimize storage.

### Retention period syntax

The retention period value is a time duration value made up of a numeric value
plus a duration unit.
For example, `30d` means 30 days.
The retention period value cannot be negative or contain whitespace.

#### Valid durations units include

- **m**: minute
- **h**: hour
- **d**: day
- **w**: week
- **mo**: month
- **y**: year

> [!Warning]
> #### Retention period constraints
>
> - **Minimum for data retention**: The practical minimum retention period is 1 hour (`1h`).
> - **Zero-duration periods**: Setting a retention period to `0<unit>` (for example,
>   `0d` or `0h`) is allowed but marks all data for immediate deletion at query time.
>   _This differs from InfluxDB 1.x and 2.x where `0d` meant infinite retention._
> - **Infinite retention**: Use `none` to set an infinite retention period.

For more information about retention periods, see [Data retention](/influxdb3/version/reference/internals/data-retention/).

{{% show-in "core" %}}
> [!Important]
> #### Retention periods are immutable in Core
>
> In {{< product-name >}}, retention periods can only be set when creating a database
> and cannot be changed afterward. If you need to change a retention period, you must
> create a new database with the desired retention period and migrate your data.
>
> For mutable retention periods and table-level retention, consider upgrading to
> [InfluxDB 3 Enterprise](/influxdb3/enterprise/).
{{% /show-in %}}

{{% show-in "enterprise" %}}
> [!Note]
> #### Database retention serves as default for tables
>
> The database retention period serves as the default retention period for all tables in
> the database, unless a table has its own retention period defined. Table-level retention
> periods override database retention periods.
>
> For more information, see [Retention period precedence](/influxdb3/enterprise/reference/internals/data-retention/#retention-period-precedence).
{{% /show-in %}}

## Database naming restrictions

Database names must adhere to the following naming restrictions:

- **Length**: Maximum 64 characters
- **Allowed characters**: Alphanumeric characters (a-z, A-Z, 0-9), underscore (`_`), dash (`-`), and forward-slash (`/`)
- **Prohibited characters**: Cannot contain whitespace, punctuation, or other special characters
- **Starting character**: Should start with a letter or number and should not start with underscore (`_`)
- **Case sensitivity**: Database names are case-sensitive

> [!Caution]
> #### Underscore prefix reserved for system use
>
> Names starting with an underscore (`_`) may be reserved for InfluxDB system use.
> While {{% product-name %}} might not explicitly reject these names, using them risks
> conflicts with current or future system features and may result in
> unexpected behavior or data loss.

### Valid database name examples

```text
mydb
sensor_data
prod-metrics
logs/application
webserver123
```

### Invalid database name examples

```text
my database        # Contains whitespace
sensor.data        # Contains period
app@server         # Contains special character
_internal          # Starts with underscore (reserved)
very_long_database_name_that_exceeds_sixty_four_character_limit  # Too long
```

For comprehensive information about naming restrictions for all InfluxDB identifiers, 
see [Naming restrictions and conventions](/influxdb3/version/reference/naming-restrictions/).

## InfluxQL DBRP naming convention

In InfluxDB 1.x, data is stored in [databases](/influxdb/v1/concepts/glossary/#database)
and [retention policies](/influxdb/v1/concepts/glossary/#retention-policy-rp).
In {{% product-name %}}, databases and retention policies have been merged into
_databases_, where databases have a retention period, but retention policies
are no longer part of the data model.
Because InfluxQL uses the 1.x data model, a database must be mapped to a v1
database and retention policy (DBRP) to be queryable with InfluxQL.

**When naming a database that you want to query with InfluxQL**, use the following
naming convention to automatically map v1 DBRP combinations to an {{% product-name %}} database:

```text
database_name/retention_policy_name
```

##### Database naming examples

| v1 Database name | v1 Retention Policy name | New database name         |
| :--------------- | :----------------------- | :------------------------ |
| db               | rp                       | db/rp                     |
| telegraf         | autogen                  | telegraf/autogen          |
| webmetrics       | 1w-downsampled           | webmetrics/1w-downsampled |

## Database limit

{{% show-in "enterprise" %}}
**Default maximum number of databases**: {{% influxdb3/limit "database" %}}
{{% /show-in %}}
{{% show-in "core" %}}
**Maximum number of databases**: {{% influxdb3/limit "database" %}}
{{% /show-in %}}

_For more information about {{< product-name >}} database, table, and column limits,
see [Database, table, and column limits](/influxdb3/version/admin/databases/#database-table-and-column-limits)._
