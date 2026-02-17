InfluxDB provides two Model Context Protocol (MCP) servers for integrating with AI assistants:

- [Manage your InfluxDB instance with the database MCP server](#manage-your-influxdb-instance-with-the-database-mcp-server)
- [Query InfluxDB documentation from your IDE](#query-influxdb-documentation-from-your-ide)

## Manage your InfluxDB instance with the database MCP server

The **InfluxDB database MCP server** lets you interact with
{{% product-name %}} using natural language with large language model (LLM) agents.
It enables database management, token handling, and SQL query generation in plain
English—no coding required.

This section walks you through configuring your LLM agent to run and use the
InfluxDB database MCP server to interact with your
{{% product-name omit=" Clustered" %}} {{% show-in "core,enterprise" %}}server{{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}cluster{{% /show-in %}}.

### Prerequisites

- Node.js v18+ _(if using `npx` to run the MCP server)_
- Docker _(if using Docker to run the MCP server)_
- A running and reachable {{% product-name omit=" Clustered" %}}
  {{% show-in "core,enterprise" %}}server{{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}cluster{{% /show-in %}}.
{{% show-in "core" %}}- A valid {{% product-name %}} [admin token](/influxdb3/core/admin/tokens/admin/){{% /show-in %}}
{{% show-in "enterprise" %}}- A valid {{% product-name %}} [admin or resource token](/influxdb3/enterprise/admin/tokens/#manage-admin-tokens) with appropriate resource-specific permissions{{% /show-in %}}
{{% show-in "cloud-dedicated,clustered" %}}- Valid {{% product-name %}} [management and database tokens](/influxdb3/cloud-dedicated/admin/tokens/){{% /show-in %}}
- _(Optional)_ An LLM assistant like Claude Desktop, ChatGPT Desktop, etc.

### Configure the database MCP server

Use environment variables to configure the InfluxDB 3 MCP server and connect it
to your {{% product-name omit=" Clustered" %}}
{{% show-in "core,enterprise" %}}server{{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}cluster{{% /show-in %}}.
Set the following environment variables when you start the MCP server:

#### Required InfluxDB connection variables

{{% show-in "core,enterprise" %}}

- **INFLUX_DB_PRODUCT_TYPE**: `{{% product-key %}}`
- **INFLUX_DB_INSTANCE_URL**: Your {{% product-name %}} URL--for example:

  ```txt
  http://{{< influxdb/host >}}
  ```

  > [!Note]
  > If using Docker to run the InfluxDB MCP server and you want to manage an
  > InfluxDB instance running on `localhost`, use the internal Docker network
  > to connect to your local {{% product-name %}} server--for example:
  >
  > ```txt
  > http://host.docker.internal:8181/
  > ```
{{% /show-in %}}

{{% show-in "core" %}}
- **INFLUX_DB_TOKEN**: Your {{% product-name %}} [admin token](/influxdb3/core/admin/tokens/admin/)
{{% /show-in %}}
{{% show-in "enterprise" %}}
- **INFLUX_DB_TOKEN**: Your {{% product-name %}} [admin token](/influxdb3/enterprise/admin/tokens/admin) or [resource token](/influxdb3/enterprise/admin/tokens/resource).


  > [!Note]
  > If using a resource token, your LLM agent can only perform the operations
  > allowed by the token permissions.

{{% /show-in %}}

{{% show-in "cloud-dedicated,clustered" %}}

- **INFLUX_DB_PRODUCT_TYPE**: `{{% product-key %}}`
- **INFLUX_DB_ACCOUNT_ID**: Your {{% product-name %}} account ID
- **INFLUX_DB_CLUSTER_ID**: Your {{% product-name %}} cluster ID
- **INFLUX_DB_TOKEN**: An {{% product-name %}} [database token](/influxdb3/cloud-dedicated/admin/tokens/database/)
- **INFLUX_DB_MANAGEMENT_TOKEN**: An {{% product-name %}} [management token](/influxdb3/cloud-dedicated/admin/tokens/management/)

> [!Note]
> #### Optional tokens
>
> You can include one or both of `INFLUX_DB_TOKEN` and `INFLUX_DB_MANAGEMENT_TOKEN`,
> but omitting either limits the type of operations your LLM agents can perform on your
> {{% product-name omit=" Clustered" %}} cluster.

{{% /show-in %}}

### Configure your LLM agent to run the database MCP server

To run the MCP server, use either Node.js and `npm` or Docker.
Some LLM agents, like [Claude Desktop](https://claude.ai/download), start, run,
and connect to the MCP server for you.

The following instructions show how to configure
**Claude Desktop** to use the InfluxDB database MCP server.

{{< tabs-wrapper >}}
{{% tabs %}}
[Node.js](#)
[Docker](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN NODE.JS ------------------------------->

1.  Clone the [influxdata/influxdb3_mcp_server repository](https://github.com/influxdata/influxdb3_mcp_server)
    from GitHub.
2.  Navigate to the `influxdb3_mcp_server` project directory:

    ```bash
    cd influxdb3_mcp_server/
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Build the MCP server:

    ```bash
    npm run build
    ```

This builds the files necessary to run the MCP server and stores them in `./build`.
The `./build/index.js` file starts the MCP server.

#### Configure your LLM Agent to use the Node.js-based MCP server

In **Claude Desktop**, go to **Settings** > **Developer** and edit your configuration.
Enter the following JSON configuration:

{{% show-in "core,enterprise" %}}
{{% code-placeholders "path/to|AUTH_TOKEN" %}}
```json
{
  "mcpServers": {
    "influxdb": {
      "command": "node",
      "args": ["/path/to/influxdb3_mcp_server/build/index.js"],
      "env": {
        "INFLUX_DB_PRODUCT_TYPE": "{{% product-key %}}",
        "INFLUX_DB_INSTANCE_URL": "http://{{< influxdb/host >}}",
        "INFLUX_DB_TOKEN": "AUTH_TOKEN"
      }
    }
  }
}
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`path/to`{{% /code-placeholder-key %}}:
  The absolute path to your `influxdb3_mcp_server` project directory.
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Your {{% product-name %}} token. The permissions granted by the token
  determine what operations your LLM agents can perform.

{{% /show-in %}}

{{% show-in "cloud-dedicated" %}}

{{% code-placeholders "path/to|DEDICATED_(CLUSTER|ACCOUNT|DATABASE|MANAGEMENT)_(ID|TOKEN)" %}}
```json
{
  "mcpServers": {
    "influxdb": {
      "command": "node",
      "args": ["/path/to/influxdb3_mcp_server/build/index.js"],
      "env": {
        "INFLUX_DB_PRODUCT_TYPE": "{{% product-key %}}",
        "INFLUX_DB_CLUSTER_ID": "DEDICATED_CLUSTER_ID",
        "INFLUX_DB_ACCOUNT_ID": "DEDICATED_ACCOUNT_ID",
        "INFLUX_DB_TOKEN": "DEDICATED_DATABASE_TOKEN",
        "INFLUX_DB_MANAGEMENT_TOKEN": "DEDICATED_MANAGEMENT_TOKEN"
      }
    }
  }
}
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`path/to`{{% /code-placeholder-key %}}:
  The absolute path to your `influxdb3_mcp_server` project directory.
- {{% code-placeholder-key %}}`DEDICATED_ACCOUNT_ID`{{% /code-placeholder-key %}}:
  Your {{% product-name %}} account ID
- {{% code-placeholder-key %}}`DEDICATED_CLUSTER_ID`{{% /code-placeholder-key %}}:
  Your {{% product-name omit=" Clustered" %}} cluster ID
- {{% code-placeholder-key %}}`DEDICATED_DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  A [database token](/influxdb3/cloud-dedicated/admin/tokens/database/) with
  permissions that grant access to all databases you would like your LLM agent
  to be able to write data to and query data from
- {{% code-placeholder-key %}}`DEDICATED_MANAGEMENT_TOKEN`{{% /code-placeholder-key %}}:
  A [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) that
  lets your LLM agent perform administrative tasks on your {{% product-name %}} cluster

{{% /show-in %}}

<!-------------------------------- END NODE.JS -------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN DOCKER -------------------------------->

#### Configure your LLM Agent to use the Docker-based MCP server

In **Claude Desktop**, go to **Settings** > **Developer** and edit your configuration.
Enter the following JSON configuration:

{{% show-in "core,enterprise" %}}

- [Connect to a remote InfluxDB server](#connect-to-a-remote-influxdb-server)
- [Connect to a local InfluxDB server](#connect-to-a-local-influxdb-server)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`path/to`{{% /code-placeholder-key %}}:
  The absolute path to your `influxdb3_mcp_server` project directory.
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Your {{% product-name %}} token. The permissions granted by the token
  determine what operations your LLM agents can perform.


##### Connect to a remote InfluxDB server

{{% code-placeholders "path/to|AUTH_TOKEN" %}}
```json
{
  "mcpServers": {
      "influxdb": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "--interactive",
        "--env",
        "INFLUX_DB_PRODUCT_TYPE",
        "--env",
        "INFLUX_DB_INSTANCE_URL",
        "--env",
        "INFLUX_DB_TOKEN",
        "influxdata/influxdb3-mcp-server"
      ],
      "env": {
        "INFLUX_DB_PRODUCT_TYPE": "{{% product-key %}}",
        "INFLUX_DB_INSTANCE_URL": "http://{{< influxdb/host >}}",
        "INFLUX_DB_TOKEN": "AUTH_TOKEN"
      }
    }
  }
}
```
{{% /code-placeholders %}}

##### Connect to a local InfluxDB server

{{% code-placeholders "path/to|AUTH_TOKEN" %}}
```json
{
  "mcpServers": {
      "influxdb": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "--interactive",
        "--add-host=host.docker.internal:host-gateway",
        "--env",
        "INFLUX_DB_PRODUCT_TYPE",
        "--env",
        "INFLUX_DB_INSTANCE_URL",
        "--env",
        "INFLUX_DB_TOKEN",
        "influxdata/influxdb3-mcp-server"
      ],
      "env": {
        "INFLUX_DB_PRODUCT_TYPE": "{{% product-key %}}",
        "INFLUX_DB_INSTANCE_URL": "http://host.docker.internal:8181",
        "INFLUX_DB_TOKEN": "AUTH_TOKEN"
      }
    }
  }
}
```
{{% /code-placeholders %}}

{{% /show-in %}}

{{% show-in "cloud-dedicated" %}}

{{% code-placeholders "path/to|DEDICATED_(CLUSTER|ACCOUNT|DATABASE|MANAGEMENT)_(ID|TOKEN)" %}}
```json
{
  "mcpServers": {
    "influxdb": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "--interactive",
        "--env",
        "INFLUX_DB_PRODUCT_TYPE",
        "--env",
        "INFLUX_DB_ACCOUNT_ID",
        "--env",
        "INFLUX_DB_CLUSTER_ID",
        "--env",
        "INFLUX_DB_TOKEN",
        "--env",
        "INFLUX_DB_MANAGEMENT_TOKEN",
        "influxdata/influxdb3-mcp-server"
      ],
      "env": {
        "INFLUX_DB_PRODUCT_TYPE": "{{% product-key %}}",
        "INFLUX_DB_ACCOUNT_ID": "DEDICATED_ACCOUNT_ID",
        "INFLUX_DB_CLUSTER_ID": "DEDICATED_CLUSTER_ID",
        "INFLUX_DB_TOKEN": "DEDICATED_DATABASE_TOKEN",
        "INFLUX_DB_MANAGEMENT_TOKEN": "DEDICATED_MANAGEMENT_TOKEN"
      }
    }
  }
}
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DEDICATED_ACCOUNT_ID`{{% /code-placeholder-key %}}:
  Your {{% product-name %}} account ID
- {{% code-placeholder-key %}}`DEDICATED_CLUSTER_ID`{{% /code-placeholder-key %}}:
  Your {{% product-name omit=" Clustered" %}} cluster ID
- {{% code-placeholder-key %}}`DEDICATED_DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  A [database token](/influxdb3/cloud-dedicated/admin/tokens/database/) with
  permissions that grant access to all databases you would like your LLM agent
  to be able to write data to and query data from
- {{% code-placeholder-key %}}`DEDICATED_MANAGEMENT_TOKEN`{{% /code-placeholder-key %}}:
  A [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) that
  lets your LLM agent perform administrative tasks on your {{% product-name %}} cluster

{{% /show-in %}}

<!------------------------------- END DOCKER -------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Supported features

Once connected, you can use your LLM agent to perform tasks on your
{{% product-name %}} {{% show-in "core,enterprise" %}}server{{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}cluster{{% /show-in %}},
including:

- Create, update, and delete databases
- List tables and inspect schemas
- Create and manage tokens
- Query data without writing SQL or InfluxQL
- Check server health and connection status

#### Examples of supported prompts

> "List all tables in the `production` database."
>
> "Create a read-only token for the `metrics` database."
>
> "Analyze last week's sensor data for anomalies."
>
> "Create a new database called `iot_sensors` with a 30-day retention policy."
>
> "Show me the schema for the `sensor_data` table."

## Query InfluxDB documentation from your IDE

The **InfluxDB documentation MCP server** lets AI tools and agents search InfluxDB
documentation directly from your development environment.
Use it to find answers, code examples, and configuration details without leaving your IDE.

### Why use the documentation MCP server?

When you connect the documentation MCP server to your AI coding assistant, the assistant
can search InfluxDB documentation to answer your questions with accurate, up-to-date information.
Instead of switching to a browser or guessing at syntax, you can ask questions
in your IDE and get responses grounded in official documentation.

**Common use cases:**

- Get help writing queries, client library code, or CLI commands
- Look up configuration options and environment variables
- Find code examples for specific tasks
- Troubleshoot errors with documentation-backed answers

### Install the documentation MCP server

The documentation MCP server is a hosted service—you don't need to install or run anything locally.
Add the server URL to your AI tool's MCP configuration.

> [!Note]
> On first use, you'll be prompted to sign in with Google.
> This authentication is used only for rate limiting—no personal data is collected.

**MCP server URL:**

```text
https://influxdb-docs.mcp.kapa.ai
```

The server uses SSE (Server-Sent Events) transport.
For help adding MCP servers, refer to your tool's documentation or ask your AI assistant.

### Authentication and rate limits

When you connect to the documentation MCP server for the first time, a Google sign-in
window opens to complete an OAuth/OpenID Connect login.

The hosted MCP server:

- Requests only the `openid` scope from Google
- Receives an ID token (JWT) containing a stable, opaque user ID
- Does not request `email` or `profile` scopes—your name, email address, and other
  personal data are not collected

The anonymous Google ID enforces per-user rate limits to prevent abuse:

- **40 requests** per user per hour
- **200 requests** per user per day

> [!Tip]
> On Google's consent screen, this appears as "Associate you with your personal info on Google."
> This is Google's generic wording for the `openid` scope—it means the app can recognize
> that the same Google account is signing in again.
> It does not grant access to your email, name, contacts, or other data.

### Search documentation with the MCP tool

The documentation MCP server exposes a semantic search tool:

```text
search_influxdb_knowledge_sources
```

This tool lets AI agents perform semantic retrieval over InfluxDB documentation
and related knowledge sources.

**What the tool does:**

- Searches all InfluxDB documentation for a given query
- Returns the most relevant chunks in descending order of relevance
- Each chunk is a self-contained snippet from a single documentation page

**Response format:**

Each result includes:

- `source_url`: URL of the original documentation page
- `content`: The chunk content in Markdown

### Use the documentation MCP server

After you install the documentation MCP server, your AI assistant can search InfluxDB
documentation to help you with tasks.
Ask questions naturally—the assistant uses the MCP server to find relevant documentation
and provide accurate answers.

#### Example prompts

> "How do I write data to InfluxDB using Python?"
>
> "What's the syntax for a SQL query with a WHERE clause in InfluxDB?"
>
> "Show me how to configure Telegraf to collect CPU metrics."
>
> "What environment variables does the InfluxDB CLI use?"
>
> "How do I create a database token with read-only permissions?"
