---
title: List resource tokens
description: >
  Use the `influxdb3` CLI or the HTTP API to list resource tokens with fine-grained
  access permissions in your {{% product-name %}} instance. 
  Use the  `influxdb3 show tokens` command to list all tokens or use SQL to query token
  metadata directly from the `system.tokens` table.
menu:
  influxdb3_enterprise:
    parent: Resource tokens
weight: 202
list_code_example: |
  ##### CLI
  ```bash
  influxdb3 show tokens
  ```
  
  ##### HTTP API
  ```bash
  curl -G \
  "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --data-urlencode "db=_internal" \
  --data-urlencode "q=SELECT * FROM system.tokens WHERE permissions NOT LIKE '\*%'" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer AUTH_TOKEN" 
  ```
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/token/list/
  - /influxdb3/enterprise/reference/api/
---

Use the `influxdb3` CLI or the HTTP API to list resource tokens with fine-grained
access permissions in your {{% product-name %}} instance. 
Use the  `influxdb3 show tokens` command to list all tokens or use SQL to query token
metadata directly from the `system.tokens` table.

Resource tokens have fine-grained permissions for InfluxDB 3 resources, such
as databases and system tables.
The permissions are in the format `RESOURCE_TYPE:RESOURCE_NAMES:ACTIONS`.

- `RESOURCE_TYPE` is the type of resource (for example, `db`, `system`)
- `RESOURCE_NAMES` is the specific resource name (for example, a list of database names or `*` for all)
- `ACTIONS` is the permission level (`read`, `write`, or `*` for all)

Database resource tokens have permissions in the format `db:database_names:actions`.
System resource tokens have permissions in the format `system:system_endpoint_names:read`.

_In the following examples, replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}
with your InfluxDB {{% token-link %}}{{% show-in "enterprise" %}}
that has read permission on the `_internal` system database{{% /show-in %}}._

## List all tokens

The `influxdb3 show tokens` CLI command lists all admin and resource tokens in your InfluxDB 3 instance.

```bash
influxdb3 show tokens
```

## Query token metadata

To filter tokens and retrieve specific details using SQL, query the `system.tokens` table in the
`_internal` system database--for example:

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
  "SELECT name, permissions FROM system.tokens WHERE permissions  NOT LIKE '\*%'"
```
<!---------------------------END CLI------------------------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
{{% code-placeholders "AUTH_TOKEN" %}}
<!---------------------------BEGIN HTTP API---------------------------------->
```bash
curl -G \
"http://{{< influxdb/host >}}/api/v3/query_sql" \
--data-urlencode "db=_internal" \
--data-urlencode "q=SELECT * FROM system.tokens WHERE permissions NOT LIKE '\*%'" \
--header 'Accept: application/json' \
--header "Authorization: Bearer AUTH_TOKEN" 
```
{{% /code-placeholders %}}
<!-----------------------------END HTTP API------------------------------------>
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

## Format the output 

Use the format option to specify the output format for
the `influxdb3 show tokens` command or the HTTP API response.

{{% product-name %}} supports the following output formats:

- `pretty` _(default for CLI)_
- `json` _(default for HTTP API)_
- `jsonl`
- `csv`
- `parquet` _([output to a file](#output-to-a-parquet-file))_

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#format-using-the-cli)
[HTTP API](#format-using-the-api)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---------------------------BEGIN CLI----------------------------------------->

```bash
influxdb3 show tokens \
  --format csv
```
<!---------------------------END CLI------------------------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---------------------------BEGIN HTTP API---------------------------------->

{{% code-placeholders "AUTH_TOKEN" %}}
```bash
curl -G \
  "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --data-urlencode "db=_internal" \
  --data-urlencode "q=SELECT * FROM system.tokens" \
  --data-urlencode "format=csv" \
  --header 'Accept: text/csv' \
  --header "Authorization: Bearer AUTH_TOKEN"
```
{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

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

## Filter the output for resource tokens

You can use tools such as `grep` or `jq` to filter the token list--for example:

Use `grep` to filter for resource (non-admin) tokens:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#cli-filter-output-using-grep)
[HTTP API](#list-tokens-using-the-api)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---------------------------BEGIN CLI----------------------------------------->

```bash
influxdb3 show tokens --format pretty | grep -v '*:*:*'
```
<!---------------------------END CLI------------------------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---------------------------BEGIN HTTP API---------------------------------->
{{% code-placeholders "AUTH_TOKEN" %}}
```bash
curl -G \
  "http://localhost:8181/api/v3/query_sql" \
  --data-urlencode "db=_internal" \
  --data-urlencode "q=SELECT * FROM system.tokens" \
  --data-urlencode "format=jsonl" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer AUTH_TOKEN" |
grep -v "*:*:*"
```
{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

Use `jq` to filter for system tokens and display their permissions:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#filter-output-using-the-cli)
[HTTP API](#filter-output-using-the-api)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---------------------------BEGIN CLI----------------------------------------->

```bash
influxdb3 show tokens --format json |
jq '.[] | select(.permissions | startswith("system:")) | {name: .name, permissions: .permissions}'
```
<!---------------------------END CLI------------------------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---------------------------BEGIN HTTP API---------------------------------->
{{% code-placeholders "AUTH_TOKEN" %}}
```bash
curl -G \
  "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --data-urlencode "db=_internal" \
  --data-urlencode "q=SELECT * FROM system.tokens" \
  --data-urlencode "format=json" \
  --header "Accept: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" |
jq '.[] | select(.permissions | startswith("system:")) | {name: .name, permissions: .permissions}'
```
{{% /code-placeholders %}}
<!-----------------------------END HTTP API------------------------------------>
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
