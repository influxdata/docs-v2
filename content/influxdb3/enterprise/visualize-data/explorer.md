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
related:
  - /influxdb3/enterprise/reference/config-options/#mode
  - /influxdb3/enterprise/reference/config-options/#web-ui
  - /influxdb3/explorer/, InfluxDB 3 Explorer documentation
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
- A plugin directory.
  Pass the directory to
  [`--plugin-dir`](/influxdb3/enterprise/reference/config-options/#plugin-dir)
  and create it before you start the server.

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

1. Create the plugin directory:

   ```bash
   mkdir -p ./plugins
   ```

2. Start the server with `webui` added to `--mode` and a session secret:

   ```bash
   influxdb3 serve \
     --cluster-id cluster0 \
     --node-id node0 \
     --mode all,webui \
     --plugin-dir ./plugins \
     --webui-session-secret "$(openssl rand -base64 24)"
   ```

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

<!-- NEEDS VERIFICATION: the address and path that serve Explorer when `webui`
mode is enabled. The 3.11 release notes don't state whether Explorer is served
from the `--http-bind` address (default `0.0.0.0:8181`) at a path, or from a
separate listener and port. Confirm before publishing and add an "Access
Explorer" step here with the exact URL. -->

## Connect Explorer to your server

After the server starts, configure a connection to your server in Explorer the
same way you configure one in the standalone Docker Explorer--for example,
`http://localhost:8181`.
For the connection fields and the steps to create a connection, see
[Get started with InfluxDB 3 Explorer](/influxdb3/explorer/get-started/).

<!-- NEEDS VERIFICATION: whether the integrated Explorer requires an operator
token for the initial connection, and whether the server pre-populates the
connection to itself. Per the 3.11 release notes draft, the connection setup
landed with pending PRs still in progress. -->

## Manage the session secret

`--webui-session-secret` signs the session cookies that Explorer issues.
The server requires the option whenever `webui` mode is enabled.

- **Generate the secret once and reuse it.**
  A secret that changes on restart invalidates every existing session.
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

Explorer includes an AI chat feature that you can point at any
OpenAI-compatible endpoint.
To enable it, set
[`--webui-openai-base-url`](/influxdb3/enterprise/reference/config-options/#webui-openai-base-url)
to the base URL of the endpoint:

```bash
influxdb3 serve \
  --cluster-id cluster0 \
  --node-id node0 \
  --mode all,webui \
  --plugin-dir ./plugins \
  --webui-session-secret "$WEBUI_SESSION_SECRET" \
  --webui-openai-base-url "https://your-openai-compatible-endpoint"
```

Chat prompts, and any query results included with them, go to the endpoint you
configure.
Choose an endpoint that your data handling policies allow.

<!-- NEEDS VERIFICATION: how the AI chat endpoint authenticates. If an API key
option or environment variable exists (for example, a `--webui-openai-*`
credential option), document it here. `influxdb3 serve --help-all` lists every
option in a specific build. -->

## Choose between integrated and containerized Explorer

| | Integrated (WASM) | Docker container |
| :--- | :--- | :--- |
| Requires | {{% product-name %}} v3.11+ | Docker |
| Runs | In the InfluxDB server process | As a separate container |
| Enabled by | `--mode all,webui` | `docker run influxdata/influxdb3-ui` |
| Application data | SQLite synchronized to object storage | SQLite in a mounted volume |
| Works with InfluxDB 3 Core | No | Yes |

Use the container when you run Core, when you run an Enterprise release
earlier than v3.11, or when you want Explorer to run separately from the
database server--for example, on an operator workstation.
See [Install and run InfluxDB 3 Explorer](/influxdb3/explorer/install/).
