---
title: Use the influxctl CLI to write line protocol data
description: >
  Use the [`influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/)
  to write line protocol data to InfluxDB Clustered.
menu:
  influxdb_clustered:
    name: Use the influxctl CLI
    parent: Write line protocol
    identifier: write-influxctl
weight: 101
related:
  - /influxdb/clustered/reference/cli/influxctl/write/
  - /influxdb/clustered/reference/syntax/line-protocol/
  - /influxdb/clustered/get-started/write/
---

Use the [`influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/)
to write line protocol data to {{< product-name >}}.

- [Construct line protocol](#construct-line-protocol)
- [Write the line protocol to InfluxDB](#write-the-line-protocol-to-influxdb)

## Construct line protocol

With a [basic understanding of line protocol](/influxdb/clustered/write-data/line-protocol/),
you can now construct line protocol and write data to InfluxDB.
Consider a use case where you collect data from sensors in your home.
Each sensor collects temperature, humidity, and carbon monoxide readings.
To collect this data, use the following schema:

- **measurement**: `home` 
  - **tags**
    - `room`: Living Room or Kitchen
  - **fields**
    - `temp`: temperature in °C (float)
    - `hum`: percent humidity (float)
    - `co`: carbon monoxide in parts per million (integer)
  - **timestamp**: Unix timestamp in _second_ precision

The following line protocol represent the schema described above:

```
home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000
```

For this tutorial, you can either pass this line protocol directly to the
`influxctl write` command as a string, via `stdin`, or you can save it to and read
it from a file.

## Write the line protocol to InfluxDB

Use the [`influxctl write` command](/influxdb/clustered/reference/cli/influxctl/write/)
to write the [home sensor sample data](#home-sensor-data-line-protocol) to your
{{< product-name omit=" Clustered" >}} cluster.
Provide the following:

- Database name using the `--database` flag
- [database token](/influxdb/clustered/admin/tokens/#database-tokens) (with write permissions
  on the target database) using the `--token` flag
- Timestamp precision as seconds (`s`) using the `--precision` flag
- [Line protocol](#construct-line-protocol).
  Pass the line protocol in one of the following ways:

  - a string on the command line
  - a path to a file that contains the query
  - a single dash (`-`) to read the query from stdin

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "DATABASE_(NAME|TOKEN)|(LINE_PROTOCOL_FILEPATH)" %}}
```sh
influxctl write \
  --database DATABASE_NAME \
  --token DATABASE_TOKEN \
  --precision s \
  'home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000'
```
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the database to write to.
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  Database token with write permissions on the target database.

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_(NAME|TOKEN)|(LINE_PROTOCOL_FILEPATH)" %}}
```sh
influxctl write \
  --database DATABASE_NAME \
  --token DATABASE_TOKEN \
  --precision s \
  LINE_PROTOCOL_FILEPATH
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the database to write to.
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  Database token with write permissions on the target database.
- {{% code-placeholder-key %}}`LINE_PROTOCOL_FILEPATH`{{% /code-placeholder-key %}}:
  File path to the file containing the line protocol. Can be an absolute file path
  or relative to the current working directory.

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_(NAME|TOKEN)|(LINE_PROTOCOL_FILEPATH)" %}}
```sh
cat LINE_PROTOCOL_FILEPATH | influxctl write \
  --database DATABASE_NAME \
  --token DATABASE_TOKEN \
  --precision s \
  -
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the database to write to.
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  Database token with write permissions on the target database.
- {{% code-placeholder-key %}}`LINE_PROTOCOL_FILEPATH`{{% /code-placeholder-key %}}:
  File path to the file containing the line protocol. Can be an absolute file path
  or relative to the current working directory.

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
