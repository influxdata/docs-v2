---
title: Use the integrated InfluxDB 3 Explorer UI
list_title: InfluxDB 3 Explorer
description: >
  Serve the InfluxDB 3 Explorer web UI directly from your
  InfluxDB 3 Enterprise server. Starting with v3.11, Explorer ships inside the
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
  - /influxdb3/enterprise/admin/explorer-ui/
  - /influxdb3/explorer/, InfluxDB 3 Explorer documentation
  - /influxdb3/explorer/install/, Install InfluxDB 3 Explorer
---

Starting with {{% product-name %}} v3.11, the
[InfluxDB 3 Explorer](/influxdb3/explorer/) web UI ships inside the Enterprise
binary as a [WebAssembly](https://webassembly.org/) (WASM) guest that the
server hosts in-process behind a
[WASI](https://wasi.dev/) sandbox.
You don't need to run the Explorer Docker container alongside InfluxDB.

Explorer isn't enabled by default.
To enable it and configure sign-in, sessions, and SSO, see
[Use the integrated Explorer UI](/influxdb3/enterprise/admin/explorer-ui/).
When it's enabled, the server serves Explorer at the root path of its regular
HTTP address and port--for example, <http://localhost:8181/>.

- [Check your version](#check-your-version)
- [Connect Explorer to your server](#connect-explorer-to-your-server)
- [Enable AI chat](#enable-ai-chat)
- [Choose between integrated and containerized Explorer](#choose-between-integrated-and-containerized-explorer)

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
See [Install and run InfluxDB 3 Explorer with Docker](/influxdb3/explorer/install/docker/).
