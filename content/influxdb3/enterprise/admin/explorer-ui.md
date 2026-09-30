---
title: Use the integrated Explorer UI
seotitle: Use the integrated InfluxDB 3 Explorer UI in InfluxDB 3 Enterprise
description: >
  Enable the Explorer UI embedded in {{% product-name %}}: quick start
  without authentication, sign in with multi-user authentication, configure
  SSO, and understand sessions and default connections.
menu:
  influxdb3_enterprise:
    name: Use the Explorer UI
    parent: Administer InfluxDB
weight: 208
related:
  - /influxdb3/explorer/
  - /influxdb3/enterprise/admin/security/manage-users/
  - /influxdb3/enterprise/reference/internals/rbac/
  - /influxdb3/enterprise/admin/tokens/
  - /influxdb3/enterprise/reference/config-options/
---

<!-- GA status per 3.12 product release notes; confirm with product before publishing. -->

{{% product-name %}} embeds
<!-- NEEDS VERIFICATION: confirm the exact bundled Explorer version before publishing. -->
InfluxDB 3 Explorer 1.11 and serves it directly from the server process.
You don't need to run a separate
[standalone Explorer](/influxdb3/explorer/) deployment to get a query and
dashboarding UI.

- [Enable the Explorer UI](#enable-the-explorer-ui)
- [Quick start without authentication](#quick-start-without-authentication)
- [Quick start with user authentication](#quick-start-with-user-authentication)
- [Default connections and query routing](#default-connections-and-query-routing)
- [Configure SSO for the Explorer UI](#configure-sso-for-the-explorer-ui)
- [Sessions](#sessions)
- [Explorer application data](#explorer-application-data)
- [Migrate data from the 3.11 UI](#migrate-data-from-the-311-ui)

## Enable the Explorer UI

Include `webui` in `--mode` and set
[`--webui-session-secret`](/influxdb3/enterprise/reference/config-options/#webui-session-secret):

```bash { placeholders="WEBUI_SESSION_SECRET" }
influxdb3 serve --mode all,webui --webui-session-secret WEBUI_SESSION_SECRET
```

Replace {{% code-placeholder-key %}}`WEBUI_SESSION_SECRET`{{% /code-placeholder-key %}}
with a unique secret. Every node in the cluster that runs `webui` mode must
share the same session secret so a browser session stays valid across nodes.

`--mode` accepts `webui` alongside any other mode
(for example, `all,webui`, `query,webui`, or `webui` by itself).
A node that doesn't include `webui` in `--mode` doesn't serve the UI.

The server serves Explorer at the root path of its regular HTTP address and
port--for example, <http://localhost:8181/>.
Explorer doesn't use a separate port.

Explorer runs without a plugin directory.
To use the plugin features in Explorer, create a directory and pass it to
[`--plugin-dir`](/influxdb3/enterprise/reference/config-options/#plugin-dir).

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

## Quick start without authentication

To try Explorer without setting up user authentication, start the server
with `--without-auth`:

```bash
influxdb3 serve --mode all,webui \
  --webui-session-secret local-dev-only \
  --without-auth
```

Explorer configures a working default connection automatically, so you can
open the UI and start querying immediately.

## Quick start with user authentication

When you start with
[`--user-auth-type`](/influxdb3/enterprise/reference/config-options/#user-auth-type)
set and the cluster has no users and no operator token yet, Explorer
shows a setup page ("Set up InfluxDB 3 Explorer") instead of the normal UI.

If the cluster already has an operator token (for example, an existing
deployment that used token authentication), the setup page isn't offered
and `influxdb3 manage init-admin` returns `409 operator token already
configured`. Create the first admin user with the operator token instead:

```bash { placeholders="USERNAME|OPERATOR_TOKEN" }
influxdb3 create user --username USERNAME --role Admin --token OPERATOR_TOKEN
```

- If password sign-in is available (`--jwt-key-id` and `--jwt-private-key`
  are set), the setup page lets you create the first admin user directly in
  the browser and shows the operator token once. Store it securely: it can't
  be retrieved again.
- If only OAuth sign-in is configured (`--user-auth-type oauth` without JWT
  keys), the setup page can't take a password, so it directs you to create
  the first admin from the CLI instead:

  ```bash { placeholders="OAUTH_SUBJECT" }
  influxdb3 manage init-admin --oauth-id OAUTH_SUBJECT
  ```

  Then sign in through your identity provider.

See
[Bootstrap the initial admin](/influxdb3/enterprise/admin/security/manage-users/#bootstrap-the-initial-admin)
for the equivalent CLI-only workflow.

After you sign in, Explorer configures the default connection for you.

## Default connections and query routing

Explorer always needs a default connection (a server URL and API token) to
query data. How that connection gets configured depends on how you start the
server:

- **`--without-auth`**: Explorer configures a working default connection
  automatically, without a token.
- **User authentication enabled** (`--user-auth-type basic` and/or `oauth`):
  Explorer configures the default connection for you after you sign in.
- **`apiv3_` token authentication only** (the default: no `--without-auth`
  and no `--user-auth-type`): Explorer has no way to obtain a token
  automatically, so you provide a server URL and
  {{% token-link %}} yourself the first time you connect.

The node that serves the Explorer UI doesn't have to be the node that
serves queries or writes:

- Every node that serves the UI forwards Explorer's default-connection
  requests over the internode protocol to a running node in the cluster,
  round-robin: a query-capable node for reads, and an ingest-capable node
  for writes. Only nodes that advertise an internode address
  (`--internode-bind-addr` or
  [`--conn-info`](/influxdb3/enterprise/reference/config-options/#conn-info))
  are used, and the serving node counts as a candidate if it advertises one.
- If no such node is available, a serving node that itself runs `query` or
  `ingest` mode (for example, a single `all,webui` node) handles the request
  locally.
- Sign-in and user-management requests are always handled by the node that
  serves the UI.

## Configure SSO for the Explorer UI

For browser-based single sign-on through the Explorer UI (as opposed to
CLI OAuth login), set
[`--webui-public-uri`](/influxdb3/enterprise/reference/config-options/#webui-public-uri)
together with `--oauth-client-id`, `--oauth-issuer`, and `--oauth-audience`:

```bash { placeholders="WEBUI_PUBLIC_URI|OAUTH_CLIENT_ID" }
influxdb3 serve --mode all,webui \
  --webui-session-secret my-secret \
  --user-auth-type oauth \
  --oauth-issuer https://my-idp.example.com/ \
  --oauth-audience my-audience \
  --oauth-client-id OAUTH_CLIENT_ID \
  --webui-public-uri WEBUI_PUBLIC_URI
```

Replace {{% code-placeholder-key %}}`WEBUI_PUBLIC_URI`{{% /code-placeholder-key %}}
with the browser-reachable base URL of the Explorer UI (for example,
`https://explorer.example.com`), and
{{% code-placeholder-key %}}`OAUTH_CLIENT_ID`{{% /code-placeholder-key %}}
with your identity provider's OAuth client ID.

{{% product-name %}} derives the OAuth callback URL as
`WEBUI_PUBLIC_URI/auth/callback`. Register that exact URL with your
identity provider as an allowed redirect URI.

See
[Authenticate with OAuth/OIDC](/influxdb3/enterprise/admin/security/manage-users/#optional-authenticate-with-oauthoidc)
for the other OAuth flags.

## Sessions

Explorer stores browser sessions server-side.
Sessions last 120 days.

Changing `--webui-session-secret` invalidates every existing session and
signs all users out.
Rotate the secret only when you intend to force everyone to sign in again.

To manage the session secret:

- **Generate the secret once and reuse it.**
  To generate a secret, run `openssl rand -base64 24`.
- **Keep the secret out of your shell history and process list.**
  Set the secret through the `INFLUXDB3_WEBUI_SESSION_SECRET` environment
  variable instead of the command line when you can.
- **Rotate the secret when it may have been exposed.**

## Explorer application data

The integrated Explorer keeps its application state in a SQLite database that
the server synchronizes to object storage for each cluster.
You don't mount a volume to persist it, which is the main operational
difference from the
[Explorer Docker container](/influxdb3/explorer/install/#persist-data-across-restarts).

## Migrate data from the 3.11 UI

If a browser has data from before you turned on user authentication (for
example, from the integrated Explorer in InfluxDB 3.11, or from using
Explorer on this deployment without authentication), Explorer offers to migrate that browser's dashboards, saved
queries, query history, and connections to your signed-in account the first
time you sign in from that browser.

You can accept or decline the offer. Either way, {{% product-name %}} keeps
the original data. Declining doesn't delete anything, and you won't be
asked again from that browser. If you accept, connection credentials (API
tokens and object-storage credentials) are cleared from the migrated
connections, so you need to re-enter them.
