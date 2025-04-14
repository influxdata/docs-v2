
The `influxdb3 delete plugin` command deletes a processing engine plugin.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 delete plugin [OPTIONS] --database <DATABASE_NAME> <PLUGIN_NAME>
```

## Arguments

- **PLUGIN_NAME**: The name of the plugin to delete.

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database` | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`    | _({{< req >}})_ Authentication token                                                     |
| `-h`   | `--help`     | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

### Delete a plugin

{{% code-placeholders "(DATABASE|PLUGIN)_NAME|AUTH_TOKEN" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 delete plugin \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  PLUGIN_NAME
```

{{% /code-placeholders %}}

In the example above, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token
- {{% code-placeholder-key %}}`PLUGIN_NAME`{{% /code-placeholder-key %}}: 
  Name of the plugin to delete
