The **InfluxDB documentation MCP server** lets AI tools and agents search InfluxDB
documentation directly from your development environment.
Use it to find answers, code examples, and configuration details without leaving your IDE.

## Why use the documentation MCP server?

When you connect the documentation MCP server to your AI coding assistant, the assistant
can search InfluxDB documentation to answer your questions with accurate, up-to-date information.
Instead of switching to a browser or guessing at syntax, you can ask questions
in your IDE and get responses grounded in official documentation.

**Common use cases:**

- Get help writing queries, client library code, or CLI commands
- Look up configuration options and environment variables
- Find code examples for specific tasks
- Troubleshoot errors with documentation-backed answers

## Install the documentation MCP server

The documentation MCP server is a hosted service—you don't need to install or run anything locally.
Add the server URL to your AI assistant's MCP configuration.

> [!Note]
> On first use, you'll be prompted to sign in with Google.
> This authentication is used only for rate limiting—no personal data is collected.

**MCP server URL:**

```text
https://influxdb-docs.mcp.kapa.ai
```

The server uses SSE (Server-Sent Events) transport.

### Configure your AI assistant to use the documentation MCP server

The following instructions show how to configure popular AI assistants to use the InfluxDB documentation MCP server.

{{< tabs-wrapper >}}
{{% tabs %}}
[Claude Desktop](#)
[ChatGPT Desktop](#)
[GitHub Copilot (VS Code)](#)
[Cursor](#)
[OpenCode](#)
{{% /tabs %}}
{{% tab-content %}}
<!----------------------------- BEGIN CLAUDE DESKTOP ---------------------------->

In **Claude Desktop**, go to **Settings** > **Developer** and edit your configuration.
Add the following JSON configuration:

```json
{
  "mcpServers": {
    "influxdb-docs": {
      "url": "https://influxdb-docs.mcp.kapa.ai"
    }
  }
}
```

Save the file and restart Claude Desktop for the changes to take effect.

<!----------------------------- END CLAUDE DESKTOP ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN CHATGPT DESKTOP ---------------------------->

In **ChatGPT Desktop**, go to **Settings** > **Integrations** > **Enable MCP** and add a new server.
Add the following JSON configuration:

```json
{
  "mcpServers": {
    "influxdb-docs": {
      "url": "https://influxdb-docs.mcp.kapa.ai",
      "transport": "sse"
    }
  }
}
```

Save the configuration and restart ChatGPT Desktop.

<!----------------------------- END CHATGPT DESKTOP ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN GITHUB COPILOT ---------------------------->

In **VS Code**, configure GitHub Copilot to use the MCP server:

1. Create or edit `.vscode/mcp.json` in your workspace or project directory
2. Add the following configuration:

```json
{
  "servers": {
    "influxdb-docs": {
      "type": "http",
      "url": "https://influxdb-docs.mcp.kapa.ai"
    }
  }
}
```

3. Restart or reload VS Code
4. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
5. Run **MCP: List Servers** to verify the server is registered

The InfluxDB documentation MCP server will now be available through GitHub Copilot Chat.

<!----------------------------- END GITHUB COPILOT ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN CURSOR ---------------------------->

In **Cursor**, add the MCP server configuration to your MCP settings file.

1. Open **Settings** and navigate to **MCP Servers**
2. Click **Add MCP Server** or edit the configuration file directly
3. Add the following configuration to `.cursor/mcp.json` (project-level) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "influxdb-docs": {
      "url": "https://influxdb-docs.mcp.kapa.ai",
      "transport": "streamableHttp"
    }
  }
}
```

Save the file and restart Cursor.

<!----------------------------- END CURSOR ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN OPENCODE ---------------------------->

In **OpenCode**, configure the MCP server in your configuration file:

1. Create or edit `opencode.json` (or `opencode.jsonc`) in your workspace
2. Add the following configuration:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "influxdb-docs": {
      "type": "remote",
      "url": "https://influxdb-docs.mcp.kapa.ai",
      "enabled": true
    }
  }
}
```

3. Start OpenCode and use the `/init` command to verify the MCP server is accessible

The InfluxDB documentation search tools will be available in your OpenCode sessions.

<!----------------------------- END OPENCODE ---------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Authentication and rate limits

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
> This authorization does not grant access to your email, name, contacts, or other data.

## Search documentation with the MCP tool

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

{{< img-hd src="/img/influxdb3/core-mcp-influxdb3-plugin.png" alt="MCP tool search results showing InfluxDB documentation" />}}

## Use the documentation MCP server

After you install the documentation MCP server, your AI assistant can search InfluxDB
documentation to help you with tasks.
Ask questions naturally—the assistant uses the MCP server to find relevant documentation
and provide accurate answers.

### Example prompts

> "How do I write data to InfluxDB using Python?"
>
> "What's the syntax for a SQL query with a WHERE clause in InfluxDB?"
>
> "Show me how to configure Telegraf to collect CPU metrics."
>
> "What environment variables does the InfluxDB CLI use?"
>
> "How do I create a database token with read-only permissions?"
