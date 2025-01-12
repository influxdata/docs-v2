---
title: influxdb3 create plugin
description: >
  The `influxdb3 create plugin` command creates a new processing engine plugin.
menu:
  influxdb3_enterprise:
    parent: influxdb3 create
    name: influxdb3 create plugin
weight: 400
---

The `influxdb3 create plugin` command creates a new processing engine plugin.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create plugin [OPTIONS] \
  --database <DATABASE_NAME> \
  --code-filename <CODE_FILE> \
  --entry-point <FUNCTION_NAME> \
  <PLUGIN_NAME>
```

## Arguments

- **PLUGIN_NAME**: The name of the plugin to create.

## Options

| Option |                   | Description                                                                              |
| :----- | :---------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`          | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database`      | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`         | Authentication token                                                                     |
|        | `--code-filename` | _({{< req >}})_ Python file containing the plugin code                                   |
|        | `--entry-point`   | _({{< req >}})_ Entry point function name for the plugin                                 |
|        | `--plugin-type`   | Type of trigger the plugin processes (default is `wal_rows`)                             |
| `-h`   | `--help`          | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

<!-- TODO: GET EXAMPLES -->
