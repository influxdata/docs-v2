Use the Processing Engine in {{% product-name %}} to extend your database with custom Python code. Trigger your code on write, on a schedule, or on demand to automate workflows, transform data, and create API endpoints. 

## What is the Processing Engine?

The Processing Engine is an embedded Python virtual machine that runs inside your {{% product-name %}} database. You configure  _triggers_ to run your Python _plugin_ code in response to:

- **Data writes** - Process and transform data as it enters the database
- **Scheduled events** - Run code at defined intervals or specific times
- **HTTP requests** - Expose custom API endpoints that execute your code

You can use the Processing Engine's in-memory cache to manage state between executions and build stateful applications directly in your database.

This guide walks you through setting up the Processing Engine, creating your first plugin, and configuring triggers that execute your code on specific events.

## Before you begin

Ensure you have: 
- A working {{% product-name %}} instance
- Access to command line
- Python installed if you're writing your own plugin
- Basic knowledge of the InfluxDB CLI

Once you have all the prerequisites in place, follow these steps to implement the Processing Engine for your data automation needs.

- [Set up the Processing Engine](#set-up-the-processing-engine)
- [Add a Processing Engine plugin](#add-a-processing-engine-plugin)
- [Set up a trigger](#set-up-a-trigger)
- [Manage plugin dependencies](#manage-plugin-dependencies)
{{% show-in "enterprise" %}}
- [Distributed cluster considerations](#distributed-cluster-considerations)
{{% /show-in %}}

## Set up the Processing Engine

To activate the Processing Engine, start your {{% product-name %}} server with the `--plugin-dir` flag. This flag tells InfluxDB where to load your plugin files.

> [!Important]
> **Keep influxdb3 and python/ together.**
>
> The influxdb3 binary requires the adjacent `python/` directory to function. 
> If you manually extract from tar.gz, keep them in the same parent directory:
>
> {{< filesystem-diagram >}}
>   - your-install-location/
>   - influxdb3
>   - python/
> {{< /filesystem-diagram >}}
>
> Add the parent directory that contains both influxdb3 and python/ to your PATH; do not move the binary out of this directory.

{{% code-placeholders "NODE_ID|OBJECT_STORE_TYPE|PLUGIN_DIR" %}}

```bash
influxdb3 serve \
  --NODE_ID \
  --object-store OBJECT_STORE_TYPE \
  --plugin-dir PLUGIN_DIR
```

{{% /code-placeholders %}}

In the example above, replace the following:

- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}: Unique identifier for your instance
- {{% code-placeholder-key %}}`OBJECT_STORE_TYPE`{{% /code-placeholder-key %}}: Type of object store (for example, file or s3)
- {{% code-placeholder-key %}}`PLUGIN_DIR`{{% /code-placeholder-key %}}: Absolute path to the directory where plugin files are stored. Store all plugin files in this directory or its subdirectories.

> [!Note]
> #### Use custom plugin repositories
>
> By default, plugins referenced with the `gh:` prefix are fetched from the official
> [influxdata/influxdb3_plugins](https://github.com/influxdata/influxdb3_plugins) repository.
> To use a custom repository, add the `--plugin-repo` flag when starting the server.
> See [Use a custom plugin repository](#option-3-use-a-custom-plugin-repository) for details.

### Configure distributed environments

When running {{% product-name %}} in a distributed setup, follow these steps to configure the Processing Engine:

1. Decide where each plugin should run
   - Data processing plugins, such as WAL plugins, run on ingester nodes
   - HTTP-triggered plugins run on nodes handling API requests
   - Scheduled plugins can run on any configured node
2. Enable plugins on the correct instance
3. Maintain identical plugin files across all instances where plugins run
   - Use shared storage or file synchronization tools to keep plugins consistent

> [!Note]
> #### Provide plugins to nodes that run them
>
> Configure your plugin directory on the same system as the nodes that run the triggers and plugins.

{{% show-in "enterprise" %}}
For more information about configuring distributed environments, see the [Distributed cluster considerations](#distributed-cluster-considerations) section.
{{% /show-in %}}

## Add a Processing Engine plugin

A plugin is a Python script that defines a specific function signature for a trigger (_trigger spec_). When the specified event occurs, InfluxDB runs the plugin.

### Choose a plugin strategy

You have two main options for adding plugins to your InfluxDB instance:

- [Use example plugins](#use-example-plugins) - Get started with prebuilt plugins
- [Create a custom plugin](#create-a-custom-plugin) - Build your own for specialized use cases

### Use example plugins

InfluxData maintains a repository of official and community plugins that you can use immediately in your Processing Engine setup.

Browse the [plugin library](/influxdb3/version/plugins/library/) to find examples and InfluxData official plugins for:

  - **Data transformation**: Process and transform incoming data
  - **Alerting**: Send notifications based on data thresholds
  - **Aggregation**: Calculate statistics on time series data
  - **Integration**: Connect to external services and APIs
  - **System monitoring**: Track resource usage and health metrics

For community contributions, see the [influxdb3_plugins repository](https://github.com/influxdata/influxdb3_plugins) on GitHub.

#### Add example plugins

You have two options for using plugins from the repository:

##### Option 1: Copy plugins locally

Clone the `influxdata/influxdb3_plugins` repository and copy plugins to your configured plugin directory:

```bash
# Clone the repository
git clone https://github.com/influxdata/influxdb3_plugins.git
   
# Copy a plugin to your configured plugin directory
cp influxdb3_plugins/examples/schedule/system_metrics/system_metrics.py /path/to/plugins/
```

##### Option 2: Reference plugins directly from GitHub

Skip downloading plugins by referencing them directly from GitHub using the `gh:` prefix:

```bash
# Create a trigger using a plugin from GitHub
influxdb3 create trigger \
  --trigger-spec "every:1m" \
  --plugin-filename "gh:examples/schedule/system_metrics/system_metrics.py" \
  --database my_database \
  system_metrics
```

This approach:

- Ensures you're using the latest version
- Simplifies updates and maintenance
- Reduces local storage requirements

##### Option 3: Use a custom plugin repository

For organizations that maintain their own plugin repositories or need to use private/internal plugins,
configure a custom plugin repository URL:

```bash
# Start the server with a custom plugin repository
influxdb3 serve \
  --node-id node0 \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --plugin-dir ~/.plugins \
  --plugin-repo "https://internal.company.com/influxdb-plugins/"
```

Then reference plugins from your custom repository using the `gh:` prefix:

```bash
# Fetches from: https://internal.company.com/influxdb-plugins/myorg/custom_plugin.py
influxdb3 create trigger \
  --trigger-spec "every:5m" \
  --plugin-filename "gh:myorg/custom_plugin.py" \
  --database my_database \
  custom_trigger
```

**Use cases for custom repositories:**

- **Private plugins**: Host proprietary plugins not suitable for public repositories
- **Air-gapped environments**: Use internal mirrors when external internet access is restricted
- **Development and staging**: Test plugins from development branches before production deployment
- **Compliance requirements**: Meet data governance policies requiring internal hosting

The `--plugin-repo` option accepts any HTTP/HTTPS URL that serves raw plugin files.
See the [plugin-repo configuration option](/influxdb3/version/reference/config-options/#plugin-repo) for more details.

Plugins have various functions such as: 

- Receive plugin-specific arguments (such as written data, call time, or an HTTP request)
- Access keyword arguments (as `args`) passed from _trigger arguments_ configurations
- Access the `influxdb3_local` shared API to write data, query data, and managing state between executions

For more information about available functions, arguments, and how plugins interact with InfluxDB, see how to [Extend plugins](/influxdb3/version/extend-plugin/). 

### Create a custom plugin

To build custom functionality, you can create your own Processing Engine plugin. 

#### Prerequisites

Before you begin, make sure:

- The Processing Engine is enabled on your {{% product-name %}} instance.
- You’ve configured the `--plugin-dir` where plugin files are stored.
- You have access to that plugin directory.

#### Steps to create a plugin:

- [Choose your plugin type](#choose-your-plugin-type)
- [Create your plugin file](#create-your-plugin-file)
- [Next Steps](#next-steps)

#### Choose your plugin type

Choose a plugin type based on your automation goals:

| Plugin Type      | Best For                                    |
| ---------------- | ------------------------------------------- |
| **Data write**   | Processing data as it arrives               |
| **Scheduled**    | Running code at specific intervals or times |
| **HTTP request** | Running code on demand via API endpoints    |

#### Create your plugin file

- Create a `.py` file in your plugins directory
- Add the appropriate function signature based on your chosen plugin type
- Write your processing logic inside the function

After writing your plugin, [create a trigger](#use-the-create-trigger-command) to connect it to a database event and define when it runs.

#### Create a data write plugin

Use a data write plugin to process data as it's written to the database. These plugins use [`table:` or `all_tables:`](#trigger-on-data-writes) trigger specifications. Ideal use cases include:

- Data transformation and enrichment
- Alerting on incoming values
- Creating derived metrics

```python
def process_writes(influxdb3_local, table_batches, args=None):
    # Process data as it's written to the database
    for table_batch in table_batches:
        table_name = table_batch["table_name"]
        rows = table_batch["rows"]
        
        # Log information about the write
        influxdb3_local.info(f"Processing {len(rows)} rows from {table_name}")
        
        # Write derived data back to the database
        line = LineBuilder("processed_data")
        line.tag("source_table", table_name)
        line.int64_field("row_count", len(rows))
        influxdb3_local.write(line)
```

#### Create a scheduled plugin

Scheduled plugins run at defined intervals using [`every:` or `cron:`](#trigger-on-a-schedule) trigger specifications. Use them for:

- Periodic data aggregation
- Report generation
- System health checks

```python
def process_scheduled_call(influxdb3_local, call_time, args=None):
    # Run code on a schedule
    
    # Query recent data
    results = influxdb3_local.query("SELECT * FROM metrics WHERE time > now() - INTERVAL '1 hour'")
    
    # Process the results
    if results:
        influxdb3_local.info(f"Found {len(results)} recent metrics")
    else:
        influxdb3_local.warn("No recent metrics found")
```

#### Create an HTTP request plugin

HTTP request plugins respond to API calls using [`request:`](#trigger-on-http-requests) trigger specifications. Use them for:

- Creating custom API endpoints
- Webhooks for external integrations
- User interfaces for data interaction

```python
def process_request(influxdb3_local, query_parameters, request_headers, request_body, args=None):
    # Handle HTTP requests to a custom endpoint
    
    # Log the request parameters
    influxdb3_local.info(f"Received request with parameters: {query_parameters}")
    
    # Process the request body
    if request_body:
        import json
        data = json.loads(request_body)
        influxdb3_local.info(f"Request data: {data}")
    
    # Return a response (automatically converted to JSON)
    return {"status": "success", "message": "Request processed"}
```

#### Next steps

After writing your plugin:

- [Create a trigger](#use-the-create-trigger-command) to connect your plugin to database events
- [Install any Python dependencies](#manage-plugin-dependencies) your plugin requires
- Learn how to [extend plugins with the API](/influxdb3/version/extend-plugin/)

## Set up a trigger

### Understand trigger types

| Plugin Type | Trigger Specification | When Plugin Runs |
|------------|----------------------|-----------------|
| Data write | `table:<TABLE_NAME>` or `all_tables` | When data is written to tables |
| Scheduled | `every:<DURATION>` or `cron:<EXPRESSION>` | At specified time intervals |
| HTTP request | `request:<REQUEST_PATH>` | When HTTP requests are received |

### Use the create trigger command

Use the `influxdb3 create trigger` command with the appropriate trigger specification:

{{% code-placeholders "SPECIFICATION|PLUGIN_FILE|DATABASE_NAME|TRIGGER_NAME" %}}

```bash
influxdb3 create trigger \
  --trigger-spec SPECIFICATION \
  --plugin-filename PLUGIN_FILE \
  --database DATABASE_NAME \
  TRIGGER_NAME
 ``` 

{{% /code-placeholders %}}

In the example above, replace the following:

- {{% code-placeholder-key %}}`SPECIFICATION`{{% /code-placeholder-key %}}: Trigger specification
- {{% code-placeholder-key %}}`PLUGIN_FILE`{{% /code-placeholder-key %}}: Plugin filename relative to your configured plugin directory
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Name of the database
- {{% code-placeholder-key %}}`TRIGGER_NAME`{{% /code-placeholder-key %}}: Name of the new trigger

> [!Note]
> When specifying a local plugin file, the `--plugin-filename` parameter
> _is relative to_ the `--plugin-dir` configured for the server.
> You don't need to provide an absolute path.

### Trigger specification examples

#### Trigger on data writes 

```bash
# Trigger on writes to a specific table
# The plugin file must be in your configured plugin directory
influxdb3 create trigger \
  --trigger-spec "table:sensor_data" \
  --plugin-filename "process_sensors.py" \
  --database my_database \
  sensor_processor

# Trigger on writes to all tables
influxdb3 create trigger \
  --trigger-spec "all_tables" \
  --plugin-filename "process_all_data.py" \
  --database my_database \
  all_data_processor
```

The trigger runs when the database flushes ingested data for the specified tables to the Write-Ahead Log (WAL) in the Object store (default is every second).

The plugin receives the written data and table information.

#### Trigger on data writes with table exclusion

If you want to use a single trigger for all tables but exclude specific tables,
you can use trigger arguments and your plugin code to filter out unwanted tables--for example:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 create trigger \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --plugin-filename processor.py \
  --trigger-spec "all_tables" \
  --trigger-arguments "exclude_tables=temp_data,debug_info,system_logs" \
  data_processor
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}DATABASE_NAME{{% /code-placeholder-key %}}: the name of the database
- {{% code-placeholder-key %}}AUTH_TOKEN{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in
"enterprise" %}} with write permissions on the specified database{{% /show-in %}}

Then, in your plugin:

```python
# processor.py
def on_write(self, database, table_name, batch):
    # Get excluded tables from trigger arguments
    excluded_tables = set(self.args.get('exclude_tables', '').split(','))

    if table_name in excluded_tables:
        return

    # Process allowed tables
    self.process_data(database, table_name, batch)
```

##### Recommendations

- **Early return**: Check exclusions as early as possible in your plugin.
- **Efficient lookups**: Use sets for O(1) lookup performance with large exclusion lists.
- **Performance**: Log skipped tables for debugging but avoid excessive logging in production.
- **Multiple triggers**: For few tables, consider creating separate table-specific
  triggers instead of filtering within plugin code.
  See HTTP API [Processing engine endpoints](/influxdb3/version/api/v3/#tag/Processing-engine) for managing triggers.

#### Trigger on a schedule 

```bash
# Run every 5 minutes
influxdb3 create trigger \
  --trigger-spec "every:5m" \
  --plugin-filename "periodic_check.py" \
  --database my_database \
  regular_check

# Run on a cron schedule (8am daily)
# Supports extended cron format with seconds
influxdb3 create trigger \
  --trigger-spec "cron:0 0 8 * * *" \
  --plugin-filename "daily_report.py" \
  --database my_database \
  daily_report
```

The plugin receives the scheduled call time.

#### Trigger on HTTP requests

```bash
# Create an endpoint at /api/v3/engine/webhook
influxdb3 create trigger \
  --trigger-spec "request:webhook" \
  --plugin-filename "webhook_handler.py" \
  --database my_database \
  webhook_processor
```

Access your endpoint at `/api/v3/engine/{REQUEST_PATH}` (in this example, `/api/v3/engine/webhook`).
The trigger is enabled by default and runs when an HTTP request is received at the specified path.

To run the plugin, send a `GET` or `POST` request to the endpoint--for example:

```bash
curl http://{{% influxdb/host %}}/api/v3/engine/webhook
```

The plugin receives the HTTP request object with methods, headers, and body.

To view triggers associated with a database, use the `influxdb3 show summary` command:

```bash
influxdb3 show summary --database my_database --token AUTH_TOKEN
```

### Pass arguments to plugins

Use trigger arguments to pass configuration from a trigger to the plugin it runs. You can use this for:

- Threshold values for monitoring
- Connection properties for external services
- Configuration settings for plugin behavior

```bash
influxdb3 create trigger \
  --trigger-spec "every:1h" \
  --plugin-filename "threshold_check.py" \
  --trigger-arguments threshold=90,notify_email=admin@example.com \
  --database my_database \
  threshold_monitor
```

The arguments are passed to the plugin as a `Dict[str, str]` where the key is the argument name and the value is the argument value:

```python
def process_scheduled_call(influxdb3_local, call_time, args=None):
    if args and "threshold" in args:
        threshold = float(args["threshold"])
        email = args.get("notify_email", "default@example.com")
        
        # Use the arguments in your logic
        influxdb3_local.info(f"Checking threshold {threshold}, will notify {email}")
```

### Control trigger execution

By default, triggers run synchronously—each instance waits for previous instances to complete before executing.

To allow multiple instances of the same trigger to run simultaneously, configure triggers to run asynchronously:

```bash
# Allow multiple trigger instances to run simultaneously
influxdb3 create trigger \
  --trigger-spec "table:metrics" \
  --plugin-filename "heavy_process.py" \
  --run-asynchronous \
  --database my_database \
  async_processor
```

### Configure error handling for a trigger

To configure error handling behavior for a trigger, use the `--error-behavior <ERROR_BEHAVIOR>` CLI option with one of the following values:

- `log` (default): Log all plugin errors to stdout and the `system.processing_engine_logs` system table.
- `retry`: Attempt to run the plugin again immediately after an error.
- `disable`: Automatically disable the plugin when an error occurs (can be re-enabled later via CLI).

```bash
# Automatically retry on error
influxdb3 create trigger \
  --trigger-spec "table:important_data" \
  --plugin-filename "critical_process.py" \
  --error-behavior retry \
  --database my_database \
  critical_processor

# Disable the trigger on error
influxdb3 create trigger \
  --trigger-spec "request:webhook" \
  --plugin-filename "webhook_handler.py" \
  --error-behavior disable \
  --database my_database \
  auto_disable_processor
```

## Manage plugin dependencies



Use the `influxdb3 install package` command to add third-party libraries (like `pandas`, `requests`, or `influxdb3-python`) to your plugin environment.  
This installs packages into the Processing Engine’s embedded Python environment to ensure compatibility with your InfluxDB instance.

{{% code-placeholders "CONTAINER_NAME|PACKAGE_NAME" %}}

{{< code-tabs-wrapper >}}

{{% code-tabs %}}
[CLI](#)
[Docker](#)
{{% /code-tabs %}}

{{% code-tab-content %}}

```bash
# Use the CLI to install a Python package
influxdb3 install package pandas

```

{{% /code-tab-content %}}

{{% code-tab-content %}}

```bash
# Use the CLI to install a Python package in a Docker container
docker exec -it CONTAINER_NAME influxdb3 install package pandas
```

{{% /code-tab-content %}}

{{< /code-tabs-wrapper >}}

These examples install the specified Python package (for example, pandas) into the Processing Engine’s embedded virtual environment.

- Use the CLI command when running InfluxDB directly on your system.
- Use the Docker variant if you're running InfluxDB in a containerized environment.

> [!Important]
> #### Use bundled Python for plugins
> When you start the server with the `--plugin-dir` option, InfluxDB 3 creates a Python virtual environment (`<PLUGIN_DIR>/venv`) for your plugins.
> If you need to create a custom virtual environment, use the Python interpreter bundled with InfluxDB 3. Don't use the system Python.
> Creating a virtual environment with the system Python (for example, using `python -m venv`) can lead to runtime errors and plugin failures.
> 
>For more information, see the [processing engine README](https://github.com/influxdata/influxdb/blob/main/README_processing_engine.md).

{{% /code-placeholders %}}

InfluxDB creates a Python virtual environment in your plugins directory with the specified packages installed.

{{% show-in "enterprise" %}}

## Distributed cluster considerations

When you deploy {{% product-name %}} in a multi-node environment, configure each node based on its role and the plugins it runs.

### Match plugin types to the correct node

Each plugin must run on a node that supports its trigger type:

| Plugin type        | Trigger spec             | Runs on                     |
|--------------------|--------------------------|-----------------------------|
| Data write         | `table:` or `all_tables` | Ingester nodes              |
| Scheduled          | `every:` or `cron:`      | Any node with scheduler     |
| HTTP request       | `request:`               | Nodes that serve API traffic|

For example:
- Run write-ahead log (WAL) plugins on ingester nodes.
- Run scheduled plugins on any node configured to execute them.
- Run HTTP-triggered plugins on querier nodes or any node that handles HTTP endpoints.

Place all plugin files in the `--plugin-dir` directory configured for each node.

> [!Note]
> Triggers fail if the plugin file isn’t available on the node where it runs.

### Route third-party clients to querier nodes

External tools—such as Grafana, custom dashboards, or REST clients—must connect to querier nodes in your InfluxDB Enterprise deployment.

#### Examples

- **Grafana**: When adding InfluxDB 3 as a Grafana data source, use a querier node URL, such as:
`https://querier.example.com:8086`
- **REST clients**: Applications using `POST /api/v3/query/sql` or similar endpoints must target a querier node.

{{% /show-in %}}
