---
title: influxdb3 write
description: >
  The `influxdb3 write` command writes data to your InfluxDB 3 Enterprise server.
menu:
  influxdb3_enterprise:
    parent: influxdb3
    name: influxdb3 write
weight: 300
---

The `influxdb3 write` command writes data to your InfluxDB 3 Enterprise server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 write [OPTIONS] --database <DATABASE_NAME> --file <FILE_PATH>
```

##### Aliases

`write`, `w`

## Options

| Option |                    | Description                                                                              |
| :----- | :----------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`           | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database`       | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`          | Authentication token                                                                     |
| `-f`   | `--file`           | _({{< req >}})_ Line protocol file to use to write data                                  |
|        | `--accept-partial` | Accept partial writes                                                                    |
| `-h`   | `--help`           | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [Write line protocol to your InfluxDB 3 server](#write-line-protocol-to-your-influxdb-3-server)
- [Write line protocol and accept partial writes](#write-line-protocol-and-accept-partial-writes)

In the examples below, replace
{{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
with the name of the database to query.

{{% code-placeholders "DATABASE_NAME" %}}

### Write line protocol to your InfluxDB 3 server

<!--pytest.mark.skip-->

```bash
influxdb3 write --database DATABASE_NAME --file /path/to/data.lp
```

### Write line protocol and accept partial writes

<!--pytest.mark.skip-->

```bash
influxdb3 write \
  --accept-partial \
  --database DATABASE_NAME \
  --file /path/to/data.lp
```

{{% /code-placeholders %}}
