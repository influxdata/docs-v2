---
title: Troubleshoot installation and startup
list_title: Installation and startup
description: >
  Resolve Telegraf Controller installation and startup problems: port
  conflicts, permission errors, the macOS quarantine attribute, and
  unreachable ports.
menu:
  telegraf_controller:
    name: Installation and startup
    parent: Troubleshoot
weight: 201
related:
  - /telegraf/controller/install/
  - /telegraf/controller/admin/networking/
  - /telegraf/controller/reference/config-options/
---

Resolve problems that keep {{% product-name %}} from starting or from being
reached after installation.

- [Port already in use](#port-already-in-use)
- [Permission denied (Linux/macOS)](#permission-denied-linuxmacos)
- [Ports are not reachable](#ports-are-not-reachable)

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

## Ports are not reachable

If the server starts but browsers or agents cannot connect, make sure your
firewall allows the ports {{% product-name %}} listens on:

- **Web interface and API**: TCP `8888` (or custom port)
- **Web interface (separate port)**: the
  [`ui-port`](/telegraf/controller/reference/config-options/#ui-port) value, if
  configured
- **Heartbeat server**: TCP `8000` (or custom heartbeat port)

For which clients need access to each port and how to expose them safely, see
[Networking and ports](/telegraf/controller/admin/networking/).
