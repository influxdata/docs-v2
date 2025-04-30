
The `influxdb3 create trigger` command creates a new trigger for the
processing engine.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create trigger [OPTIONS] \
  --database <DATABASE_NAME> \
  --plugin <PLUGIN_NAME> \
  --trigger-spec <TRIGGER_SPECIFICATION> \
  <TRIGGER_NAME>
```

## Arguments

- **TRIGGER_NAME**: A name for the new trigger.

## Options

| Option |                  | Description                                                                              |
| :----- | :--------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`         | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database`     | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`        | Authentication token                                                                     |
|        | `--trigger-spec` | Trigger specification--for example `table:<TABLE_NAME>` or `all_tables`                  |
|        | `--disabled`     | Create the trigger in disabled state                                                     |
| `-h`   | `--help`         | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Database name
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: Name of the table to trigger on
- {{% code-placeholder-key %}}`TRIGGER_NAME`{{% /code-placeholder-key %}}: Name to assign to the new trigger

{{% code-placeholders "(DATABASE|TABLE|TRIGGER)_NAME" %}}

### Create a trigger for a specific table

This creates a trigger that activates when data is written to a specific table:

<!--pytest.mark.skip-->

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --trigger-spec "table:TABLE_NAME" \
  TRIGGER_NAME
```

### Create a trigger for all tables

This creates a trigger that activates when data is written to any table in the database:

<!--pytest.mark.skip-->

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --trigger-spec "all_tables" \
  TRIGGER_NAME 
```
### Create a disabled trigger

This creates a trigger in a disabled state. You can enable it later when needed:

<!--pytest.mark.skip-->

```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --trigger-spec "table:TABLE_NAME" \
  --disabled \
  TRIGGER_NAME
```
{{% /code-placeholders %}}