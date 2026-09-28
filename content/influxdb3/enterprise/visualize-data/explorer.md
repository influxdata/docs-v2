---
title: Use the integrated InfluxDB 3 Explorer UI
list_title: InfluxDB 3 Explorer
description: >
  Serve the InfluxDB 3 Explorer web UI directly from your
  {{< product-name >}} server. Starting with v3.11, Explorer ships inside the
  Enterprise binary as a WebAssembly (WASM) guest, so you don't run a separate
  container.
menu:
  influxdb3_enterprise:
    parent: Visualize data
    name: Use InfluxDB 3 Explorer
    identifier: visualize-with-explorer
weight: 100
metadata: [InfluxDB 3 Enterprise v3.11+]
alt_links:
  explorer: /influxdb3/explorer/install/
related:
  - /influxdb3/enterprise/reference/config-options/#mode
  - /influxdb3/enterprise/reference/config-options/#web-ui
  - /influxdb3/explorer/, InfluxDB 3 Explorer documentation
  - /influxdb3/explorer/install/, Install InfluxDB 3 Explorer
---

Starting with {{% product-name %}} v3.11, the
[InfluxDB 3 Explorer](/influxdb3/explorer/) web UI ships inside the Enterprise
binary as a [WebAssembly](https://webassembly.org/) (WASM) guest that the
server hosts in-process behind a
[WASI](https://wasi.dev/) sandbox.
To serve Explorer from your server, add the `webui` mode when you start the
server.
You don't need to run the Explorer Docker container alongside InfluxDB.

Explorer isn't enabled by default.
The `all` mode doesn't include `webui`, so name `webui` explicitly--for
example, `--mode all,webui`.

- [Before you begin](#before-you-begin)
- [Check your version](#check-your-version)
- [Start the server with Explorer enabled](#start-the-server-with-explorer-enabled)
- [Connect Explorer to your server](#connect-explorer-to-your-server)
- [Manage the session secret](#manage-the-session-secret)
- [Explorer application data](#explorer-application-data)
- [Enable AI chat](#enable-ai-chat)
- [Choose between integrated and containerized Explorer](#choose-between-integrated-and-containerized-explorer)

## Before you begin

To serve Explorer from your server, you need the following:

- {{% product-name %}} v3.11 or later.
  For earlier releases, run the
  [Explorer Docker container](/influxdb3/explorer/install/).
- A session secret.
  {{% product-name %}} requires
  [`--webui-session-secret`](/influxdb3/enterprise/reference/config-options/#webui-session-secret)
  whenever `webui` mode is enabled, and doesn't start without it.
- _(Optional)_ A plugin directory.
  Explorer runs without one.
  To use the plugin features in Explorer, create the directory and pass it to
  [`--plugin-dir`](/influxdb3/enterprise/reference/config-options/#plugin-dir).

## Check your version

Explorer availability depends on the InfluxDB 3 server version and edition, not
on the Explorer version alone.
Use either of the following checks.

To check the version of a local binary:

```bash
influxdb3 --version
```

To check the version and edition of a running server, send a `GET` request to
the `/ping` endpoint:

```sh
curl --get "http://localhost:8181/ping" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

The response headers include `x-influxdb-version` and `x-influxdb-build`.
`x-influxdb-build` reports `Core` or `Enterprise`, so one request answers both
the version question and the edition question.
Use `GET`; a `HEAD` request returns `404`.

## Start the server with Explorer enabled

1. Start the server with `webui` added to `--mode` and a session secret:

   ```bash
   influxdb3 serve \
     --cluster-id cluster0 \
     --node-id node0 \
     --mode all,webui \
     --webui-session-secret "$(openssl rand -base64 24)"
   ```

   To use the plugin features in Explorer, create a plugin directory and add
   `--plugin-dir`:

   ```bash
   mkdir -p ./plugins
   ```

   ```bash
   influxdb3 serve \
     --cluster-id cluster0 \
     --node-id node0 \
     --mode all,webui \
     --plugin-dir ./plugins \
     --webui-session-secret "$(openssl rand -base64 24)"
   ```

2. Open Explorer in your browser.
   The server serves Explorer at the root path of its regular HTTP address and
   port--for example, <http://localhost:8181/>.
   Explorer doesn't use a separate port.

`openssl rand -base64 24` generates a new secret on every start, which signs
users out after each restart.
For anything beyond a local trial, generate the secret once and pass the same
value on every start.
See [Manage the session secret](#manage-the-session-secret).

> [!Important]
> #### Control who can reach Explorer
>
> Anyone who can reach Explorer can use the InfluxDB connection configured in
> it, with that token's permissions.
> Treat reaching Explorer the same as holding the token: bind the server to an
> interface you intend to expose, use tokens scoped to the task, and put an
> authenticating reverse proxy with TLS in front of any remote access.
> To control which interface the server listens on, see
> [`--http-bind`](/influxdb3/enterprise/reference/config-options/#http-bind).
> When browsers reach Explorer over HTTPS, also set
> [`--webui-cookie-secure`](/influxdb3/enterprise/reference/config-options/#webui-cookie-secure)
> so session cookies are never sent over HTTP.

## Connect Explorer to your server

After the server starts, configure a connection to your server in Explorer the
same way you configure one in the standalone Docker Explorer--for example,
`http://localhost:8181`.
For the connection fields and the steps to create a connection, see
[Get started with InfluxDB 3 Explorer](/influxdb3/explorer/get-started/).

Choose the token for the connection based on what you need Explorer to do:

- A [resource token](/influxdb3/enterprise/admin/tokens/resource/) is enough to
  query and write data within the permissions you grant it.
- To manage databases, tokens, and other resources from Explorer, use an
  [admin token](/influxdb3/enterprise/admin/tokens/admin/).

## Manage the session secret

`--webui-session-secret` signs the session cookies that Explorer issues.
The server requires the option whenever `webui` mode is enabled.

- **Generate the secret once and reuse it.**
  A secret that changes on restart invalidates every existing session.
- **Use the same secret on every node that serves Explorer.**
  When several nodes in a cluster run `webui` mode, they all need the same
  secret.
- **Keep the secret out of your shell history and process list.**
  Set the secret through the environment variable instead of the command line
  when you can.
- **Rotate the secret when it may have been exposed.**
  Rotating signs out all users.

To generate a secret:

```bash
openssl rand -base64 24
```

## Explorer application data

The integrated Explorer keeps its application state in a SQLite database that
the server synchronizes to object storage for each cluster.
You don't mount a volume to persist it, which is the main operational
difference from the
[Explorer Docker container](/influxdb3/explorer/install/#persist-data-across-restarts).

## Enable AI chat

Explorer includes an AI chat feature that supports OpenAI, Anthropic, and
Gemini.
Each user enters their own AI provider API key in Explorer's settings.
You don't configure an API key on the server, and no server option turns the
feature on.

[`--webui-openai-base-url`](/influxdb3/enterprise/reference/config-options/#webui-openai-base-url)
changes only where Explorer sends OpenAI requests.
Set it to route OpenAI traffic to an OpenAI-compatible endpoint, such as a
self-hosted model or a gateway:

```bash
influxdb3 serve \
  --cluster-id cluster0 \
  --node-id node0 \
  --mode all,webui \
  --webui-session-secret "$WEBUI_SESSION_SECRET" \
  --webui-openai-base-url "https://your-openai-compatible-endpoint"
```

The option doesn't affect Anthropic or Gemini requests.

Chat prompts, and any query results included with them, go to the AI provider
the user selects.
Choose providers and endpoints that your data handling policies allow.

## Choose between integrated and containerized Explorer

| | Integrated (WASM) | Docker container |
| :--- | :--- | :--- |
| Requires | {{% product-name %}} v3.11+ | Docker |
| Runs | In the InfluxDB server process | As a separate container |
| Enabled by | `--mode all,webui` | `docker run influxdata/influxdb3-ui` |
| Application data | SQLite synchronized to object storage | SQLite in a mounted volume |
| Works with InfluxDB 3 Core | No | Yes |

The container isn't replaced by the integrated UI.
It's required for Core and for Enterprise earlier than v3.11, and it still
works with v3.11 and later.
Use the container when you run Core, when you run an Enterprise release
earlier than v3.11, or when you want Explorer to run separately from the
database server--for example, on an operator workstation.
See [Install and run InfluxDB 3 Explorer](/influxdb3/explorer/install/).
