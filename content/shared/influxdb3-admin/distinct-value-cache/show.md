
Use the [`influxdb3 show system table` command](/influxdb3/version/reference/cli/influxdb3/show/syste/table/)
to query and output Distinct Value Cache information from the `distinct_caches`
system table.

<!-- pytest.mark.skip -->

```bash { placeholders="DATABASE_NAME|AUTH_TOKEN" }
influxdb3 show system \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  table distinct_caches
```

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

<!-- pytest.mark.skip -->

```bash { placeholders="DATABASE_NAME|AUTH_TOKEN" }
influxdb3 show system \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  table distinct_caches \
  --select name,column_names,max_age_seconds
```

## Sort distinct_caches system table output

Use the `--order-by` option to sort data from the `distinct_caches` system table by
specific columns. Provide a comma-delimited list of columns to sort by:

<!-- pytest.mark.skip -->

```bash { placeholders="DATABASE_NAME|AUTH_TOKEN" }
influxdb3 show system \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  table distinct_caches \
  --order-by max_cardinality,max_age_seconds
```

> [!Note]
> Results are sorted in ascending order based on the provided columns.

In the examples above, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to query system data from
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% show-in "enterprise" %}}admin {{% /show-in %}}
  authentication token

## Use the HTTP API

To use the HTTP API to query and output cache information from the system table, send a `GET` or `POST` request to the `/api/v3/query_sql` endpoint.

{{% api-endpoint method="GET" endpoint="/api/v3/query_sql" api-ref="/influxdb3/version/api/query-data/#operation/GetExecuteQuerySQL" %}}

{{% api-endpoint method="POST" endpoint="/api/v3/query_sql" api-ref="/influxdb3/version/api/query-data/#operation/PostExecuteQuerySQL" %}}

### Query all caches

```bash { placeholders="DATABASE_NAME|AUTH_TOKEN" }
curl -X POST "https://localhost:8181/api/v3/query_sql" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --json '{
    "db": "DATABASE_NAME",
    "q": "SELECT * FROM system.distinct_caches",
    "format": "json"
  }'
 ```

## Query specific cache details

```bash { placeholders="DATABASE_NAME|AUTH_TOKEN|CACHE_NAME" }
curl -X POST "https://localhost:8181/api/v3/query_sql" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --json '{
    "db": "DATABASE_NAME",
    "q": "SELECT * FROM system.distinct_caches WHERE name = '\''CACHE_NAME'\''",
    "format": "json"
  }'
```

