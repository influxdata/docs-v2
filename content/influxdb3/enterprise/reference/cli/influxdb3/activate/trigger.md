---
title: influxdb3 activate trigger
description: >
  The `influxdb3 activate trigger` command activates a trigger to enable plugin execution.
menu:
  influxdb3_enterprise:
    parent: influxdb3 activate
    name: influxdb3 activate trigger
weight: 400
---

The `influxdb3 activate trigger` command activates a trigger to enable plugin execution.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 activate trigger [OPTIONS] --database <DATABASE_NAME> <TRIGGER_NAME>
```

## Arguments:

- **TRIGGER_NAME**:  Name of the trigger to enable

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database` | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`    | Authentication token                                                                     |
| `-h`   | `--help`     | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |
