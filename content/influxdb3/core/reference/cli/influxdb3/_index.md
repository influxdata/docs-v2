---
title: influxdb3 CLI
list_title: influxdb3
description: >
  The `influxdb3` CLI runs and interacts with the InfluxDB 3 Core server.
menu:
  influxdb3_core:
    parent: CLIs
    name: influxdb3
weight: 200
---

The `influxdb3` CLI runs and interacts with the {{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 [GLOBAL-OPTIONS] [COMMAND]
```

## Commands

| Command                                                           | Description                      |
| :--------------------------------------------------------------| :---------------------------------- |
| [create](/influxdb3/core/reference/cli/influxdb3/create/)   | Create resources                    |
| [delete](/influxdb3/core/reference/cli/influxdb3/delete/)   | Delete resources                    |
| [disable](/influxdb3/core/reference/cli/influxdb3/disable/) | Disable resources                   |
| [enable](/influxdb3/core/reference/cli/influxdb3/enable/)   | Enable resources                    |
| [query](/influxdb3/core/reference/cli/influxdb3/query/)     | Query {{% product-name %}}          |
| [serve](/influxdb3/core/reference/cli/influxdb3/serve/)     | Run the {{% product-name %}} server |
| [show](/influxdb3/core/reference/cli/influxdb3/show/)       | List resources                      |
| [test](/influxdb3/core/reference/cli/influxdb3/test/)       | Test plugins                        |
| [update](/influxdb3/core/reference/cli/influxdb3/update/)   | Update resources                    |
| [write](/influxdb3/core/reference/cli/influxdb3/write/)     | Write to {{% product-name %}}       |

## Global options

| Option |                   | Description                                                           |
| :----- | :---------------- | :-------------------------------------------------------------------- |
| `-h`   | `--help`          | Print help information                                                |
|        | `--help-all`      | Print detailed help information including runtime configuration options |
| `-V`   | `--version`       | Print version                                                         |

For advanced global configuration options (including `--num-io-threads` and other runtime settings), see [Configuration options](/influxdb3/core/reference/config-options/#global-configuration-options).


## Examples

In the examples below, replace
{{% code-placeholder-key %}}`my-host-01`{{% /code-placeholder-key %}}:
with a unique identifier for your {{< product-name >}} server.

{{% code-placeholders "my-host-01" %}}

### Run the InfluxDB 3 server

<!--pytest.mark.skip-->

```bash
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01
```

### Run the InfluxDB 3 server with custom IO threads

<!--pytest.mark.skip-->

```bash
influxdb3 --num-io-threads=8 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01
```

### Display short-form help for all commands

<!--pytest.mark.skip-->

```bash
influxdb3 -h
```

### Display long-form help for all commands

<!--pytest.mark.skip-->

```bash
influxdb3 --help
```

### Run the {{% product-name %}} server with extra verbose logging

<!--pytest.mark.skip-->

```bash
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --verbose
```

### Run {{% product-name %}} with debug logging using LOG_FILTER

<!--pytest.mark.skip-->

```bash
LOG_FILTER=debug influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01
```

{{% /code-placeholders %}}