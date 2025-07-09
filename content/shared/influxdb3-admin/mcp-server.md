The **InfluxDB Model Context Protocol (MCP) server** lets you interact with
{{% product-name %}} using natural language with large language model (LLM) agents.
It enables database management, token handling, and SQL query generation in
plain English—without unnecessary code.

This guide walks you through setting up an InfluxDB MCP server and connecting it
to an {{% product-name omit=" Clustered" %}} {{% show-in "core,enterprise" %}}server{{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}cluster{{% /show-in %}}.

## Prerequisites

- Node.js v18+ _(if installing with `npm`)_
- Docker _(if using the Docker image)_
- A running and reachable {{% product-name omit=" Clustered" %}}
  {{% show-in "core,enterprise" %}}server{{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}cluster{{% /show-in %}}.
{{% show-in "core" %}}- A valid {{% product-name %}} [admin token](/influxdb3/core/admin/tokens/admin/){{% /show-in %}}
{{% show-in "enterprise" %}}- A valid {{% product-name %}} [admin or resource token](/influxdb3/enterprise/admin/tokens/#manage-admin-tokens) with appropriate resource-specific permissions{{% /show-in %}}
{{% show-in "cloud-dedicated,clustered" %}}- Valid {{% product-name %}} [management and database tokens](/influxdb3/cloud-dedicated/admin/tokens/){{% /show-in %}}
- _(Optional)_ An LLM assistant like Claude Desktop, ChatGPT Desktop, etc.

## Install the InfluxDB 3 MCP server

Use either **npm** or **Docker** to install the InfluxDB 3 MCP server:

{{< tabs-wrapper >}}
{{% tabs %}}
[npm](#)
[Docker](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------- BEGIN NPM --------------------------------->

### Install with npm

<!-- pytest.mark.skip -->
```bash
npm install -g influxdb3-mcp-server
```

<!---------------------------------- END NPM ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN DOCKER -------------------------------->

### Pull the Docker image

<!-- pytest.mark.skip -->
```bash
docker pull influxdata/influxdb3-mcp-server:latest
```

<!------------------------------- END DOCKER -------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Configure the MCP server

Use environment variables to configure the InfluxDB 3 MCP server.
Set the following variables to configure connectivity with your {{% product-name omit=" Clustered" %}}
{{% show-in "core,enterprise" %}}server{{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}cluster{{% /show-in %}}:

{{% show-in "core,enterprise" %}}

{{% code-placeholders "AUTH_TOKEN" %}}
<!-- pytest.mark.skip -->
```bash
export INFLUX_DB_PRODUCT_TYPE={{% product-key %}}
export INFLUX_DB_INSTANCE_URL=http://{{< influxdb/host >}}
export INFLUX_DB_TOKEN=AUTH_TOKEN
```
{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}
with your {{% product-name %}} token. The permissions granted by the token
determine what operations your LLM agents can perform.

> [!Note]
> #### Use the Docker internal network if InfluxDB is running on localhost
>
> If using Docker to run the InfluxDB MCP server and you want to manage an
> InfluxDB instance running on `localhost`, use the internal Docker network
> to connect to your local {{% product-name %}} server--for example:
>
> ```txt
> http://host.docker.internal:8181/
> ```
{{% /show-in %}}

{{% show-in "cloud-dedicated,clustered" %}}

{{% code-placeholders "DEDICATED_(CLUSTER|ACCOUNT|DATABASE|MANAGEMENT)_(ID|TOKEN)" %}}
<!-- pytest.mark.skip -->
```bash
export INFLUX_DB_PRODUCT_TYPE={{% product-key %}}
export INFLUX_DB_CLUSTER_ID=DEDICATED_CLUSTER_ID
export INFLUX_DB_ACCOUNT_ID=DEDICATED_ACCOUNT_ID
export INFLUX_DB_TOKEN=DEDICATED_DATABASE_TOKEN
export INFLUX_DB_MANAGEMENT_TOKEN=DEDICATED_MANAGEMENT_TOKEN
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DEDICATED_CLUSTER_ID`{{% /code-placeholder-key %}}:
  Your {{% product-name omit=" Clustered" %}} cluster ID
- {{% code-placeholder-key %}}`DEDICATED_ACCOUNT_ID`{{% /code-placeholder-key %}}:
  Your {{% product-name %}} account ID
- {{% code-placeholder-key %}}`DEDICATED_DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  A [database token](/influxdb3/cloud-dedicated/admin/tokens/database/) with
  permissions that grant access to all databases you would like your LLM agent
  to be able to write data to and query data from
- {{% code-placeholder-key %}}`DEDICATED_MANAGEMENT_TOKEN`{{% /code-placeholder-key %}}:
  A [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) that
  lets your LLM agent perform administrative tasks on your {{% product-name %}} cluster

> [!Note]
> #### Optional tokens
>
> `INFLUX_DB_TOKEN` and `INFLUX_DB_MANAGEMENT_TOKEN` are both optional, but omitting
> either limits the type of operations your LLM agents can perform on your
> {{% product-name omit=" Clustered" %}} cluster.

{{% /show-in %}}

### Other MCP server configuration options

```bash
export MCP_SERVER_PORT=8080       # Optional, default is 8080
export MCP_SERVER_HOST=0.0.0.0    # Optional, default is 127.0.0.1
```

## Start the MCP server

Depending on your InfluxDB MCP server [installation method](#install-the-influxdb-3-mcp-server),
do the following to start the server:

{{< tabs-wrapper >}}
{{% tabs %}}
[npm](#)
[Docker](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------- BEGIN NPM --------------------------------->

<!-- pytest.mark.skip -->
```bash
npx -y @modelcontextprotocol/server-influxdb
```

<!---------------------------------- END NPM ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN DOCKER -------------------------------->

{{% show-in "core,enterprise" %}}
{{% code-placeholders "AUTH_TOKEN" %}}
<!-- pytest.mark.skip -->
```bash
docker run --publish 8080:8080 \
  --env INFLUX_DB_PRODUCT_TYPE \
  --env INFLUX_DB_INSTANCE_URL \
  --env INFLUX_DB_TOKEN \
  influxdata/influxdb3-mcp-server:latest
```
{{% /code-placeholders %}}
{{% /show-in %}}

{{% show-in "cloud-dedicated,clustered" %}}
<!-- pytest.mark.skip -->
```bash
docker run --publish 8080:8080 \
  --env INFLUX_DB_PRODUCT_TYPE \
  --env INFLUX_DB_CLUSTER_ID \
  --env INFLUX_DB_ACCOUNT_ID \
  --env INFLUX_DB_TOKEN \
  --env INFLUX_DB_MANAGEMENT_TOKEN \
  influxdata/influxdb3-mcp-server:latest
```
{{% /show-in %}}

> [!Note]
> These commands inherit the environment variable values already
> [exported to the environment](#configure-the-mcp-server).

<!------------------------------- END DOCKER -------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Connect Your LLM Agent

Once the MCP server is running, configure your LLM assistant to connect using
the [Model Context Protocol (MCP)](https://github.com/influxdata/model-context-protocol).
No additional plugins are needed—just point the agent to your MCP server URL
and begin issuing natural language prompts.

> [!Note]
> For information about connecting your specific LLM agent to your InfluxDB MCP
> server, see your LLM agent's documentation.

### Supported Features

Once connected, you can use your LLM agent to perform tasks on your 
{{% product-name %}} {{% show-in "core,enterprise" %}}server{{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}cluster{{% /show-in %}},
including:

- Create, update, and delete databases
- List tables and inspect schemas
- Create and manage tokens
- Query data without writing SQL or InfluxQL
- Check server health and connection status

##### Examples of supported prompts

> “List all tables in the `production` database.”
>
> “Create a read-only token for the `metrics` database.”
>
> “Analyze last week’s sensor data for anomalies.”
>
> “Create a new database called `iot_sensors` with a 30-day retention policy.”
>
> “Show me the schema for the `sensor_data` table.”
