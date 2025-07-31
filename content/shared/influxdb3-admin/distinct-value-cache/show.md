
Use the [`influxdb3 show system table` command](/influxdb3/version/reference/cli/influxdb3/show/syste/table/)
to query and output Distinct Value Cache information from the `distinct_caches`
system table.

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
<!-- pytest.mark.skip -->

```bash
influxdb3 show system \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  table distinct_caches
```
{{% /code-placeholders %}}

This returns a table similar to the following:

| table     | name             | column_ids | column_names            | max_cardinality | max_age_seconds |
| :-------- | :--------------- | :--------- | :---------------------- | --------------: | --------------: |
| wind_data | wind_distinct    | [0, 1, 2]  | [country, county, city] |          100000 |           86400 |
| weather   | weather_distinct | [0]        | [location]              |             100 |          604800 |
| bitcoin   | bitcoin_dis      | [0, 1]     | [code, crypto]          |            5000 |           86400 |
| home      | home_distinct    | [0, 1]     | [room, wall]            |           12000 |        15770000 |

## Query specific columns from the distinct_caches system table

Use the `--select` option to query specific columns from the `distinct_caches`
system table. Provide a comma-delimited list of columns to return:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
<!-- pytest.mark.skip -->

```bash
influxdb3 show system \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  table distinct_caches \
  --select name,column_names,max_age_seconds
```
{{% /code-placeholders %}}

## Sort distinct_caches system table output

Use the `--order-by` option to sort data from the `distinct_caches` system table by
specific columns. Provide a comma-delimited list of columns to sort by:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
<!-- pytest.mark.skip -->

```bash
influxdb3 show system \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  table distinct_caches \
  --order-by max_cardinality,max_age_seconds
```
{{% /code-placeholders %}}

> [!Note]
> Results are sorted in ascending order based on the provided columns.

In the examples above, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to query system data from
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% show-in "enterprise" %}}admin {{% /show-in %}}
  authentication token

## Use the HTTP API

You can query cache information using the [InfluxDB v3 SQL query API](/influxdb3/version/api/v3/). Send a `POST` request to the `/api/v3/query_sql` endpoint.

### Query all caches

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

```bash
curl -X POST "https://localhost:8181/api/v3/query_sql" \
  -H "Authorization: Bearer AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "DATABASE_NAME",
    "q": "SELECT * FROM system.last_caches",
    "format": "json"
  }'
 ```

{{% /code-placeholders %}}

## Query specific cache details

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN|CACHE_NAME" %}}

```bash
curl -X POST "https://localhost:8181/api/v3/query_sql" \
  -H "Authorization: Bearer AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "DATABASE_NAME",
    "q": "SELECT * FROM system.last_caches WHERE name = '\''CACHE_NAME'\''",
    "format": "json"
  }'
```

{{% /code-placeholders %}}

