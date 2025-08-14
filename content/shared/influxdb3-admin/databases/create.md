
Use the [`influxdb3 create database` command](/influxdb3/version/reference/cli/influxdb3/create/database/)
to create a database in {{< product-name >}}.
Provide the following:

- Database name _(see [Database naming restrictions](#database-naming-restrictions))_
- {{< product-name >}} {{% token-link "admin" "admin" %}} 

<!--Allow fail for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

{{% code-placeholders "DATABASE_NAME" %}}

```sh
influxdb3 create database DATABASE_NAME
```

{{% /code-placeholders %}}

- [Database naming restrictions](#database-naming-restrictions)
- [InfluxQL DBRP naming convention](#influxql-dbrp-naming-convention)
- [Database limit](#database-limit)

<!--
## Retention period syntax

Use the `--retention-period` flag to define a specific
[retention period](/influxdb3/version/admin/databases/#retention-periods)
for the database.
The retention period value is a time duration value made up of a numeric value
plus a duration unit.
For example, `30d` means 30 days.
A zero duration (`0d`) retention period is infinite and data won't expire.
The retention period value cannot be negative or contain whitespace.

{{< flex >}}
{{% flex-content "half" %}}

##### Valid durations units include

- **m**: minute
- **h**: hour
- **d**: day
- **w**: week
- **mo**: month
- **y**: year

{{% /flex-content %}}
{{% flex-content "half" %}}

##### Example retention period values

- `0d`: infinite/none
- `3d`: 3 days
- `6w`: 6 weeks
- `1mo`: 1 month (30 days)
- `1y`: 1 year
- `30d30d`: 60 days
- `2.5d`: 60 hours

{{% /flex-content %}}
{{< /flex >}}
-->

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
