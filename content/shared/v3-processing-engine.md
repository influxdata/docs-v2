# Processing engine

The Processing engine is an embedded Python virtual machine that runs inside your InfluxDB database. It lets you execute Python code in response to database events without external application servers or middleware.

## How it works

### Architecture

The Processing engine runs Python code directly within the InfluxDB process:

- **Embedded execution**: Code runs in the same process space as your database
- **Direct data access**: Zero-copy access to data where possible
- **Event-driven**: Responds to database writes, scheduled events, and HTTP requests
- **Isolated contexts**: Maintains separation between different plugin executions