Use InfluxQL `SHOW` statements to query schema information from a database.

- [SHOW RETENTION POLICIES](#show-retention-policies)
- [SHOW MEASUREMENTS](#show-measurements)
- [SHOW FIELD KEYS](#show-field-keys)
- [SHOW TAG KEYS](#show-tag-keys)
- [SHOW TAG VALUES](#show-tag-values)

## SHOW RETENTION POLICIES

Use the `SHOW RETENTION POLICIES` statement to list retention policies associated
with a database.
Each database has a single retention policy--`autogen`.

> [!Note]
> In {{< product-name >}}, retention policies are not part of the
> data structure but are expected by InfluxQL and used in fully-qualified measurements
> in the [`FROM` clause](/influxdb/version/reference/influxql/select/#from-clause).
> The data returned for each retention policy does not represent the actual
> retention-related attributes of the database. The values are placeholder values
> meant only for InfluxQL feature parity.
> 
> For information about database data retention, see
> [List databases](/influxdb/version/admin/databases/list/).

```sql
SHOW RETENTION POLICIES [ON <database-name>]
```

#### Examples

```sql
-- Show retention policies in the database specified in the query request
SHOW RETENTION POLICIES

-- Show retention policies in a specific database
SHOW RETENTION POLICIES ON "example-database"
```

## SHOW MEASUREMENTS

Use the `SHOW MEASUREMENTS` statement to list measurements in a database.

```sql
SHOW MEASUREMENTS [with_measurement_clause] [where_clause] [limit_clause] [offset_clause]
```

#### Examples

```sql
-- Show all measurements
SHOW MEASUREMENTS

-- Show measurements where region tag = 'uswest' AND host tag = 'serverA'
SHOW MEASUREMENTS WHERE "region" = 'uswest' AND "host" = 'serverA'

-- Show measurements that start with 'h2o'
SHOW MEASUREMENTS WITH MEASUREMENT =~ /h2o.*/
```

## SHOW FIELD KEYS

Use the `SHOW FIELD KEYS` statement to list all field keys in a measurement.

```sql
SHOW FIELD KEYS [from_clause]
```

#### Examples

```sql
-- Show field keys and field value data types from all measurements
SHOW FIELD KEYS

-- Show field keys and field value data types from specified measurement
SHOW FIELD KEYS FROM "cpu"
```

## SHOW TAG KEYS

Use the `SHOW TAG KEYS` statement to list tag keys in a measurement.

```sql
SHOW TAG KEYS [from_clause] [where_clause] [limit_clause] [offset_clause]
```

#### Examples

```sql
-- Show all tag keys
SHOW TAG KEYS

-- Show all tag keys from the cpu measurement
SHOW TAG KEYS FROM "cpu"

-- Show all tag keys from the cpu measurement where the region key = 'uswest'
SHOW TAG KEYS FROM "cpu" WHERE "region" = 'uswest'

-- Show all tag keys where the host key = 'serverA'
SHOW TAG KEYS WHERE "host" = 'serverA'
```

## SHOW TAG VALUES

Use the `SHOW TAG VALUES` statement to list values of specified tags in a database.

```sql
SHOW TAG VALUES [from_clause] WITH KEY = <tag-expression> [where_clause] [limit_clause] [offset_clause]
```

By default, the `SHOW TAG VALUES` statement only returns unique tag values from
**the last day**. To modify the time range, include a
[`WHERE` clause with a time-based predicate](/influxdb/version/reference/influxql/where/#time-ranges).

> [!Important]
> 
> #### Include a FROM clause
> 
> Include a `FROM` clause with the `SHOW TAG VALUES`
> statement that specifies 1-50 tables to query.
> Without a `FROM` clause, the InfluxDB query engine must read data from all
> tables and return unique tag values from each.
> 
> Depending on the number of tables in your database and the number of unique tag
> values in each table, excluding a `FROM` clause can result in poor query performance,
> query timeouts, or unnecessary resource allocation that may affect other queries.

#### Examples

```sql
-- Show tag values from the cpu measurement for the region tag
SHOW TAG VALUES FROM "cpu" WITH KEY = "region"

-- Show tag values from the cpu measurement for the region tag for a custom time range
SHOW TAG VALUES FROM "cpu" WITH KEY = "region" WHERE time > -7d

-- Show tag values from multiple measurements for the region tag
SHOW TAG VALUES FROM "cpu", "memory", "disk" WITH KEY = "region"

-- Show tag values from the cpu measurement for all tag keys that do not include the letter c
SHOW TAG VALUES FROM "cpu" WITH KEY !~ /.*c.*/

-- Show tag values from the cpu measurement for region & host tag keys where service = 'redis'
SHOW TAG VALUES FROM "cpu" WITH KEY IN ("region", "host") WHERE "service" = 'redis'
```
