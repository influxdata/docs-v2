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
  - [Upload plugins from local machine](#upload-plugins-from-local-machine)
  - [Update existing plugins](#update-existing-plugins)
  - [View loaded plugins](#view-loaded-plugins)
- [Set up a trigger](#set-up-a-trigger)
- [Manage plugin dependencies](#manage-plugin-dependencies)
- [Plugin security](#plugin-security)
{{% show-in "enterprise" %}}
- [Distributed cluster considerations](#distributed-cluster-considerations)
{{% /show-in %}}

## Set up the Processing Engine

To activate the Processing Engine, start your {{% product-name %}} server with the `--plugin-dir` flag. This flag tells InfluxDB where to load your plugin files.

> [!Important]
> #### Keep the influxdb3 binary with its python directory
>
> The influxdb3 binary requires the adjacent `python/` directory to function. 
> If you manually extract from tar.gz, keep them in the same parent directory:
> ```
> your-install-location/
> ├── influxdb3
> └── python/
> ```
>
> Add the parent directory to your PATH; do not move the binary out of this directory.

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

A plugin is a Python script that defines a function with a trigger-compatible (_trigger spec_) signature.
When the specified event occurs, InfluxDB runs the plugin.

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
cp influxdb3_plugins/influxdata/system_metrics/system_metrics.py /path/to/plugins/
```

##### Option 2: Reference plugins directly from GitHub

Skip downloading plugins by referencing them directly from GitHub using the `gh:` prefix:

```bash
# Create a trigger using a plugin from GitHub
influxdb3 create trigger \
  --trigger-spec "every:1m" \
  --path "gh:influxdata/system_metrics/system_metrics.py" \
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
  --path "gh:myorg/custom_plugin.py" \
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

Plugins now support both single-file and multifile architectures:

**Single-file plugins:**
- Create a `.py` file in your plugins directory
- Add the appropriate function signature based on your chosen plugin type
- Write your processing logic inside the function

**Multifile plugins:**
- Create a directory in your plugins directory
- Add an `__init__.py` file as the entry point (required)
- Organize supporting modules in additional `.py` files
- Import and use modules within your plugin code

##### Example multifile plugin structure

```
my_plugin/
├── __init__.py       # Required - entry point with trigger function
├── utils.py          # Supporting module
├── processors.py     # Data processing functions
└── config.py         # Configuration helpers
```

The `__init__.py` file must contain your trigger function:

```python
# my_plugin/__init__.py
from .processors import process_data
from .config import get_settings

def process_writes(influxdb3_local, table_batches, args=None):
    settings = get_settings()
    for table_batch in table_batches:
        process_data(influxdb3_local, table_batch, settings)
```

Supporting modules can contain helper functions:

```python
# my_plugin/processors.py
def process_data(influxdb3_local, table_batch, settings):
    # Processing logic here
    pass
```

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

### Upload plugins from local machine

For local development and testing, you can upload plugin files directly from your machine when creating triggers. This eliminates the need to manually copy files to the server's plugin directory.

- [Upload a plugin using the influxdb3 CLI](#upload-a-plugin-using-the-influxdb3-cli)
- [Upload a plugin using the HTTP API](#upload-a-plugin-using-the-http-api)

#### Upload a plugin using the influxdb3 CLI

Use the `--upload` flag with `--path` to transfer local files or directories:

```bash
# Upload single-file plugin
influxdb3 create trigger \
  --trigger-spec "every:10s" \
  --path "/local/path/to/plugin.py" \
  --upload \
  --database metrics \
  my_trigger

# Upload multifile plugin directory
influxdb3 create trigger \
  --trigger-spec "every:30s" \
  --path "/local/path/to/plugin-dir" \
  --upload \
  --database metrics \
  complex_trigger
```

For more information, see the [`influxdb3 create trigger` CLI reference](/influxdb3/version/reference/cli/influxdb3/create/trigger/).

#### Upload a plugin using the HTTP API

To upload a plugin file using the HTTP API, send a `PUT` request to the `/api/v3/plugins/files` endpoint:

{{% api-endpoint method="PUT" endpoint="{{< influxdb/host >}}/api/v3/plugins/files" %}}

Include the following in your request:

- **Headers**:
  - `Authorization: Bearer` with your admin token
  - `Content-Type: application/octet-stream`
- **Query parameters**:
  - `path` _(string, required)_: Path to the plugin file relative to the plugin directory

```bash{placeholders="AUTH_TOKEN"}
# Upload a single-file plugin
curl -X PUT "{{< influxdb/host >}}/api/v3/plugins/files?path=plugin.py" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/octet-stream" \
  --data-binary "@/local/path/to/plugin.py"
```

Replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

For complete reference, see [Update plugin file](/influxdb3/version/api/v3/#operation/PutPluginFile).

> [!Important]
> #### Admin privileges required
>
> Plugin uploads require an admin token. This security measure prevents unauthorized code execution on the server.

**When to use plugin upload:**
- Local plugin development and testing
- Deploying plugins without SSH access to the server
- Rapid iteration on plugin code
- Automating plugin deployment in CI/CD pipelines

### Update existing plugins

Modify plugin code for running triggers without recreating them. This allows you to iterate on plugin development while preserving trigger configuration and history.

- [Update a plugin using the influxdb3 CLI](#update-a-plugin-using-the-influxdb3-cli)
- [Update a plugin using the HTTP API](#update-a-plugin-using-the-http-api)

#### Update a plugin using the influxdb3 CLI

Use the `influxdb3 update trigger` command:

```bash
# Update single-file plugin
influxdb3 update trigger \
  --database metrics \
  --trigger-name my_trigger \
  --path "/path/to/updated/plugin.py"

# Update multifile plugin
influxdb3 update trigger \
  --database metrics \
  --trigger-name complex_trigger \
  --path "/path/to/updated/plugin-dir"
```

For complete reference, see [`influxdb3 update trigger`](/influxdb3/version/reference/cli/influxdb3/update/trigger/).

#### Update a plugin using the HTTP API

To update a plugin file using the HTTP API, send a `PUT` request to the `/api/v3/plugins/files` endpoint:

{{% api-endpoint method="PUT" endpoint="{{< influxdb/host >}}/api/v3/plugins/files" api-ref="/influxdb3/version/api/v3/#operation/PutPluginFile" %}}

Include the following in your request:

- **Headers**:
  - `Authorization: Bearer` with your admin token
  - `Content-Type: application/octet-stream`
- **Query parameters**:
  - `path` _(string, required)_: Path to the plugin file relative to the plugin directory

```bash{placeholders="AUTH_TOKEN"}
# Update a plugin file
curl -X PUT "{{< influxdb/host >}}/api/v3/plugins/files?path=plugin.py" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/octet-stream" \
  --data-binary "@/path/to/updated/plugin.py"
```

Replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

**The update operation:**
- Replaces plugin files immediately
- Preserves trigger configuration (spec, schedule, arguments)
- Requires admin token for security
- Works with both local paths and uploaded files

### View loaded plugins

Monitor which plugins are loaded in your system for operational visibility and troubleshooting.

**Option 1: Use the CLI command**

```bash
# List all plugins
influxdb3 show plugins --token $ADMIN_TOKEN

# JSON format for programmatic access
influxdb3 show plugins --format json --token $ADMIN_TOKEN
```

**Option 2: Query the system table**

The `system.plugin_files` table in the `_internal` database provides detailed plugin file information:

```bash
influxdb3 query \
  -d _internal \
  "SELECT * FROM system.plugin_files ORDER BY plugin_name" \
  --token $ADMIN_TOKEN
```

**Available columns:**
- `plugin_name` (String): Trigger name
- `file_name` (String): Plugin file name
- `file_path` (String): Full server path
- `size_bytes` (Int64): File size
- `last_modified` (Int64): Modification timestamp (milliseconds)

**Example queries:**

```sql
-- Find plugins by name
SELECT * FROM system.plugin_files WHERE plugin_name = 'my_trigger';

-- Find large plugins
SELECT plugin_name, size_bytes
FROM system.plugin_files
WHERE size_bytes > 10000;

-- Check modification times
SELECT plugin_name, file_name, last_modified
FROM system.plugin_files
ORDER BY last_modified DESC;
```

For more information, see the [`influxdb3 show plugins` reference](/influxdb3/version/reference/cli/influxdb3/show/plugins/) and [Query system data](/influxdb3/version/admin/query-system-data/#query-plugin-files).

## Set up a trigger

A trigger connects your plugin code to database events. When the specified event occurs, the processing engine executes your plugin.

- [Understand trigger types](#understand-trigger-types)
- [Create a trigger using the influxdb3 CLI](#create-a-trigger-using-the-influxdb3-cli)
- [Create a trigger using the HTTP API](#create-a-trigger-using-the-http-api)
- [Trigger specification examples](#trigger-specification-examples)

### Understand trigger types

| Plugin Type | Trigger Specification | When Plugin Runs |
|------------|----------------------|-----------------|
| Data write | `table:<TABLE_NAME>` or `all_tables` | When data is written to tables |
| Scheduled | `every:<DURATION>` or `cron:<EXPRESSION>` | At specified time intervals |
| HTTP request | `request:<REQUEST_PATH>` | When HTTP requests are received |

### Create a trigger using the influxdb3 CLI

Use the `influxdb3 create trigger` command with the appropriate trigger specification:

{{% code-placeholders "SPECIFICATION|PLUGIN_FILE|DATABASE_NAME|TRIGGER_NAME" %}}

```bash
influxdb3 create trigger \
  --trigger-spec SPECIFICATION \
  --path PLUGIN_FILE \
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
> #### Plugin paths
> 
> - For **single-file plugins**, provide just the `.py` filename to `--path` (for example, `test_plugin.py`).
> - For **multi-file plugins**, provide the directory name containing `__init__.py`.
> 
> When not using `--upload`, the server resolves paths relative to the configured `--plugin-dir`.
> For details about multi-file plugin structure, see [Create your plugin file](#create-your-plugin-file).

For complete reference, see [`influxdb3 create trigger`](/influxdb3/version/reference/cli/influxdb3/create/trigger/).

### Create a trigger using the HTTP API

To create a trigger using the HTTP API, send a `POST` request to the `/api/v3/configure/processing_engine_trigger` endpoint:

{{% api-endpoint method="POST" endpoint="{{< influxdb/host >}}/api/v3/configure/processing_engine_trigger" api-ref="/influxdb3/version/api/v3/#operation/PostConfigureProcessingEngineTrigger" %}}

Include the following in your request:

- **Headers**:
  - `Authorization: Bearer` with your authentication token
  - `Content-Type: application/json`
- **Request body**: JSON object with trigger configuration
  - `db` _(string, required)_: Database name
  - `trigger_name` _(string, required)_: Trigger name
  - `plugin_filename` _(string, required)_: Plugin filename relative to the plugin directory
  - `trigger_specification` _(string, required)_: When the plugin runs (see [trigger types](#understand-trigger-types))
  - `trigger_settings` _(object, required)_: Configuration for error handling and execution
    - `run_async` _(boolean)_: Whether to run asynchronously (default: `false`)
    - `error_behavior` _(string)_: How to handle errors: `Log`, `Retry`, or `Disable` (default: `Log`)
  - `disabled` _(boolean, required)_: Whether the trigger is disabled
  - `trigger_arguments` _(object, optional)_: Arguments passed to the plugin

{{% code-placeholders "DATABASE_NAME|PLUGIN_FILE|TRIGGER_NAME|TRIGGER_SPEC|AUTH_TOKEN" %}}

```bash
# Create a basic trigger
curl -X POST "{{< influxdb/host >}}/api/v3/configure/processing_engine_trigger" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "trigger_name": "TRIGGER_NAME",
    "plugin_filename": "PLUGIN_FILE",
    "trigger_specification": "TRIGGER_SPEC",
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "Log"
    },
    "disabled": false
  }'
```

{{% /code-placeholders %}}

In the example above, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Name of the database
- {{% code-placeholder-key %}}`TRIGGER_NAME`{{% /code-placeholder-key %}}: Name of the new trigger
- {{% code-placeholder-key %}}`PLUGIN_FILE`{{% /code-placeholder-key %}}: Plugin filename relative to your configured plugin directory
- {{% code-placeholder-key %}}`TRIGGER_SPEC`{{% /code-placeholder-key %}}: Trigger specification (see [examples](#trigger-specification-examples))
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with write permissions on the specified database{{% /show-in %}}


### Trigger specification examples

The following examples demonstrate how to create triggers for different event types using both the CLI and HTTP API.

#### Trigger on data writes 

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3 CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash
# Trigger on writes to a specific table
# The plugin file must be in your configured plugin directory
influxdb3 create trigger \
  --trigger-spec "table:sensor_data" \
  --path "process_sensors.py" \
  --database my_database \
  sensor_processor

# Trigger on writes to all tables
influxdb3 create trigger \
  --trigger-spec "all_tables" \
  --path "process_all_data.py" \
  --database my_database \
  all_data_processor
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

```bash
# Trigger on writes to a specific table
curl -X POST "{{< influxdb/host >}}/api/v3/configure/processing_engine_trigger" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "trigger_name": "sensor_processor",
    "plugin_filename": "process_sensors.py",
    "trigger_specification": "table:sensor_data",
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "Log"
    },
    "disabled": false
  }'

# Trigger on writes to all tables
curl -X POST "{{< influxdb/host >}}/api/v3/configure/processing_engine_trigger" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "trigger_name": "all_data_processor",
    "plugin_filename": "process_all_data.py",
    "trigger_specification": "all_tables",
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "Log"
    },
    "disabled": false
  }'
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with write permissions on the specified database{{% /show-in %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

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
  --path processor.py \
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

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3 CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash
# Run every 5 minutes
influxdb3 create trigger \
  --trigger-spec "every:5m" \
  --path "periodic_check.py" \
  --database my_database \
  regular_check

# Run on a cron schedule (8am daily)
# Supports extended cron format with seconds
influxdb3 create trigger \
  --trigger-spec "cron:0 0 8 * * *" \
  --path "daily_report.py" \
  --database my_database \
  daily_report
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

```bash
# Run every 5 minutes
curl -X POST "{{< influxdb/host >}}/api/v3/configure/processing_engine_trigger" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "trigger_name": "regular_check",
    "plugin_filename": "periodic_check.py",
    "trigger_specification": "every:5m",
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "Log"
    },
    "disabled": false
  }'

# Run on a cron schedule (8am daily)
# Supports extended cron format with seconds
curl -X POST "{{< influxdb/host >}}/api/v3/configure/processing_engine_trigger" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "trigger_name": "daily_report",
    "plugin_filename": "daily_report.py",
    "trigger_specification": "cron:0 0 8 * * *",
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "Log"
    },
    "disabled": false
  }'
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with write permissions on the specified database{{% /show-in %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

The plugin receives the scheduled call time.

#### Trigger on HTTP requests

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3 CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash
# Create an endpoint at /api/v3/engine/webhook
influxdb3 create trigger \
  --trigger-spec "request:webhook" \
  --path "webhook_handler.py" \
  --database my_database \
  webhook_processor
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

```bash
# Create an endpoint at /api/v3/engine/webhook
curl -X POST "{{< influxdb/host >}}/api/v3/configure/processing_engine_trigger" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "trigger_name": "webhook_processor",
    "plugin_filename": "webhook_handler.py",
    "trigger_specification": "request:webhook",
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "Log"
    },
    "disabled": false
  }'
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with write permissions on the specified database{{% /show-in %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

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

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3 CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash
influxdb3 create trigger \
  --trigger-spec "every:1h" \
  --path "threshold_check.py" \
  --trigger-arguments threshold=90,notify_email=admin@example.com \
  --database my_database \
  threshold_monitor
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

```bash
curl -X POST "{{< influxdb/host >}}/api/v3/configure/processing_engine_trigger" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "trigger_name": "threshold_monitor",
    "plugin_filename": "threshold_check.py",
    "trigger_specification": "every:1h",
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "Log"
    },
    "trigger_arguments": {
      "threshold": "90",
      "notify_email": "admin@example.com"
    },
    "disabled": false
  }'
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with write permissions on the specified database{{% /show-in %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

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

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3 CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash
# Allow multiple trigger instances to run simultaneously
influxdb3 create trigger \
  --trigger-spec "table:metrics" \
  --path "heavy_process.py" \
  --run-asynchronous \
  --database my_database \
  async_processor
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

```bash
# Allow multiple trigger instances to run simultaneously
curl -X POST "{{< influxdb/host >}}/api/v3/configure/processing_engine_trigger" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "trigger_name": "async_processor",
    "plugin_filename": "heavy_process.py",
    "trigger_specification": "table:metrics",
    "trigger_settings": {
      "run_async": true,
      "error_behavior": "Log"
    },
    "disabled": false
  }'
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with write permissions on the specified database{{% /show-in %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Configure error handling for a trigger

To configure error handling behavior for a trigger, specify one of the following values:

- `log` (default): Log all plugin errors to stdout and the `system.processing_engine_logs` system table.
- `retry`: Attempt to run the plugin again immediately after an error.
- `disable`: Automatically disable the plugin when an error occurs (can be re-enabled later).

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3 CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash
# Automatically retry on error
influxdb3 create trigger \
  --trigger-spec "table:important_data" \
  --path "critical_process.py" \
  --error-behavior retry \
  --database my_database \
  critical_processor

# Disable the trigger on error
influxdb3 create trigger \
  --trigger-spec "request:webhook" \
  --path "webhook_handler.py" \
  --error-behavior disable \
  --database my_database \
  auto_disable_processor
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

```bash
# Automatically retry on error
curl -X POST "{{< influxdb/host >}}/api/v3/configure/processing_engine_trigger" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "trigger_name": "critical_processor",
    "plugin_filename": "critical_process.py",
    "trigger_specification": "table:important_data",
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "Retry"
    },
    "disabled": false
  }'

# Disable the trigger on error
curl -X POST "{{< influxdb/host >}}/api/v3/configure/processing_engine_trigger" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "trigger_name": "auto_disable_processor",
    "plugin_filename": "webhook_handler.py",
    "trigger_specification": "request:webhook",
    "trigger_settings": {
      "run_async": false,
      "error_behavior": "Disable"
    },
    "disabled": false
  }'
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with write permissions on the specified database{{% /show-in %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Manage plugin dependencies



Use the `influxdb3 install package` command to add third-party libraries (like `pandas`, `requests`, or `influxdb3-python`) to your plugin environment.  
This installs packages into the Processing Engine’s embedded Python environment to ensure compatibility with your InfluxDB instance.

{{% code-placeholders "CONTAINER_NAME|PACKAGE_NAME|AUTH_TOKEN" %}}

{{< code-tabs-wrapper >}}

{{% code-tabs %}}
[influxdb3 CLI](#)
[Docker](#)
[HTTP API](#)
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

{{% code-tab-content %}}

```bash
# Use the HTTP API to install Python packages
curl -X POST "{{< influxdb/host >}}/api/v3/configure/plugin_environment/install_packages" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "packages": ["pandas", "requests", "numpy"]
  }'
```

Replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

For complete reference, see [Install plugin packages](/influxdb3/version/api/v3/#operation/PostInstallPluginPackages).

{{% /code-tab-content %}}

{{< /code-tabs-wrapper >}}

These examples install the specified Python packages (for example, pandas) into the Processing Engine’s embedded virtual environment.

- Use the CLI command when running InfluxDB directly on your system.
- Use the Docker variant if you're running InfluxDB in a containerized environment.
- Use the HTTP API for programmatic package installation or CI/CD workflows.

> [!Important]
> #### Use bundled Python for plugins
> When you start the server with the `--plugin-dir` option, InfluxDB 3 creates a Python virtual environment (`<PLUGIN_DIR>/venv`) for your plugins.
> If you need to create a custom virtual environment, use the Python interpreter bundled with InfluxDB 3. Don't use the system Python.
> Creating a virtual environment with the system Python (for example, using `python -m venv`) can lead to runtime errors and plugin failures.
> 
>For more information, see the [processing engine README](https://github.com/influxdata/influxdb/blob/main/README_processing_engine.md).

{{% /code-placeholders %}}

InfluxDB creates a Python virtual environment in your plugins directory with the specified packages installed.

### Disable package installation for secure environments

For air-gapped deployments or environments with strict security requirements, you can disable Python package installation while maintaining Processing Engine functionality.

Start the server with `--package-manager disabled`:

```bash
influxdb3 serve \
  --node-id node0 \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --plugin-dir ~/.plugins \
  --package-manager disabled
```

When package installation is disabled:
- The Processing Engine continues to function normally for triggers
- Plugin code executes without restrictions
- Package installation commands are blocked
- Pre-installed dependencies in the virtual environment remain available

**Pre-install required dependencies:**

Before disabling the package manager, install all required Python packages:

```bash
# Install packages first
influxdb3 install package pandas requests numpy

# Then start with disabled package manager
influxdb3 serve \
  --plugin-dir ~/.plugins \
  --package-manager disabled
```

**Use cases for disabled package management:**
- Air-gapped environments without internet access
- Compliance requirements prohibiting runtime package installation
- Centrally managed dependency environments
- Security policies requiring pre-approved packages only

For more configuration options, see [--package-manager](/influxdb3/version/reference/config-options/#package-manager).

## Plugin security

The Processing Engine includes security features to protect your {{% product-name %}} instance from unauthorized code execution and file system attacks.

### Plugin path validation

All plugin file paths are validated to prevent directory traversal attacks. The system blocks:

- **Relative paths with parent directory references** (`../`, `../../`)
- **Absolute paths** (`/etc/passwd`, `/usr/bin/script.py`)
- **Symlinks that escape the plugin directory**

When creating or updating triggers, plugin paths must resolve within the configured `--plugin-dir`.

**Example of blocked paths:**

```bash
# These will be rejected
influxdb3 create trigger \
  --path "../../../etc/passwd" \  # Blocked: parent directory traversal
  ...

influxdb3 create trigger \
  --path "/tmp/malicious.py" \    # Blocked: absolute path
  ...
```

**Valid plugin paths:**

```bash
# These are allowed
influxdb3 create trigger \
  --path "myapp/plugin.py" \      # Relative to plugin-dir
  ...

influxdb3 create trigger \
  --path "transforms/data.py" \    # Subdirectory in plugin-dir
  ...
```

### Upload and update permissions

Plugin upload and update operations require admin tokens to prevent unauthorized code deployment:

- `--upload` flag requires admin privileges
- `update trigger` command requires admin token
- Standard resource tokens cannot upload or modify plugin code

This security model ensures only administrators can introduce or modify executable code in your database.

### Best practices

**For development:**
- Use the `--upload` flag to deploy plugins during development
- Test plugins in non-production environments first
- Review plugin code before deployment

**For production:**
- Pre-deploy plugins to the server's plugin directory via secure file transfer
- Use custom plugin repositories for vetted, approved plugins
- Disable package installation (`--package-manager disabled`) in locked-down environments
- Audit plugin files using the [`system.plugin_files` table](#view-loaded-plugins)
- Implement change control processes for plugin updates

For more security configuration options, see [Configuration options](/influxdb3/version/reference/config-options/).

{{% show-in "enterprise" %}}

## Distributed cluster considerations

When you deploy {{% product-name %}} in a multi-node environment, configure each node based on its role and the plugins it runs.

### Match plugin types to the correct node

Each plugin must run on a node that supports its trigger type:

| Plugin type        | Trigger spec             | Runs on                     |
|--------------------|--------------------------|-----------------------------|
| WAL rows           | `table:` or `all_tables` | Ingester nodes              |
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
