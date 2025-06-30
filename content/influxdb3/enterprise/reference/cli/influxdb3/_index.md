---
title: influxdb3 CLI
list_title: influxdb3
description: >
  The `influxdb3` CLI runs and interacts with the InfluxDB 3 Enterprise server.
menu:
  influxdb3_enterprise:
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
| [create](/influxdb3/enterprise/reference/cli/influxdb3/create/)   | Create resources                    |
| [delete](/influxdb3/enterprise/reference/cli/influxdb3/delete/)   | Delete resources                    |
| [disable](/influxdb3/enterprise/reference/cli/influxdb3/disable/) | Disable resources                   |
| [enable](/influxdb3/enterprise/reference/cli/influxdb3/enable/)   | Enable resources                    |
| [query](/influxdb3/enterprise/reference/cli/influxdb3/query/)     | Query {{% product-name %}}          |
| [serve](/influxdb3/enterprise/reference/cli/influxdb3/serve/)     | Run the {{% product-name %}} server |
| [show](/influxdb3/enterprise/reference/cli/influxdb3/show/)       | List resources                      |
| [test](/influxdb3/enterprise/reference/cli/influxdb3/test/)       | Test plugins                        |
| [update](/influxdb3/enterprise/reference/cli/influxdb3/update/)   | Update resources                    |
| [write](/influxdb3/enterprise/reference/cli/influxdb3/write/)     | Write to {{% product-name %}}       |

## Global options

| Option |                                       | Description                                                                                       |
| :----- | :------------------------------------ | :------------------------------------------------------------------------------------------------ |
|        | `--num-threads`                       | Maximum number of IO runtime threads to use                                                       |
|        | `--io-runtime-type`                   | IO tokio runtime type (`current-thread`, `multi-thread` _(default)_, or `multi-thread-alt`)       |
|        | `--io-runtime-disable-lifo-slot`      | Disable LIFO slot of IO runtime                                                                   |
|        | `--io-runtime-event-interval`         | Number of scheduler ticks after which the IOtokio runtime scheduler will poll for external events |
|        | `--io-runtime-global-queue-interval`  | Number of scheduler ticks after which the IO runtime scheduler will poll the global task queue    |
|        | `--io-runtime-max-blocking-threads`   | Limit for additional threads spawned by the IO runtime                                            |
|        | `--io-runtime-max-io-events-per-tick` | Maximum number of events to be processed per tick by the tokio IO runtime                         |
|        | `--io-runtime-thread-keep-alive`      | Custom timeout for a thread in the blocking pool of the tokio IO runtime                          |
|        | `--io-runtime-thread-priority`        | Set thread priority tokio IO runtime workers                                                      |
| `-h`   | `--help`                              | Print help information                                                                            |
|        | `--help-all`                          | Print detailed help information                                                                   |
| `-V`   | `--version`                           | Print version                                                                                     |

### Option environment variables

You can use the following environment variables to set `influxdb3` global options:

| Environment Variable                          | Option                                |
| :-------------------------------------------- | :------------------------------------ |
| `INFLUXDB3_NUM_THREADS`                       | `--num-threads`                       |
| `INFLUXDB3_IO_RUNTIME_TYPE`                   | `--io-runtime-type`                   |
| `INFLUXDB3_IO_RUNTIME_DISABLE_LIFO_SLOT`      | `--io-runtime-disable-lifo-slot`      |
| `INFLUXDB3_IO_RUNTIME_EVENT_INTERVAL`         | `--io-runtime-event-interval`         |
| `INFLUXDB3_IO_RUNTIME_GLOBAL_QUEUE_INTERVAL`  | `--io-runtime-global-queue-interval`  |
| `INFLUXDB3_IO_RUNTIME_MAX_BLOCKING_THREADS`   | `--io-runtime-max-blocking-threads`   |
| `INFLUXDB3_IO_RUNTIME_MAX_IO_EVENTS_PER_TICK` | `--io-runtime-max-io-events-per-tick` |
| `INFLUXDB3_IO_RUNTIME_THREAD_KEEP_ALIVE`      | `--io-runtime-thread-keep-alive`      |
| `INFLUXDB3_IO_RUNTIME_THREAD_PRIORITY`        | `--io-runtime-thread-priority`        |


## Examples

In the examples below, replace the following:

- {{% code-placeholder-key %}}`my-host-01`{{% /code-placeholder-key %}}:
a unique identifier for your {{< product-name >}} server.
- {{% code-placeholder-key %}}`my-cluster-01`{{% /code-placeholder-key %}}:
a unique identifier for your {{< product-name >}} cluster.
The value you use must be different from `--node-id` values in the cluster.

{{% code-placeholders "my-host-01|my-cluster-01" %}}

### Run the InfluxDB 3 server

<!--pytest.mark.skip-->

```bash
influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01
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
influxdb3 serve -v \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01
```

### Run {{% product-name %}} with debug logging using LOG_FILTER

<!--pytest.mark.skip-->

```bash
LOG_FILTER=debug influxdb3 serve \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --node-id my-host-01 \
  --cluster-id my-cluster-01
```

{{% /code-placeholders %}} 