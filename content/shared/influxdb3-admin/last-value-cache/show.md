
Use the [`influxdb3 show system table` command](/influxdb3/version/reference/cli/influxdb3/show/syste/table/)
to query and output Last Value Cache information from the `last_caches` system table.

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
<!-- pytest.mark.skip -->

```bash
influxdb3 show system \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  table last_caches
```
{{% /code-placeholders %}}

This returns a table similar to the following:

| table   | name         | key_column_ids | key_column_names | value_column_ids | value_column_names                               | count | ttl   |
| ------- | ------------ | -------------- | ---------------- | ---------------- | ------------------------------------------------ | ----- | ----- |
| weather | weather_last | [0]            | [location]       | [2, 3, 4, 5, 1]  | [precip, temp_avg, temp_max, temp_min, wind_avg] | 1     | 86400 |
| bitcoin | bitcoin_last | [0, 1]         | [code, crypto]   | [4]              | [price]                                          | 1     | 14400 |
| numbers | numbers_last | []             | []               | [0, 1]           | [a, b]                                           | 5     | 14400 |
| home    | home_last    | [0]            | [room]           | [1, 2, 3]        | [temp, hum, co]                                  | 5     | 60    |

## Query specific columns from the last_caches system table

Use the `--select` option to query specific columns from the `last_caches`
system table. Provide a comma-delimited list of columns to return:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
<!-- pytest.mark.skip -->

```bash
influxdb3 show system \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  table last_caches \
  --select name,key_column_names,value_column_names
```
{{% /code-placeholders %}}

## Sort last_caches system table output

Use the `--order-by` option to sort data from the `last_caches` system table by
specific columns. Provide a comma-delimited list of columns to sort by:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
<!-- pytest.mark.skip -->

```bash
influxdb3 show system \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  table last_caches \
  --order-by table,ttl
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

To use the HTTP API to query and output cache information from the system table, send a `GET` or `POST` request to the `/api/v3/query_sql` endpoint.

{{% api-endpoint method="GET" endpoint="/api/v3/query_sql" api-ref="/influxdb3/version/api/v3/#get-/api/v3/query_sql" %}}

{{% api-endpoint method="POST" endpoint="/api/v3/query_sql" api-ref="/influxdb3/version/api/v3/#post-/api/v3/query_sql" %}}

### Query all last value caches

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

```bash
curl -X POST "https://localhost:8181/api/v3/query_sql" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --json '{
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
  --header "Authorization: Bearer AUTH_TOKEN" \
  --json '{
    "db": "DATABASE_NAME",
    "q": "SELECT * FROM system.last_caches WHERE name = '\''CACHE_NAME'\''",
    "format": "json"
  }'
```

{{% /code-placeholders %}}