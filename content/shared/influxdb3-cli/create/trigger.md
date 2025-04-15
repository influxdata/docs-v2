
The `influxdb3 create trigger` command creates a new trigger for the
processing engine.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create trigger [OPTIONS] \
  --database <DATABASE_NAME> \
  --token <AUTH_TOKEN> \
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
|        | `--token`        | _({{< req >}})_ Authentication token                                                     |
|        | `--plugin`       | Plugin to execute when the trigger fires                                                 |
|        | `--trigger-spec` | Trigger specification--for example `table:<TABLE_NAME>` or `all_tables`                  |
|        | `--disabled`     | Create the trigger in disabled state                                                     |
| `-h`   | `--help`         | Print help information                                                                   |
|        | `--help-all`     | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

<!-- TODO: GET EXAMPLES -->
