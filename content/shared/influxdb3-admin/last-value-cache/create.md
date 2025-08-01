
Use the [`influxdb3 create last_cache` command](/influxdb3/version/reference/cli/influxdb3/create/last_cache/)
to create a Last Value Cache (LVC). Provide the following:

- **Database** (`-d`, `--database`): _({{< req >}})_ The name of the database to
  associate the LVC with. You can also use the `INFLUXDB3_DATABASE_NAME`
  environment variable to specify the database.
- **Token** (`--token`): _({{< req >}})_ Your {{< product-name >}}
  {{% show-in "enterprise" %}}admin {{% /show-in %}}authentication token.
  You can also use the `INFLUXDB3_AUTH_TOKEN` environment variable to specify
  the token.
- **Table** (`-t`, `--table`): _({{< req >}})_ The name of the table to
  associate the LVC with.
{{% show-in "enterprise" %}}
- **Node specification** (`-n`, `--node-spec`): Specify which nodes the LVC
  should be configured on.
{{% /show-in %}}
- **Key columns** (`--key-columns`): Specify which columns to include in the
  primary key of the cache. Rows in the LVC are uniquely identified by their
  timestamp and key columns, so include all the columns you need to identify
  each row. These are typically tags, but you can use any columns with the
  following types:

  - String
  - Integer
  - Unsigned integer
  - Boolean

- **Value columns** (`--value-columns`): Specify which columns to cache as value
  columns. These are typically fields but can also be tags. By default, `time` and
  columns other than those specified as `--key-columns` are cached as value columns.
- **Count** (`--count`): The number of values to cache per unique key column combination.
  The supported range is `[1-10]`. The default count is `1`.
- **Time-to-Live (TTL)** (`--ttl`): The time-to-live for cached values in
  [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html)
  form. The default TTL is four hours.
- **Cache name**: A unique name for the cache. If you don’t provide one,
  InfluxDB automatically generates a cache name for you.

{{% show-in "core" %}}
<!----------------------------- BEGIN CORE EXAMPLE ---------------------------->
{{% code-placeholders "(DATABASE|TABLE|LVC)_NAME|AUTH_TOKEN|(KEY|VALUE)_COLUMNS|COUNT|TTL" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 create last_cache \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --table TABLE_NAME \
  --key-columns KEY_COLUMNS \
  --value-columns VALUE_COLUMNS \
  --count COUNT \
  --ttl TTL\
  LVC_NAME
```
{{% /code-placeholders %}}
<!------------------------------ END CORE EXAMPLE ----------------------------->
{{% /show-in %}}

{{% show-in "enterprise" %}}
<!-------------------------- BEGIN ENTERPRISE EXAMPLE ------------------------->
{{% code-placeholders "(DATABASE|TABLE|LVC)_NAME|AUTH_TOKEN|NODE_LIST|(KEY|VALUE)_COLUMNS|COUNT|TTL" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 create last_cache \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --table TABLE_NAME \
  --node-spec "nodes:NODE_LIST" \
  --key-columns KEY_COLUMNS \
  --value-columns VALUE_COLUMNS \
  --count COUNT \
  --ttl TTL\
  LVC_NAME
```
{{% /code-placeholders %}}
<!--------------------------- END ENTERPRISE EXAMPLE -------------------------->
{{% /show-in %}}

## Use the HTTP API

To use the HTTP API to create a Last Value Cache, send a `POST` request to the `/api/v3/configure/last_cache` endpoint.

{{% api-endpoint method="POST" endpoint="/api/v3/configure/last_cache" api-ref="/influxdb3/version/api/v3/#operation/PostConfigureLastCache" %}}

{{% code-placeholders "(DATABASE|TABLE|LVC)_NAME|AUTH_TOKEN|(KEY|VALUE)_COLUMNS|COUNT|TTL" %}}

```bash
curl -X POST "https://localhost:8181/api/v3/configure/last_cache" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --json '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "name": "LVC_NAME",
    "key_columns": ["KEY_COLUMNS"],
    "value_columns": ["VALUE_COLUMNS"],
    "count": COUNT,
    "ttl": TTL
  }'
 ```

 {{% /code-placeholders %}}

 ### Example

```bash
 curl -X POST "https://localhost:8181/api/v3/configure/last_cache" \
  -H "Authorization: Bearer 00xoXX0xXXx0000XxxxXx0Xx0xx0" \
  -H "Content-Type: application/json" \
  -d '{
    "db": "example-db",
    "table": "home",
    "name": "homeLastCache",
    "key_columns": ["room", "wall"],
    "value_columns": ["temp", "hum", "co"],
    "count": 5,
    "ttl": 14400
  }'
``` 

**Response codes:**

- `201` : Success. Last cache created.
- `400` : Bad request.
- `401` : Unauthorized.
- `404` : Cache not found.
- `409` : Cache already exists.

> [!Note]
> #### API parameter differences
> Column format: The API uses JSON arrays (["room", "wall"]) instead of the CLI's comma-delimited format (room,wall).
> TTL format: The API uses seconds (14400) instead of the CLI's humantime format (4h, 4 hours).

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to associate the LVC with
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% show-in "enterprise" %}}admin {{% /show-in %}}
  authentication token
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
  the name of the table to associate the LVC with
{{% show-in "enterprise" %}}
- {{% code-placeholder-key %}}`NODE_LIST`{{% /code-placeholder-key %}}:
  a comma-delimited list of node IDs to configure the LVC on--for example:
  `node-01,node-02`.
{{% /show-in %}}
- {{% code-placeholder-key %}}`KEY_COLUMNS`{{% /code-placeholder-key %}}:
  a comma-delimited list of columns to use to unique identify each series--for
  example: `room,wall`
- {{% code-placeholder-key %}}`VALUE_COLUMNS`{{% /code-placeholder-key %}}:
  a comma-delimited list of columns to cache as value columns--for
  example: `temp,hum,co`
- {{% code-placeholder-key %}}`COUNT`{{% /code-placeholder-key %}}:
  the number of last values to cache per series--for example: `5`
- {{% code-placeholder-key %}}`TTL`{{% /code-placeholder-key %}}:
  the TTL of cached values in
  [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html)
  form--for example: `10s`, `1min 30sec`, `3 hours`
- {{% code-placeholder-key %}}`LVC_NAME`{{% /code-placeholder-key %}}:
  a unique name for the LVC

The cache imports the distinct values from the table and starts caching them.

> [!Important]
> #### LVC size and persistence
>
> The LVC is stored in memory, so it's important to consider the size and persistence
> of the cache. For more information, see
> [Important things to know about the Last Value Cache.](/influxdb3/version/admin/last-value-cache/#important-things-to-know-about-the-last-value-cache)
