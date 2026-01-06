---
title: Telegraf Controller architecture
description: >
  Architectural overview of the {{% product-name %}} application.
menu:
  telegraf_controller:
    name: Architectural overview
    parent: Reference
weight: 105
---

{{% product-name %}} is a standalone application that provides centralized
management for Telegraf agents. It runs as a single binary that starts two
separate servers: a web interface/API server and a dedicated high-performance
heartbeat server for agent monitoring.

## Runtime Architecture

### Application Components

When you run the Telegraf Controller binary, it starts four main subsystems:

- **Web Server**: Serves the management interface (default port: `8888`)
- **API Server**: Handles configuration management and administrative requests
  (served on the same port as the web server)
- **Heartbeat Server**: Dedicated high-performance server for agent heartbeats
  (default port: `8000`)
- **Background Scheduler**: Monitors agent health every 60 seconds

### Process Model

- **telegraf_controller** _(single process, multiple servers)_
  - **Main HTTP Server** _(port `8888`)_
    - Web UI (`/`)
    - API Endpoints (`/api/*`)
  - **Heartbeat Server** (port `8000`)
    - POST /heartbeat _(high-performance endpoint)_
  - **Database Connection**
    - SQLite or PostgreSQL
  - **Background Tasks**
    - Agent Status Monitor (60s interval)

The dual-server architecture separates high-frequency heartbeat traffic from
regular management operations, ensuring that the web interface remains
responsive even under heavy agent load.

## Configuration

{{% product-name %}} configuration is controlled through command options and
environment variables.

| Command Option     | Environment Variable | Description                                                                                                      |
| :----------------- | :------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `--port`           | `PORT`               | API server port (default is `8888`)                                                                              |
| `--heartbeat-port` | `HEARTBEAT_PORT`     | Heartbeat service port (default: `8000`)                                                                         |
| `--database`       | `DATABASE`           | Database filepath or URL (default is [SQLite path](/telegraf/controller/install/#default-sqlite-data-locations)) |
| `--ssl-cert`       | `SSL_CERT`           | Path to SSL certificate                                                                                          |
| `--ssl-key`        | `SSL_KEY`            | Path to SSL private key                                                                                          |

To use environment variables, create a `.env` file in the same directory as the
binary or export these environment variables in your terminal session.

### Database Selection

{{% product-name %}} automatically selects the database type based on the
`DATABASE` string:

- **SQLite** (default): Best for development and small deployments with less
  than 1000 agents. Database file created automatically.
- **PostgreSQL**: Required for large deployments. Must be provisioned separately.

Example PostgreSQL configuration:

```bash
DATABASE="postgresql://user:password@localhost:5432/telegraf_controller"
```

## Data Flow

### Agent registration and heartbeats

{{< diagram >}}
flowchart LR
  T["Telegraf Agents<br/>(POST heartbeats)"] --> H["Port 8000<br/>Heartbeat Server"]
  H --Direct Write--> D[("Database")]
  W["Web UI/API<br/>"] --> A["Port 8888<br/>API Server"] --View Agents (Read-Only)--> D  
  R["Rust Scheduler<br/>(Agent status updates)"] --> D

{{< /diagram >}}

1.  **Agents send heartbeats**:

    Telegraf agents with the heartbeat output plugin send `POST` requests to the
    dedicated heartbeat server (port `8000` by default).

2.  **Heartbeat server process the heartbeat**:

    The heartbeat server is a high-performance Rust-based HTTP server that:

    - Receives the `POST` request at `/agents/heartbeat`
    - Validates the heartbeat payload
    - Extracts agent information (ID, hostname, IP address, status, etc.)
    - Uniquely identifies each agent using the `instance_id` in the heartbeat
      payload.

3.  **Heartbeat server writes directly to the database**:

    The heartbeat server uses a Rust NAPI module that:
    
    - Bypasses the application ORM (Object-Relational Mapping) layer entirely
    - Uses `sqlx` (Rust SQL library) to write directly to the database
    - Implements batch processing to efficiently process multiple heartbeats
    - Provides much higher throughput than going through the API layer

    The Rust module performs these operations:

    - Creates a new agent if it does not already exist
    - Adds or updates the `last_seen` timestamp
    - Adds or updates the agent status to the status reported in the heartbeat
    - Adds or updates other agent metadata (hostname, IP, etc.)

4.  **API layer reads agent data**:

    The API layer has read-only access for agent data and performs the following
    actions:
  
    - `GET /api/agents` - List agents
    - `GET /api/agents/summary` - Agent status summary
    
    The API never writes to the agents table. Only the heartbeat server does.

5.  **The Web UI displays updated agent data**:

    The web interface polls the API endpoints to display:

    - Real-time agent status
    - Last seen timestamps
    - Agent health metrics

5. **The background scheduler evaluates agent statuses**:

    Every 60 seconds, a Rust-based scheduler (also part of the NAPI module):

    - Scans all agents in the database
    - Checks `last_seen` timestamps against the agent's assigned reporting rule
    - Updates agent statuses:
      - ok → not_reporting (if heartbeat missed beyond threshold)
      - not_reporting → ok (if heartbeat resumes)
    - Auto-deletes agents based that have exceeded the auto-delete threshold
      (if enabled for the reporting rule)

### Configuration distribution

1.  **An agent requests a configuration**:

    Telegraf agents request their configuration from the main API server
    (port `8888`):

    ```bash
    telegraf --config "http://localhost:8888/api/configs/{config-id}/toml?location=datacenter1&env=prod"
    ```

    The agent makes a `GET` request with:

    - **Config ID**: Unique identifier for the configuration template
    - **Query Parameters**: Variables for parameter substitution
    - **Accept Header**: Can specify `text/x-toml` or `application/octet-stream`
      for download

2.  **The API server receives request**:

    The API server on port `8888` handles the request at
    `/api/configs/{id}/toml` and does the following:

    - Validates the configuration ID
    - Extracts all query parameters for substitution
    - Checks the `Accept` header to determine response format

3.  **The application retrieves the configuration from the database**:

    {{% product-name %}} fetches configuration data from the database:

    - **Configuration TOML**: The raw configuration with parameter placeholders
    - **Configuration name**: Used for filename if downloading
    - **Updated timestamp**: For the `Last-Modified` header

4.  **{{% product-name %}} substitutes parameters**:

    {{% product-name %}} processes the TOML template and replaces parameters
    with parameter values specified in the `GET` request.

5.  **{{% product-name %}} sets response headers**:

    - Content-Type
    - Last-Modified

    Telegraf uses the `Last-Modified` header to determine if a configuration
    has been updated and, if so, download and use the updated configuration.

6.  **{{% product-name %}} delivers the response**:

    Based on the `Accept` header:

    {{< tabs-wrapper >}}
{{% tabs "medium" %}}
[text/x-toml (TOML)](#)
[application/octet-stream (Download)](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN TOML ------------------------------>

```
HTTP/1.1 200 OK
Content-Type: text/x-toml; charset=utf-8
Last-Modified: Mon, 05 Jan 2025 07:28:00 GMT

[agent]
  hostname = "server-01"
  environment = "prod"
...
```

<!-------------------------------- END TOML ------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN DOWNLOAD ---------------------------->

```
HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="config_name.toml"
Last-Modified: Mon, 05 Jan 2025 07:28:00 GMT

[agent]
  hostname = "server-01"
...
```

<!------------------------------ END DOWNLOAD ----------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

7.  _(Optional)_ **Telegraf regularly checks the configuration for updates**:

    Telegraf agents can regularly check {{% product-name %}} for configuration
    updates and automatically load updates when detected. When starting a
    Telegraf agent, include the `--config-url-watch-interval` option with the
    interval that you want the agent to use to check for updates—for example:

    ```bash
    telegraf \
      --config http://localhost:8888/api/configs/xxxxxx/toml \
      --config-url-watch-interval 1h
    ```

## Reporting Rules

{{% product-name %}} uses reporting rules to determine when agents should be
marked as not reporting:

- **Default Rule**: Created automatically on first run
- **Heartbeat Interval**: Expected frequency of agent heartbeats (default: 60s)
- **Threshold Multiplier**: How many intervals to wait before marking not_reporting (default: 3x)

Access reporting rules via:

- **Web UI**: Reporting Rules
- **API**: `GET /api/reporting-rules`
