---
title: Troubleshoot agent heartbeats and tokens
list_title: Agent heartbeats and tokens
description: >
  Diagnose rejected Telegraf agent heartbeats, including 401 Invalid token
  responses caused by token cache and database TLS failures, and agents
  that do not trust the server certificate.
menu:
  telegraf_controller:
    name: Agent heartbeats and tokens
    parent: Troubleshoot
weight: 202
related:
  - /telegraf/controller/tokens/use/
  - /telegraf/controller/admin/secure-tls/
  - /telegraf/controller/reference/config-options/
---

Diagnose problems between Telegraf agents and {{% product-name %}}:
heartbeats rejected with `401 Invalid token` and agents that do not trust
the server's TLS certificate.

- [Agent heartbeats return 401 Invalid token](#agent-heartbeats-return-401-invalid-token)
  - [Check the token cache logs](#check-the-token-cache-logs)
  - [Provide the database CA certificate](#provide-the-database-ca-certificate)
  - [Other causes of heartbeat 401 responses](#other-causes-of-heartbeat-401-responses)
- [Agents do not trust the server certificate](#agents-do-not-trust-the-server-certificate)

## Agent heartbeats return 401 Invalid token

If every agent heartbeat fails with a `401` response and an `Invalid token`
error, but the same token authenticates successfully with the web interface
and the REST API, the heartbeat service usually cannot read tokens from the
database.

{{% product-name %}} validates heartbeat tokens separately from API requests.
The embedded heartbeat service maintains its own database connection and
checks each token against an in-memory cache loaded from the database. If that
connection fails (for example, the PostgreSQL TLS handshake fails because the
server certificate is signed by a private CA), the cache stays empty and the
heartbeat service rejects every token with `Invalid token`. The web interface
and API keep working because they use a separate database connection.
The cache refreshes automatically when tokens change and reloads when the
service starts.

### Check the token cache logs

Search the service logs for token cache and TLS errors. For example, with
systemd:

```sh
journalctl -u telegraf-controller | grep -iE "token cache|tls handshake"
```

A failing service logs errors like the following:

```text
Failed to refresh token cache: ...
Pool error: Error occurred while creating a new object: error performing TLS handshake
```

A healthy service logs the number of tokens loaded:

```text
Token cache refreshed: 5 tokens loaded
```

If the cache refresh fails, continue to the next step.
If the refresh succeeds but reports `0 tokens loaded`, no active tokens exist
in the database; [create a new token](/telegraf/controller/tokens/create/) or
check that existing tokens are not revoked.

### Provide the database CA certificate

`error performing TLS handshake` means {{% product-name %}} does not trust the
certificate presented by the PostgreSQL server. Certificate verification uses
a bundled set of public root certificates (the Mozilla root store), so
certificates issued by a private CA, including Amazon RDS, fail verification
until you provide the CA certificate:

1. Download the CA certificate for your PostgreSQL server. For example, for
   Amazon RDS:

   ```sh
   wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
     -O /opt/telegraf-controller/rds-global-bundle.pem
   ```

2. Point {{% product-name %}} at the CA certificate using the
   [`DATABASE_CA_CERT` or `PGSSLROOTCERT`](/telegraf/controller/reference/config-options/#database-ca-cert)
   environment variable, or the
   [`sslrootcert`](/telegraf/controller/reference/config-options/#sslrootcert)
   parameter in the database URL:

   ```sh
   DATABASE_CA_CERT=/opt/telegraf-controller/rds-global-bundle.pem
   ```

3. Restart the service and confirm the logs show
   `Token cache refreshed: N tokens loaded` with a nonzero count.

> [!Note]
> #### Temporarily connect without verification
>
> To confirm the diagnosis, or to restore service while you obtain the CA
> certificate, you can encrypt the connection without verifying the server
> certificate: set
> [`sslmode=require`](/telegraf/controller/reference/config-options/#sslmode)
> in the database URL, or set
> [`DATABASE_SSL_NO_VERIFY=1`](/telegraf/controller/reference/config-options/#database-ssl-no-verify).
> Use these options for troubleshooting only; provide a CA certificate for
> production deployments.

### Other causes of heartbeat 401 responses

The heartbeat endpoint returns a distinct error message for each failure mode:

- **`Missing or invalid Authorization header`**: the request has no
  `Authorization` header, or the header does not use the `Bearer <token>` or
  `Token <token>` scheme.
- **`Invalid token format`**: the token does not start with the `tc-apiv1_`
  prefix. Check for truncation or quoting issues in the agent configuration.
- **`Invalid token`**: the token is not in the token cache. Either the token
  was [revoked](/telegraf/controller/tokens/revoke/) or deleted, or the cache
  failed to load (see above).
- **`Token expired`**: the token is past its expiration date. Create a new
  token and update the agent configuration.

For how agents send tokens with heartbeat requests, see
[Use API tokens](/telegraf/controller/tokens/use/#for-heartbeat-requests).

## Agents do not trust the server certificate

If {{% product-name %}} serves HTTPS and agents log
`x509: certificate signed by unknown authority`, the agents do not trust the
certificate authority that signed the server's certificate, so they fail to
fetch configurations or send heartbeats.
Install the CA certificate on each agent host.
See
[Trust the certificate on each agent](/telegraf/controller/admin/secure-tls/#trust-the-certificate-on-each-agent).
