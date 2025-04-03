# Processing engine

The Processing engine is an embedded Python virtual machine that runs inside the InfluxDB database. It executes Python code in response to database events without requiring external application servers or middleware.

## How it works

### Architecture

The Processing engine runs Python code directly within the InfluxDB process. This design creates a tightly integrated execution environment with high performance and direct access to database resources.

- **Embedded execution**: Code runs in the same process space as the database
- **Direct data access**: Zero-copy access to data where possible
- **Event-driven**: Responds to database writes, scheduled events, and HTTP requests
- **Isolated contexts**: Maintains separation between different plugin executions

This architecture enables low-latency processing while maintaining strong isolation between different execution contexts.

### Event processing flow

When events occur in the database, the Processing engine follows a consistent flow to handle and process them efficiently and safely.

1. A **trigger** activates when a specific event occurs
2. The engine loads the associated **plugin** (Python code)
3. The plugin receives relevant **context and data**
4. The code processes the data and can write results back
5. Execution completes and the engine returns to waiting state

This structured flow ensures predictable behavior and clean separation between different processing tasks.

## Key components

### Trigger system

Triggers form the activation mechanism for the Processing engine, connecting database events to Python code execution based on specific conditions.

- **Data write triggers**: Execute when data is written to specific tables
- **Scheduled triggers**: Run at intervals or according to cron expressions
- **HTTP triggers**: Respond to HTTP requests to custom endpoints

These trigger types cover the most common scenarios for automated data processing and integration needs.

### Plugin registry

The registry serves as the central management system for all Python code available to the Processing engine. It handles discovery, loading, and execution of plugins.

- Indexes plugins by filename and location
- Tracks which plugins are used by which triggers
- Manages plugin versioning and dependencies

This registry approach simplifies code management and enables advanced features like git-based plugin distribution.

### Memory management

The Processing engine implements specialized memory handling to ensure stability, performance, and resource efficiency across all operations.

- **Execution isolation**: Each plugin runs in its own context
- **Cache system**: Maintains state between executions
- **Resource limits**: Controls memory usage and execution time

These memory management features balance performance with stability, preventing runaway processes from affecting the database.

## Performance characteristics

The Processing engine is designed for high-performance operation with minimal overhead, even under heavy load conditions. Its integration with the database core provides substantial performance advantages.

- **Low latency**: Sub-millisecond trigger activation
- **Efficient access**: Direct database access without network overhead
- **Controlled resources**: Configurable memory and CPU limits
- **Execution policies**: Synchronous or asynchronous processing options

These performance characteristics make the Processing engine suitable for both batch processing and real-time data handling scenarios.

## Reliability features

Reliable operation is essential for automated processing systems. The Processing engine includes multiple features to ensure consistent and dependable execution