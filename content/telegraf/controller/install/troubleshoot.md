---
title: Troubleshoot Telegraf Controller installation
description: >
  Resolve common installation and startup issues with {{% product-name %}}.
menu:
  telegraf_controller:
    name: Troubleshoot installation 
    parent: Install Telegraf Controller
weight: 101
---

Resolve common installation and startup issues with {{% product-name %}}.
Check the symptoms below and apply the recommended fix before continuing with
configuration.

- [Port Already in Use](#port-already-in-use)
- [Permission Denied (Linux/macOS)](#permission-denied-linux-macos)
- [Database Connection Issues](#database-connection-issues)
- [Firewall Configuration](#firewall-configuration)
- [Security Considerations](#security-considerations)

## Port already in use

If the default ports (8888 and 8000) are already in use, use the following
configuration options to specify alternative ports:

| Description           | Environment Variable | Command Flag       |
| :-------------------- | -------------------- | ------------------ |
| Web Interface and API | `PORT`               | `--port`           |
| Heartbeat server      | `HEARTBEAT_PORT`     | `--heartbeat-port` |

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
PORT=3000
HEARTBEAT_PORT=3001

telegraf_controller
```

<!-------------------------- END LINUX/MACOS -------------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--------------------- BEGIN WINDOWS POWERSHELL ---------------------->

```powershell
$env:PORT=3000
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

## Firewall configuration

Ensure the following ports are open in your network Firewall configuration:

- **Web Interface and API**: TCP `8888` (or custom port)
- **Heartbeat server**: TCP `8000` (or custom heartbeat port)

## Security considerations

- **SSL/TLS**: Use `--ssl-cert` and `--ssl-key` options for production deployments
- **Firewall**: Restrict access to the web interface and heartbeat ports
- **Database Security**:
  - **PostgreSQL**: Use strong passwords
  - **SQLite**: Ensure the database file is protected with restricted permissions
    (`chmod 600`)
