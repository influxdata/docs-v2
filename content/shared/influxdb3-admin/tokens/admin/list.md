Use the `influxdb3` CLI or the `/api/v3` HTTP API to list _admin_ tokens for your
{{% product-name %}} instance.

Admin tokens have `permissions=*:*:*`, which allows access to all
data and resources in your InfluxDB 3 instance.

> [!NOTE]
> Token metadata includes the hashed token string.
> InfluxDB 3 does not store the raw token string.

> [!Important]
> #### Required permissions
>
> Listing admin tokens requires a valid InfluxDB {{% token-link "admin" %}}{{% show-in "enterprise" %}} or a token with read access to the `_internal` system database{{% /show-in %}}.
> For more information, see how to [provide your token](/influxdb3/version/admin/tokens/#provide-your-token).

## List all tokens

The `influxdb3 show tokens` CLI command lists all admin and resource tokens in your InfluxDB 3 instance.

```bash
influxdb3 show tokens
```

## Query token metadata

To filter tokens and retrieve specific details using SQL, query the `system.tokens` table in the
`_internal` system database--for example:

### Filter for admin tokens

{{% code-placeholders "AUTH_TOKEN" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#cli-query-tokens)
[HTTP API](#http-api-query-tokens)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---------------------------BEGIN CLI----------------------------------------->
```bash
influxdb3 query \
  --database _internal \
  --format csv \
  "SELECT name, permissions FROM system.tokens WHERE permissions = '*:*:*'"
```
<!---------------------------END CLI------------------------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---------------------------BEGIN HTTP API---------------------------------->
```bash
curl -G \
  "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --data-urlencode "db=_internal" \
  --data-urlencode "q=SELECT name, permissions FROM system.tokens WHERE permissions = '*:*:*'" \
  --data-urlencode "format=csv" \
  --header 'Accept: text/csv' \
  --header "Authorization: Bearer AUTH_TOKEN"
```
<!-----------------------------END HTTP API------------------------------------>
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

### Filter by date

{{% code-placeholders "AUTH_TOKEN" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#cli-filter-in-query)
[HTTP API](#http-api-filter-in-query)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---------------------------BEGIN CLI----------------------------------------->
```bash
influxdb3 query \
  --db _internal \
  "SELECT name, permissions FROM system.tokens WHERE created_at > '2025-01-01 00:00:00'"
```
<!---------------------------END CLI------------------------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---------------------------BEGIN HTTP API---------------------------------->
```bash
curl -G \
"http://{{< influxdb/host >}}/api/v3/query_sql" \
--data-urlencode "db=_internal" \
--data-urlencode "q=SELECT name, permissions FROM system.tokens WHERE created_at > '2025-01-01 00:00:00'" \
--header "Accept: application/json" \
--header "Authorization: Bearer AUTH_TOKEN" 
```
<!-----------------------------END HTTP API------------------------------------>
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}
{{% /code-placeholders %}}

## Output formats

Use the format option to specify the output format for
commands.

{{% product-name %}} commands used in this guide support the following output formats:

- `json` _(default for HTTP API)_
- `pretty` _(default for CLI)_
- `jsonl`
- `csv`
- `parquet` _([output to a file](#output-to-a-parquet-file))_

{{% code-placeholders "AUTH_TOKEN" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#format-using-the-cli)
[HTTP API](#format-using-the-api)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---------------------------BEGIN CLI----------------------------------------->
```bash
influxdb3 show tokens \
  --format jsonl
```
<!---------------------------END CLI------------------------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---------------------------BEGIN HTTP API---------------------------------->
```bash
curl -G \
  "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --data-urlencode "db=_internal" \
  --data-urlencode "q=SELECT * FROM system.tokens" \
  --data-urlencode "format=csv" \
  --header 'Accept: text/csv' \
  --header "Authorization: Bearer AUTH_TOKEN"
```
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}
{{% /code-placeholders %}}

### Output to a Parquet file

[Parquet](https://parquet.apache.org/) is a binary format.

To output to a Parquet file using the CLI, include the `--output` option 
with a destination path for the file.

To output a Parquet file using the HTTP API, your client must be able to handle binary data--for example,
using cURL's `--output` option.

{{% code-placeholders "AUTH_TOKEN|(/PATH/TO/FILE.parquet)" %}}
{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[CLI](#cli-output-to-parquet)
[HTTP API](#http-api-output-to-parquet)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---------------------------BEGIN CLI----------------------------------------->
```bash
influxdb3 show tokens \
  --format parquet \
  --output /PATH/TO/FILE.parquet
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---------------------------BEGIN HTTP API---------------------------------->
```bash
curl -G \
"http://{{< influxdb/host >}}/api/v3/query_sql" \
--data-urlencode "db=_internal" \
--data-urlencode "q=SELECT * FROM system.tokens" \
--data-urlencode "format=parquet" \
--header "Accept: application/parquet" \
--header "Authorization: Bearer AUTH_TOKEN" \
--output /PATH/TO/FILE.parquet
```
<!-----------------------------END HTTP API------------------------------------>
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`/PATH/TO/FILE.parquet`{{% /code-placeholder-key %}}
with the path to the file where you want to save the Parquet data.

## Filter the token list

Use command-line tools such as `grep` or `jq` to filter the output of the
`influxdb3 show tokens` command or the HTTP API response--for example:

{{% code-placeholders "AUTH_TOKEN" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#cli-filter-admin-using-grep)
[HTTP API](#http-api-filter-admin-using-grep)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---------------------------BEGIN CLI----------------------------------------->
```bash
influxdb3 show tokens --format pretty |
grep _admin
```
<!---------------------------END CLI------------------------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---------------------------BEGIN HTTP API---------------------------------->
```bash
curl -G \
  "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --data-urlencode "db=_internal" \
  --data-urlencode "q=SELECT * FROM system.tokens" \
  --data-urlencode "format=pretty" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" |
grep _admin 
```
<!-----------------------------END HTTP API------------------------------------>
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

{{% code-placeholders "AUTH_TOKEN" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#cli-filter-output-using-jq)
[HTTP API](#http-api-filter-output-using-jq)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---------------------------BEGIN CLI----------------------------------------->
```bash
influxdb3 show tokens --format json |
jq '.[] | {name: .name, permissions: .permissions}'
```
<!---------------------------END CLI------------------------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---------------------------BEGIN HTTP API---------------------------------->
```bash
curl -G \
  "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --data-urlencode "db=_internal" \
  --data-urlencode "q=SELECT name, created_at FROM system.tokens WHERE permissions = '*:*:*' AND created_at > '2025-01-01 00:00:00'" \
  --data-urlencode "format=json" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" |
jq '.[] | {name: .name, created_at: .created_at}'
```
<!-----------------------------END HTTP API------------------------------------>
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}