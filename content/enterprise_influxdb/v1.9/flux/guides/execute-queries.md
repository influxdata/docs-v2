---
title: Execute Flux queries
description: Use the InfluxDB CLI, API, and the Chronograf Data Explorer to execute Flux queries.
menu:
  enterprise_influxdb_1_9:
    name: Execute Flux queries
    parent: Query with Flux
weight: 1
aliases:
  - /enterprise_influxdb/v1.9/flux/guides/executing-queries/
v2: /influxdb/v2.0/query-data/execute-queries/
---

There are multiple ways to execute Flux queries with InfluxDB and Chronograf v1.8+.
This guide covers the different options:

1. [Chronograf's Data Explorer](#chronograf-s-data-explorer)
2. [Influx CLI](#influx-cli)
3. [InfluxDB API](#influxdb-api)

> Before attempting these methods, make sure Flux is enabled by setting
> `flux-enabled = true` in the `[http]` section of your InfluxDB configuration file.

## Chronograf's Data Explorer
Chronograf v1.8+ supports Flux in its Data Explorer.
Flux queries can be built, executed, and visualized from within the Chronograf user interface.

{{% note %}}
If [authentication is enabled](/enterprise_influxdb/v1.9/administration/authentication_and_authorization)
on your InfluxDB instance, use the `-username` flag to provide your InfluxDB username and
the `-password` flag to provide your password.
{{% /note %}}

### Submit a Flux query via via STDIN
Flux queries an be piped into the `influx` CLI via STDIN.
Query results are otuput in your terminal.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[No Auth](#)
[Auth Enabled](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
echo '<flux query>' | influx -type=flux
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
echo '<flux query>' | influx -type=flux -username myuser -password PasSw0rd
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## InfluxDB API
Flux can be used to query InfluxDB through InfluxDB's `/api/v2/query` endpoint.
Queried data is returned in annotated CSV format.

In your request, set the following:

- `Accept` header to `application/csv`
- `Content-type` header to `application/vnd.flux`
- If [authentication is enabled](/enterprise_influxdb/v1.9/administration/authentication_and_authorization)
  on your InfluxDB instance, `Authorization` header to `Token <username>:<password>`

This allows you to POST the Flux query in plain text and receive the annotated CSV response.

Below is an example `curl` command that queries InfluxDB using Flux:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[No Auth](#)
[Auth Enabled](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
curl -XPOST localhost:8086/api/v2/query -sS \
  -H 'Accept:application/csv' \
  -H 'Content-type:application/vnd.flux' \
  -d 'from(bucket:"telegraf")
        |> range(start:-5m)
        |> filter(fn:(r) => r._measurement == "cpu")'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
curl -XPOST localhost:8086/api/v2/query -sS \
  -H 'Accept:application/csv' \
  -H 'Content-type:application/vnd.flux' \
  -H 'Authorization: Token <username>:<password>' \
  -d 'from(bucket:"telegraf")
        |> range(start:-5m)
        |> filter(fn:(r) => r._measurement == "cpu")'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
