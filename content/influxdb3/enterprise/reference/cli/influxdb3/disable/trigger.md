---
title: influxdb3 disable trigger
description: >
  The `influxdb3 disable trigger` command disables a plugin trigger.
menu:
  influxdb3_enterprise:
    parent: influxdb3 disable
    name: influxdb3 disable trigger
weight: 400
---

The `influxdb3 disable trigger` command disables a plugin trigger.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 disable trigger [OPTIONS] --database <DATABASE_NAME> <TRIGGER_NAME>
```

## Arguments:

- **TRIGGER_NAME**:  Name of the trigger to disable

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
