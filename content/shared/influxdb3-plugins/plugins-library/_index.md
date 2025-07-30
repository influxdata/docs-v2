Browse plugins for {{% product-name %}}. Use these plugins to extend your database functionality with custom Python code that runs on write events, schedules, or HTTP requests.

{{< children show="sections" >}}

## Requirements

All plugins require:
- InfluxDB 3 Core or InfluxDB 3 Enterprise with Processing Engine enabled
- Python environment (managed automatically by InfluxDB 3)
- Appropriate trigger configuration

## Plugin metadata

Plugins in this library include a JSON metadata schema in a docstring header that defines supported trigger types and configuration parameters. This metadata enables:

- the [InfluxDB 3 Explorer UI](/influxdb3/explorer/) to display and configure the plugin
- automated testing and validation of plugins in the repository

## Using TOML Configuration Files

Many plugins in this library support using TOML configuration files to specify all plugin arguments. This is useful for complex configurations or when you want to version control your plugin settings.

### Important Requirements

**To use TOML configuration files, you must set the `PLUGIN_DIR` environment variable in the {{% product-name %}} host environment.** This is required in addition to the `--plugin-dir` flag when starting {{% product-name %}}:

- `--plugin-dir` tells {{% product-name %}} where to find plugin Python files
- `PLUGIN_DIR` environment variable tells the plugins where to find TOML configuration files

### Set up TOML Configuration

1. **Start {{% product-name %}} with the PLUGIN_DIR environment variable set**:
   ```bash
   PLUGIN_DIR=~/.plugins influxdb3 serve --node-id node0 --object-store file --data-dir ~/.influxdb3 --plugin-dir ~/.plugins
   ```

2. **Copy or create a TOML configuration file in your plugin directory**:
   ```bash
   # Example: copy a plugin's configuration template
   cp plugin_config_example.toml ~/.plugins/my_config.toml
   ```

3. **Edit the TOML file** to match your requirements. The TOML file should contain all the arguments defined in the plugin's argument schema.

4. **Create a trigger with the `config_file_path` argument**:
   When creating a trigger, specify the `config_file_path` argument to point to your TOML configuration file.
   
   - Specify only the filename (not the full path)
   - The file must be located under `PLUGIN_DIR`

   ```bash
   influxdb3 create trigger \
     --database mydb \
     --plugin-filename plugin_name.py \
     --trigger-spec "every:1d" \
     --trigger-arguments config_file_path=my_config.toml \
     my_trigger_name
   ```

For more information on using TOML configuration files, see the project [README](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).
