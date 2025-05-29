
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
