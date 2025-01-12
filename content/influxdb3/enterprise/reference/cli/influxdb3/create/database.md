---
title: influxdb3 create database
description: >
  The `influxdb3 create database` command creates a new database.
menu:
  influxdb3_enterprise:
    parent: influxdb3 create
    name: influxdb3 create database
weight: 400
---

The `influxdb3 create database` command creates a new database.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create database [OPTIONS] <DATABASE_NAME>
```

## Arguments

- **DATABASE_NAME**: The name of the database to create.
  Valid database names are alphanumeric and start with a letter or number.
  Dashes (`-`) and underscores (`_`) are allowed.
  
  Environment variable: `INFLUXDB3_DATABASE_NAME`

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--token`    | Authentication token                                                                     |
| `-h`   | `--help`     | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [Create a new database](#create-a-new-database)
- [Create a new database while specifying the token inline](#create-a-new-database-while-specifying-the-token-inline)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

### Create a new database

<!--pytest.mark.skip-->

```bash
influxdb3 create database DATABASE_NAME
```

### Create a new database while specifying the token inline

<!--pytest.mark.skip-->

```bash
influxdb3 create database --token AUTH_TOKEN DATABASE_NAME
```

{{% /code-placeholders %}}
