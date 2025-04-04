# Processing engine

The Processing engine is an embedded Python virtual machine that runs inside the InfluxDB database. It executes Python code in response to database events without requiring external application servers or middleware.

## How it works

### Architecture

The Processing engine runs Python code directly within the InfluxDB process. This design provides high performance and direct access to database resources.

- **Embedded execution**: Code runs in the same process space as the database
- **Direct data access**: Zero-copy access to data where possible
- **Event-driven**: Responds to database writes, scheduled events, and HTTP requests
- **Isolated contexts**: Maintains separation between different plugin executions

### Event processing flow

When events occur in the database, the Processing engine handles them through a consistent sequence:

1. A **trigger** activates when a specific event occurs
2. The engine loads the associated **plugin** (Python code)
3. The plugin receives relevant **context and data**
4. The code processes the data and can write results back
5. Execution completes and the engine returns to waiting state

## Key components

### Trigger system

Triggers connect database events to Python code execution based on specific conditions:

- **Data write triggers**: Execute when data is written to specific tables
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

- **Low latency**: Sub-millisecond trigger activation
- **Efficient access**: Direct database access without network overhead
- **Controlled resources**: Configurable memory and CPU limits
- **Execution policies**: Synchronous or asynchronous processing options

## Reliability features

The Processing engine includes multiple features to ensure consistent and dependable execution:

- **Error handling**: Configurable behaviors (log, retry, or disable)
- **Execution tracking**: Monitoring of plugin performance
- **State persistence**: Cache management across server restarts

## Extension capabilities

Extend and customize the Processing engine through several built-in mechanisms:

- **Package management**: Custom Python dependency installation
- **Plugin distribution**: Git-based plugin sharing
- **Shared API**: Consistent interface for database operations