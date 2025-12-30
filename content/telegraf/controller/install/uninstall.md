---
title: Uninstall Telegraf Controller
description: >
  Uninstall Telegraf Controller and remove all files associated with the
  application.
menu:
  telegraf_controller:
    name: Uninstall
    parent: Install Telegraf Controller
weight: 102
---

Uninstall Telegraf Controller and remove all files associated with the
application. This process depends on your operating system and installation
method.

{{< tabs-wrapper >}}
{{% tabs %}}
[Linux](#)
[macOS](#)
[Windows](#)
{{% /tabs %}}
{{% tab-content %}}
<!-------------------------- BEGIN LINUX -------------------------->

## Linux

To fully uninstall {{% product-name %}} from Linux:

1.  **Stop {{% product-name %}}**:

    - If running the application in place, stop the `telegraf_controller` process.
    - If you installed {{% product-name %}} as a systemd service stop and
      disable the service:

      ```bash
      sudo systemctl stop telegraf-controller
      sudo systemctl disable telegraf-controller
      ```

2.  **Remove all files associated with {{% product-name %}}**:

    ```bash
    # Remove the telegraf_controller executable
    sudo rm -rf /opt/telegraf-controller

    # Remove the telegraf_controller shared directory, which includes the
    # SQLite database if using SQLite
    rm -rf ~/.local/share/telegraf_controller

    # Remove the service file if you installed Telegraf Controller as a service
    sudo rm /etc/systemd/system/telegraf-controller.service
    ```

3.  If using PostgreSQL, **delete the `telegraf_controller` database** from your
    PostgreSQL instance:

    ```sql
    DROP DATABASE telegraf_controller;
    ```

<!--------------------------- END LINUX --------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------- BEGIN MACOS -------------------------->

## macOS

To fully uninstall {{% product-name %}} from macOS:

1.  **Stop {{% product-name %}}**:

    - If running the application in place, stop the `telegraf_controller` process.
    - If you installed {{% product-name %}} as a macOS LaunchDaemon and are
      running it as a service, stop the service:

      ```bash
      sudo launchctl unload /Library/LaunchDaemons/com.influxdata.telegraf-controller.plist
      ```

2.  **Remove all files associated with {{% product-name %}}**:

    ```bash
    # Remove the telegraf_controller executable
    sudo rm /usr/local/bin/telegraf_controller

    # Remove the telegraf_controller application directory, which includes the
    # SQLite database if using SQLite
    rm -rf ~/Library/Application\ Support/telegraf_controller

    # Remove the plist file if you installed Telegraf Controller as a LaunchDaemon
    sudo rm /Library/LaunchDaemons/com.influxdata.telegraf-controller.plist
    ```

3.  If using PostgreSQL, **delete the `telegraf_controller` database** from your
    PostgreSQL instance:

    ```sql
    DROP DATABASE telegraf_controller;
    ```

<!--------------------------- END MACOS --------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------- BEGIN WINDOWS -------------------------->

## Windows

To fully uninstall {{% product-name %}} from Windows:

1.  **Stop {{% product-name %}}**:

    - If running the application in place, stop the `telegraf_controller` process.
    - If you installed {{% product-name %}} as a service, stop and remove the
      service:

      ```bash
      nssm stop TelegrafController
      nssm remove TelegrafController confirm
      ```

2.  **Remove all files associated with {{% product-name %}}**:

    ```powershell
    # Remove the telegraf_controller executable and other related files,
    # including the SQLite database if using SQLite
    Remove-Item -Path "$env:LOCALAPPDATA\telegraf_controller" -Recurse
    Remove-Item -Path "C:\Program Files\TelegrafController" -Recurse
    ```

3.  If using PostgreSQL, **delete the `telegraf_controller` database** from your
    PostgreSQL instance:

    ```sql
    DROP DATABASE telegraf_controller;
    ```

<!--------------------------- END WINDOWS --------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}
