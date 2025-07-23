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
