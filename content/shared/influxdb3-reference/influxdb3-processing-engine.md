The Processing engine is an embedded Python virtual machine that runs inside an {{% product-name %}} database server. It executes Python code in response to triggers and database events without requiring external application servers or middleware.

## Enable and disable the Processing Engine

The Processing Engine activates when [`--plugin-dir`](/influxdb3/version/reference/cli/influxdb3/serve/#plugin-dir) or `INFLUXDB3_PLUGIN_DIR` is configured.
When not configured, the Python environment and PyO3 bindings aren't initialized, and the server runs without Processing Engine functionality.

{{% show-in "enterprise" %}}
### Process mode and `--plugin-dir`

Setting `--plugin-dir` automatically adds `process` mode to any node, regardless of the [`--mode`](/influxdb3/enterprise/reference/config-options/#mode) setting.
You don't need to explicitly set `--mode=process` when `--plugin-dir` is configured.

Conversely, if you explicitly set `--mode=process`, you **must** also set `--plugin-dir`.
A node with `--mode=process` but no `--plugin-dir` won't function correctly.

For cluster node configuration examples, see [Configure process nodes](/influxdb3/enterprise/admin/clustering/#configure-process-nodes).
{{% /show-in %}}

### Default behavior by deployment type

| Deployment | Default state | Configuration |
|:-----------|:--------------|:--------------|
| Docker images | **Enabled** | `INFLUXDB3_PLUGIN_DIR=/plugins` |
| DEB/RPM packages | **Enabled** | `plugin-dir="/var/lib/influxdb3/plugins"` |
| Binary/source | Disabled | No `plugin-dir` configured |

### Disable in Docker deployments

Docker images set `INFLUXDB3_PLUGIN_DIR=/plugins` by default.

> [!Warning]
> Setting `INFLUXDB3_PLUGIN_DIR=""` (empty string) does **not** disable the Processing Engine.
> You must unset the variable, not set it to empty.

{{% show-in "enterprise" %}}
Use the `INFLUXDB3_UNSET_VARS` feature to unset inherited environment variables:

```bash
docker run -e INFLUXDB3_UNSET_VARS="INFLUXDB3_PLUGIN_DIR" influxdb:3-enterprise
```

This is useful in orchestration environments (Kubernetes, Docker Compose) where removing an inherited variable isn't straightforward.
{{% /show-in %}}

{{% show-in "core" %}}
Use a custom entrypoint that unsets the variable:

```bash
docker run --entrypoint /bin/sh influxdb:3-core -c 'unset INFLUXDB3_PLUGIN_DIR && exec influxdb3 serve --object-store memory'
```
{{% /show-in %}}

### Disable in systemd deployments (DEB/RPM)

The post-install script sets `plugin-dir="/var/lib/influxdb3/plugins"` in the TOML configuration.
To disable the Processing Engine:

1. Edit the configuration file:

   ```bash
   sudo nano /etc/influxdb3/influxdb3-{{< product-key >}}.conf
   ```

2. Comment out or remove the `plugin-dir` line:

   ```toml
   # plugin-dir="/var/lib/influxdb3/plugins"
   ```

   > [!Warning]
   > Do not set `plugin-dir=""` (empty string)—you must remove or comment out the line.

3. Restart the service:

   ```bash
   sudo systemctl restart influxdb3-{{< product-key >}}
   ```

> [!Note]
> The `/var/lib/influxdb3/plugins` directory can remain on disk.
> The Processing Engine only activates based on the `plugin-dir` configuration, not directory existence.

### Benefits of disabling

When the Processing Engine is disabled:

- The Python environment and PyO3 bindings are not initialized
- Plugin-related operations return a "No plugin directory configured" error
- The server runs with reduced resource usage

This is useful for deployments that don't require plugin functionality and want a minimal server footprint.

## How it works

### Architecture

The Processing engine runs Python code directly within a {{% product-name %}} server process. This design provides high performance and direct access to database resources.

- **Embedded execution**: Code runs in the same process space as the database server
- **Direct data access**: Zero-copy access to data
- **Event-driven**: Responds to database writes, scheduled events, and HTTP requests
- **Cache integration**: Access to system caches including Last values  and Distinct 
values 

> [!Note]
> The Processing engine runs all plugins in the same Python process. Changes made by one plugin can affect other plugins.

### Event processing flow

When specific events occur in the database, the Processing engine handles them through a consistent sequence:

1. A **trigger** specific to the event type activates its plugin. The event types include:
   - Data writes to specific tables or all tables
   - Scheduled events (time-based or cron expressions)
   - HTTP requests to configured endpoints
2. The engine loads the associated **plugin** specified in the trigger configuration
3. The plugin receives context data specific to the trigger type:
   - Write triggers: the written data and table information
   - Schedule triggers: the scheduled call time
   - HTTP triggers: the request object with methods, headers, and body
4. The plugin processes the received data, can query the database, call external tools, and write and cache data in the database
5. Execution completes and the engine returns to waiting state

## Key components

### Trigger system

Triggers connect database events to Python code execution based on specific conditions:

- **Data write triggers**: Execute on WAL flush events, when data is written to the object store, for a specific table or all tables in a database 
- **Scheduled triggers**: Run at intervals or according to cron expressions
- **HTTP triggers**: Respond to HTTP requests to custom endpoints

### Plugin registry

The registry manages all Python code available to the Processing engine:

- Indexes plugins by filename and location
- Tracks which plugins are used by which triggers
- Manages plugin versioning and dependencies

### Memory management

The Processing engine implements specialized memory handling to ensure stability and performance:

- **Execution isolation**: Each plugin runs in its own context
- **Cache system**: Maintains state between executions
- **Resource limits**: Controls memory usage and execution time

## Performance characteristics

The Processing engine is designed for high-performance operation with minimal overhead:

- **Low latency**: Activates triggers in sub-millisecond time
- **Efficient access**: Accesses database directly without network overhead
- **Controlled resources**: Limits memory and CPU usage through configuration
- **Execution policies**: Offers synchronous or asynchronous processing options

## Reliability features

The Processing engine includes multiple features to ensure consistent and dependable execution:

- **Error handling**: Configures behaviors for failure scenarios (log, retry, or disable)
- **Execution tracking**: Tracks plugin performance and resource usage
- **State persistence**: Persists cache state across server restarts

## Extension capabilities

Extend and customize the Processing engine through several built-in mechanisms:

- **Package management**: Installs custom Python dependencies
- **Plugin distribution**: Distributes plugins via Git repositories
- **Shared API**: Provides consistent interface for database operations

For a step-by-step guide to setting up and using the Processing engine, see the [Getting started with plugins](/influxdb3/version/plugins/) documentation.