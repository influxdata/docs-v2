
Use the [`last_cache()` SQL function](/influxdb3/version/reference/sql/functions/cache/#last_cache)
in the `FROM` clause of an SQL `SELECT` statement to query data from the
Last Value Cache (LVC).

> [!Important]
> You must use SQL to query the LVC.
> InfluxQL does not support the `last_cache()` function.

`last_cache()` supports the following arguments:

- **table_name**: _({{< req >}})_ The name of the table the LVC is associated with
  formatted as a string literal.
- **cache_name**: The name of the LVC to query formatted as a string literal.
  This argument is only required if there is more than one LVC associated with the specified
  table.

```sql
SELECT * FROM last_cache('table_name', 'cache_name')
```

You can use other [SQL clauses](/influxdb3/version/reference/sql/#statements-and-clauses)
to modify query results. For example, you can use the `WHERE` clause to return
the last value for a specific tag set:

```sql
SELECT
  room,
  temp
FROM
  last_cache('home', 'homeCache')
WHERE
  room = 'Kitchen'
```
