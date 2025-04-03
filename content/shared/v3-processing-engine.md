# Processing engine

The Processing engine is an embedded Python virtual machine that runs inside your InfluxDB database. It lets you execute Python code in response to database events without external application servers or middleware.

## How it works

### Architecture

The Processing engine runs Python code directly within the InfluxDB process:

- **Embedded execution**: Code runs in the same process space as your database
- **Direct data access**: Zero-copy access to data where possible
- **Event-driven**: Responds to database writes, scheduled events, and HTTP requests
- **Isolated contexts**: Maintains separation between different plugin executions

### Event processing flow

1. A **trigger** activates when a specific event occurs
2. The engine loads the associated **plugin** (Python code)
3. The plugin receives relevant **context and data**
4. Your code processes the data and can write results back
5. Execution completes and the engine returns to waiting state

## Key components

### Trigger system

Triggers connect database events to your Python code:

- **Data write triggers**: Execute when data is written to specific tables
- **Scheduled triggers**: Run at intervals or according to cron expressions
- **HTTP triggers**: Respond to HTTP requests to custom endpoints
