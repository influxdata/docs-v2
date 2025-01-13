
The `influxdb3 delete trigger` command deletes a processing engine trigger.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 delete trigger [OPTIONS] --database <DATABASE_NAME> <TRIGGER_NAME>
```

## Arguments

- **TRIGGER_NAME**: The name of the trigger to delete.

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database` | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`    | Authentication token                                                                     |
|        | `--force`    | Force delete even if the trigger is active                                               |
| `-h`   | `--help`     | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [Delete a trigger](#delete-a-trigger)
- [Force delete an active trigger](#force-delete-an-active-trigger)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`TRIGGER_NAME`{{% /code-placeholder-key %}}: 
  Name of the trigger to delete

{{% code-placeholders "(DATABASE|TRIGGER)_NAME" %}}

### Delete a trigger

<!--pytest.mark.skip-->

```bash
influxdb3 delete trigger --database DATABASE_NAME TRIGGER_NAME
```

### Force delete an active trigger

<!--pytest.mark.skip-->

```bash
influxdb3 delete trigger --force --database DATABASE_NAME TRIGGER_NAME
```

{{% /code-placeholders %}}
