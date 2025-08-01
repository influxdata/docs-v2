
Use the [`distinct_cache()` SQL function](/influxdb3/version/reference/sql/functions/cache/#distinct_cache)
in the `FROM` clause of an SQL `SELECT` statement to query data from the
Distinct Value Cache (DVC).

> [!Important]
> You must use SQL to query the DVC.
> InfluxQL does not support the `distinct_cache()` function.

`distinct_cache()` supports the following arguments:

- **table_name**: _({{< req >}})_ The name of the table the DVC is associated with
  formatted as a string literal.
- **cache_name**: The name of the DVC to query formatted as a string literal.
  This argument is only required if there is more than one DVC associated with
  the specified table.

```sql
SELECT * FROM distinct_cache('table_name', 'cache_name')
```

You can use other [SQL clauses](/influxdb3/version/reference/sql/#statements-and-clauses)
to modify query results. For example, you can use the `WHERE` clause to return
the distinct tag values associated with another distinct tag value:

```sql
SELECT
  city
FROM
  distinct_cache('wind_data', 'windDistinctCache')
WHERE
  country = 'Spain'
```

## Use the HTTP API

You can query cached data using the [InfluxDB v3 SQL query API](/influxdb3/version/api/v3/). Send a `POST` request to the `/api/v3/query_sql` endpoint.

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN|TABLE_NAME|CACHE_NAME" %}}

```bash
curl -X POST "https://localhost:8181/api/v3/query_sql" \
  -H "Authorization: Bearer AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "DATABASE_NAME",
    "q": "SELECT * FROM distinct_cache('\''TABLE_NAME'\'', '\''CACHE_NAME'\'')",
    "format": "json"
  }'
```

{{% /code-placeholders %}}

## Example with WHERE clause

```bash
curl -X POST "https://localhost:8181/api/v3/query_sql" \
  -H "Authorization: Bearer 00xoXX0xXXx0000XxxxXx0Xx0xx0" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "example-db",
    "q": "SELECT room, temp FROM last_cache('\''home'\'', '\''homeCache'\'') WHERE room = '\''Kitchen'\''",
    "format": "json"
  }'
```
