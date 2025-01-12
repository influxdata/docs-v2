---
title: influxdb3 test wal_plugin
description: >
  The `influxdb3 test wal_plugin` command tests a write-ahead log (WAL) plugin.
menu:
  influxdb3_enterprise:
    parent: influxdb3 test
    name: influxdb3 test wal_plugin
weight: 400
---

The `influxdb3 test wal_plugin` command tests a write-ahead log (WAL) plugin.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 test wal_plugin [OPTIONS] --database <DATABASE_NAME> <PLUGIN_NAME>
```

## Arguments

- **PLUGIN_NAME**: The name of the plugin file on the server--for example:
  `<plugin-dir>/<plugin-file-name>.py`

## Options

| Option |                     | Description                                                                              |
| :----- | :------------------ | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`            | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database`        | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`           | Authentication token                                                                     |
|        | `--lp`              | Line protocol to use as input                                                            |
|        | `--file`            | Line protocol file to use as input                                                       |
|        | `--input-arguments` | Map of string key-value pairs as to use as plugin input arguments                        |
| `-h`   | `--help`            | Print help information                                                                   |


### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [Test a WAL plugin](#test-a-wal-plugin)
- [Test a WAL plugin with a line protocol string](#test-a-wal-plugin-with-a-line-protocol-string)
- [Test a WAL plugin with a file containing line protocol](#test-a-wal-plugin-with-a-file-containing-line-protocol)
- [Test a WAL plugin using input arguments](#test-a-wal-plugin-using-input-arguments)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`PLUGIN_DIR`{{% /code-placeholder-key %}}: 
  Plugin directory name
- {{% code-placeholder-key %}}`PLUGIN_NAME`{{% /code-placeholder-key %}}: 
  Plugin file name

{{% code-placeholders "(DATABASE|PLUGIN)_(NAME|DIR)" %}}

### Test a WAL plugin

<!--pytest.mark.skip-->

```bash
influxdb3 test wal_plugin \
  --database DATABASE_NAME \
  PLUGIN_DIR/PLUGIN_NAME.py
```

### Test a WAL plugin with a line protocol string

<!--pytest.mark.skip-->

```bash
influxdb3 test wal_plugin \
  --lp 'home,room=Kitchen temp=21.0,hum=35.9,co=0i' \
  --database DATABASE_NAME \
  PLUGIN_DIR/PLUGIN_NAME.py
```

### Test a WAL plugin with a file containing line protocol

<!--pytest.mark.skip-->

```bash
influxdb3 test wal_plugin \
  --file PLUGIN_DIR/PLUGIN_NAME_test/input-file.lp`
  --database DATABASE_NAME \
  PLUGIN_DIR/PLUGIN_NAME.py
```

### Test a WAL plugin using input arguments

<!--pytest.mark.skip-->

```bash
influxdb3 test wal_plugin \
  --input-arguments arg1=foo,arg2=baz \
  --database DATABASE_NAME \
  PLUGIN_DIR/PLUGIN_NAME.py
```

{{% /code-placeholders %}}
