---
title: Troubleshoot Telegraf Controller installation
description: >
  Resolve common installation and startup issues with {{% product-name %}}.
menu:
  telegraf_controller:
    name: Troubleshoot installation 
    parent: Install Telegraf Controller
weight: 102
related:
  - /telegraf/controller/reference/config-options/
---

Resolve common installation and startup issues with {{% product-name %}}.
Check the symptoms below and apply the recommended fix before continuing with
configuration.

- [Port Already in Use](#port-already-in-use)
- [Permission Denied (Linux/macOS)](#permission-denied-linuxmacos)
- [Database Connection Issues](#database-connection-issues)
- [Agent heartbeats return 401 Invalid token](#agent-heartbeats-return-401-invalid-token)
- [Firewall Configuration](#firewall-configuration)
- [Security Considerations](#security-considerations)

## Port already in use

If the default ports (8888 and 8000) are already in use, use the following
configuration options to specify alternative ports:

| Description           | Environment Variable | Command Flag       |
| :-------------------- | -------------------- | ------------------ |
| Web Interface and API | `APP_PORT`           | `--port`           |
| Web Interface (separate port) | `UI_PORT`    | `--ui-port`        |
| Heartbeat server      | `HEARTBEAT_PORT`     | `--heartbeat-port` |

_For more information, see the
[General section of the configuration options reference](/telegraf/controller/reference/config-options/#general)._

{{< tabs-wrapper >}}
{{% tabs "medium" %}}
[Use Environment Variables](#)
[Use Command Flags](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------ BEGIN ENVIRONMENT VARIABLES ------------------------>

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux/macOS](#)
[Windows (Powershell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!------------------------- BEGIN LINUX/MACOS ------------------------->

```sh
APP_PORT=3000
HEARTBEAT_PORT=3001

telegraf_controller
```

<!-------------------------- END LINUX/MACOS -------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--------------------- BEGIN WINDOWS POWERSHELL ---------------------->

```powershell
$env:APP_PORT=3000
$env:HEARTBEAT_PORT=3001

./telegraf_controller.exe
```

<!---------------------- END WINDOWS POWERSHELL ----------------------->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

<!------------------------- END ENVIRONMENT VARIABLES ------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN COMMAND FLAGS ---------------------------->

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux/macOS](#)
[Windows (Powershell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!------------------------- BEGIN LINUX/MACOS ------------------------->

```sh
telegraf_controller --port=3000 --heartbeat-port=3001
```

<!-------------------------- END LINUX/MACOS -------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--------------------- BEGIN WINDOWS POWERSHELL ---------------------->

```powershell
./telegraf_controller.exe --port=3000 --heartbeat-port=3001
```

<!---------------------- END WINDOWS POWERSHELL ----------------------->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

<!----------------------------- END COMMAND FLAGS ----------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Permission denied (Linux/macOS)

If you do not have permission to run the `telegraf_controller` executable,
ensure the file has executable permissions:

```sh
chmod +x telegraf_controller
```

### macOS: Remove the quarantine attribute

macOS places a quarantine attribute on executable files downloaded from a
browser and restricts file execution. To remove the quarantine attribute, use
**Terminal** or **System Settings**.

#### Remove the quarantine attribute in Terminal

```bash
xattr -d com.apple.quarantine telegraf_controller
```

#### Remove the quarantine attribute in System Settings

1. Attempt to run the `telegraf_controller` executable.
2. In macOS, navigate to **System Settings** > **Privacy & Security**.
3. Scroll to the bottom of the window.
4. Next to the message about {{% product-name %}}, click **Allow**.

## Database connection issues

If there are database connection issues, check the following depending on which
database you're using:

### SQLite

- Check file permissions for SQLite database directory

### PostgreSQL

- Ensure PostgreSQL is running
- Check the format of and credentials in your data source name (DSN or database URL)
- Verify network connectivity
- If the service logs `error performing TLS handshake`, the PostgreSQL server's
  certificate is not trusted. See
  [Agent heartbeats return 401 Invalid token](#agent-heartbeats-return-401-invalid-token).

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

## Firewall configuration

Ensure the following ports are open in your network Firewall configuration:

- **Web Interface and API**: TCP `8888` (or custom port)
- **Web Interface (separate port)**: the
  [`ui-port`](/telegraf/controller/reference/config-options/#ui-port) value, if
  configured
- **Heartbeat server**: TCP `8000` (or custom heartbeat port)

## Security considerations

- **SSL/TLS**: Set the [`SSL_CERT_PATH` and `SSL_KEY_PATH`](/telegraf/controller/reference/config-options/#tls)
  environment variables for production deployments. If agents log
  `x509: certificate signed by unknown authority`, they do not trust the
  certificate. See
  [Secure {{% product-name %}} with TLS](/telegraf/controller/install/secure-tls/#trust-the-certificate-on-each-agent).
- **Firewall**: Restrict access to the web interface and heartbeat ports
- **Database Security**:
  - **PostgreSQL**: Use strong passwords
  - **SQLite**: Ensure the database file is protected with restricted permissions
    (`chmod 600`)
