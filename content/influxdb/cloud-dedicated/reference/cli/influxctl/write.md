---
title: influxctl write
description: >
  The `influxctl write` command writes line protocol to InfluxDB Cloud Dedicated.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl
weight: 201
metadata: [influxctl 2.4.0+]
related:
  - /influxdb/cloud-dedicated/reference/syntax/line-protocol/
  - /influxdb/cloud-dedicated/write-data/
---

The `influxctl write` command writes [line protocol](/influxdb/cloud-dedicated/reference/syntax/line-protocol/)
to {{< product-name >}}.

Provide line protocol in one of the following ways:

- a string on the command line
- a path to a file that contains line protocol
- as a single dash (`-`) to read line protocol from stdin

{{% note %}}
#### Important to note

- This command supports only one write request per execution, but does support
  multiple lines of line protocol and will batch data based on the `--batch-size`.
- This command is not meant to be a full, feature-rich write tool.
  It's meant for debug, triage, and initial exploration.
{{% /note %}}

### InfluxDB connection configuration

Your {{< product-name omit=" Clustered" >}} cluster host and port should be
configured in your in your `influxctl`
[connection profile](/influxdb/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles).
By default TLS and port 443 are used.
You can also set a default database and token to use for the `query` and `write`
commands in your connection profile, but these can also be passed with the
command using the `--database` and `--token` flags.
Command line flags override settings in the connection profile. 

## Usage

```sh
influxctl write [flags] <LINE_PROTOCOL>
```

## Arguments

| Argument          | Description                                                                           |
| :---------------- | :------------------------------------------------------------------------------------ |
| **LINE_PROTOCOL** | Line protocol to write (command line string, path to file, or `-` to read from stdin) |

## Flags

| Flag |                | Description                                                         |
| :--- | :------------- | :------------------------------------------------------------------ |
|      | `--batch-size` | Number of metrics to write per batch (default is `10000`)           |
|      | `--database`   | Database to write to                                                |
|      | `--precision`  | Precision of data timestamps (`ns` _(default)_, `us`, `ms`, or `s`) |
|      | `--token`      | Database token with write permissions on the target database        |
| `-h` | `--help`       | Output command help                                                 |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Write line protocol to InfluxDB v3](#write-line-protocol-to-influxdb-v3)
- [Write line protocol to InfluxDB v3 with non-default timestamp precision](#write-line-protocol-to-influxdb-v3-with-non-default-timestamp-precision)
- [Write line protocol to InfluxDB v3 with a custom batch size](#write-line-protocol-to-influxdb-v3-with-a-custom-batch-size)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  Database token with write access to the target database
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the database to write to

### Write line protocol to InfluxDB v3

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% influxdb/custom-timestamps %}}
```sh
influxctl write \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  "home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000000000000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000000000000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600000000000
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600000000000
"
```
{{% /influxdb/custom-timestamps %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxctl write \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  /path/to/metrics.lp
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
cat ./metrics.lp | influxctl write \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  - 
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

### Write line protocol to InfluxDB v3 with non-default timestamp precision

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% influxdb/custom-timestamps %}}
```sh
influxctl write \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --precision s \
  "home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
"
```
{{% /influxdb/custom-timestamps %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxctl write \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --precision s \
  /path/to/metrics.lp
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
cat ./metrics.lp | influxctl write \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --precision s \
  - 
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

### Write line protocol to InfluxDB v3 with a custom batch size

{{% code-placeholders "DATABASE_(TOKEN|NAME)" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% influxdb/custom-timestamps %}}
```sh
influxctl write \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --batch-size 5000 \
  "home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
"
```
{{% /influxdb/custom-timestamps %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxctl write \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --batch-size 5000 \
  /path/to/metrics.lp
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
cat ./metrics.lp | influxctl write \
  --token DATABASE_TOKEN \
  --database DATABASE_NAME \
  --batch-size 5000 \
  - 
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}
