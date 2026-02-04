
Use the [`influxdb3 create distinct_cache` command](/influxdb3/version/reference/cli/influxdb3/create/distinct_cache/)
to create a Distinct Value Cache (DVC). Provide the following:

- **Database** (`-d`, `--database`): _({{< req >}})_ The name of the database to
  associate the DVC with. You can also use the `INFLUXDB3_DATABASE_NAME`
  environment variable to specify the database.
- **Token** (`--token`): _({{< req >}})_ Your {{< product-name >}}
  {{% show-in "enterprise" %}}admin {{% /show-in %}}authentication token.
  You can also use the `INFLUXDB3_AUTH_TOKEN` environment variable to specify
  the token.
- **Table** (`-t`, `--table`): _({{< req >}})_ The name of the table to
  associate the DVC with.
{{% show-in "enterprise" %}}
- **Node specification** (`-n`, `--node-spec`): Specify which nodes the DVC
  should be configured on.
{{% /show-in %}}
- **Columns** (`--columns`): _({{< req >}})_ Specify which columns to cache
  distinct values for. These are typically tag columns but can also be
  string fields.
- **Maximum cardinality** (`--max-cardinality`): Specify the maximum number of
  distinct value combinations to store in the cache. The default maximum
  cardinality is `100000`.
- **Maximum age** (`--max-age`): Specify the maximum age of distinct values to
  keep in the DVC in
  [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html)
  form. The default maximum age is `24 hours`.
- **Cache name**: A unique name for the cache. If you don’t provide one,
  InfluxDB automatically generates a cache name for you.

{{% show-in "core" %}}
<!----------------------------- BEGIN CORE EXAMPLE ---------------------------->
{{% code-placeholders "(DATABASE|TABLE|DVC)_NAME|AUTH_TOKEN|NODE_SPEC|COLUMNS|MAX_(CARDINALITY|AGE)" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 create distinct_cache \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --table TABLE_NAME \
  --columns COLUMNS \
  --max-cardinality MAX_CARDINALITY \
  --max-age MAX_AGE \
  DVC_NAME
```
{{% /code-placeholders %}}
<!------------------------------ END CORE EXAMPLE ----------------------------->
{{% /show-in %}}

{{% show-in "enterprise" %}}
<!-------------------------- BEGIN ENTERPRISE EXAMPLE ------------------------->
{{% code-placeholders "(DATABASE|TABLE|DVC)_NAME|AUTH_TOKEN|NODE_LIST|COLUMNS|MAX_(CARDINALITY|AGE)" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 create distinct_cache \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --table TABLE_NAME \
  --node-spec "nodes:NODE_LIST" \
  --columns COLUMNS \
  --max-cardinality MAX_CARDINALITY \
  --max-age MAX_AGE \
  DVC_NAME
```
{{% /code-placeholders %}}
<!--------------------------- END ENTERPRISE EXAMPLE -------------------------->
{{% /show-in %}}

## Use the HTTP API

To use the HTTP API to create a Distinct Value Cache, send a `POST` request to the `/api/v3/configure/distinct_cache` endpoint.

{{% api-endpoint method="POST" endpoint="/api/v3/configure/distinct_cache" api-ref="/influxdb3/version/api/v3/#post-/api/v3/configure/distinct_cache" %}}

{{% code-placeholders "(DATABASE|TABLE|DVC)_NAME|AUTH_TOKEN|COLUMNS|MAX_(CARDINALITY|AGE)" %}}

```bash
curl -X POST "https://localhost:8181/api/v3/configure/distinct_cache" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --json '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "name": "DVC_NAME",
    "columns": ["COLUMNS"],
    "max_cardinality": MAX_CARDINALITY,
    "max_age": MAX_AGE
  }'
```

{{% /code-placeholders %}}

### Example

```bash
curl -X POST "https://localhost:8181/api/v3/configure/distinct_cache" \
  --header "Authorization: Bearer 00xoXX0xXXx0000XxxxXx0Xx0xx0" \
  --json '{
    "db": "example-db",
    "table": "wind_data", 
    "name": "windDistinctCache",
    "columns": ["country", "county", "city"],
    "max_cardinality": 10000,
    "max_age": 86400
  }'
```
  
**Response codes:**

- `201` : Success. The distinct cache has been created.
- `204` : Not created. A distinct cache with this configuration already exists.
- `400` : Bad request.


> [!Note]
> #### API parameter differences
>
> - **Columns format**: The API uses a JSON array (`["country", "county", "city"]`) 
>   instead of the CLI's comma-delimited format (`country,county,city`).
> - **Maximum age format**: The API uses seconds (`86400`) instead of the CLI's 
>   [humantime format](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html) (`24h`, `1 day`).

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to associate the DVC with
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% show-in "enterprise" %}}admin {{% /show-in %}}
  authentication token
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
  the name of the table to associate the DVC with
{{% show-in "enterprise" %}}
- {{% code-placeholder-key %}}`NODE_LIST`{{% /code-placeholder-key %}}:
  a comma-delimited list of node IDs to configure the DVC on--for example:
  `node-01,node-02`.
{{% /show-in %}}
- {{% code-placeholder-key %}}`COLUMNS`{{% /code-placeholder-key %}}:
  a comma-delimited list of columns to cache distinct values for--for example:
  `country,county,city`
- {{% code-placeholder-key %}}`MAX_CARDINALITY`{{% /code-placeholder-key %}}:
  the maximum number of distinct value combinations to cache--for example: `10000`
- {{% code-placeholder-key %}}`MAX_AGE`{{% /code-placeholder-key %}}:
  the maximum age of distinct values to keep in the cache in
  [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html)
  form--for example: `6h`, `1 day`, `1 week`
- {{% code-placeholder-key %}}`DVC_NAME`{{% /code-placeholder-key %}}:
  a unique name for the DVC


The cache imports the distinct values from the table and starts caching them.

> [!Important]
> #### DVC size and persistence
>
> The DVC is stored in memory, so it's important to consider the size and
> persistence of the cache. For more information, see
> [Important things to know about the Distinct Value Cache](/influxdb3/version/admin/distinct-value-cache/#important-things-to-know-about-the-distinct-value-cache).
