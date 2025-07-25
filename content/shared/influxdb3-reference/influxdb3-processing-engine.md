The Processing engine is an embedded Python virtual machine that runs inside an {{% product-name %}} database server. It executes Python code in response to triggers and database events without requiring external application servers or middleware.

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