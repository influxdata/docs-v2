---
title: Upgrade Telegraf Controller
seotitle: Upgrade Telegraf Controller
description: >
  Upgrade Telegraf Controller by replacing the executable and restarting the
  service. Telegraf Controller applies pending database migrations
  automatically at startup.
menu:
  telegraf_controller:
    name: Upgrade
    parent: Install Telegraf Controller
weight: 101
related:
  - /telegraf/controller/install/
  - /telegraf/controller/high-availability/
  - /telegraf/controller/reference/release-notes/
---

Upgrade {{% product-name %}} by replacing the `telegraf_controller`
executable with a newer version and restarting the service. On startup,
{{% product-name %}} applies any pending database migrations automatically;
there is no separate migration step.

Before you upgrade, review the
[release notes](/telegraf/controller/reference/release-notes/) for each
version between your current version and the target version.

- [Back up your database](#back-up-your-database)
- [Upgrade {{% product-name %}}](#upgrade-telegraf-controller)
- [Verify the upgrade](#verify-the-upgrade)
- [Upgrade a high-availability cluster](#upgrade-a-high-availability-cluster)

## Back up your database

Back up your database before upgrading so you can restore it if the upgrade
fails:

- **SQLite** (default): stop {{% product-name %}}, then copy the database
  file and, if present, its `-wal` and `-shm` companion files. For the
  default file locations, see
  [Default SQLite data locations](/telegraf/controller/install/#default-sqlite-data-locations).
- **PostgreSQL**: use your database or provider backup tooling, for example
  `pg_dump`.

## Upgrade {{% product-name %}}

1.  **Download the new {{% product-name %}} executable.**

    {{< telegraf/tc-downloads >}}

    > [!Important]
    > #### {{% product-name %}} executable name
    >
    > The downloaded {{% product-name %}} executable includes
    > platform-specific information in the file name. This documentation
    > assumes you rename the file to `telegraf_controller`, matching the
    > [install instructions](/telegraf/controller/install/#download-and-install-telegraf-controller).

2.  **Replace the installed executable and restart {{% product-name %}}.**

    {{< tabs-wrapper >}}
{{% tabs %}}
[Linux](#)
[macOS](#)
[Windows](#)
{{% /tabs %}}
{{% tab-content %}}
<!-------------------------------- BEGIN LINUX -------------------------------->

### Linux

#### Upgrade a systemd service installation

```bash
sudo systemctl stop telegraf-controller
sudo mv telegraf_controller /opt/telegraf-controller/telegraf_controller
sudo chmod +x /opt/telegraf-controller/telegraf_controller
sudo systemctl start telegraf-controller
```

If your service file uses a different working directory or executable path,
replace the executable at that location instead.

#### Upgrade an in-place installation

1.  Stop the running `telegraf_controller` process.
2.  Replace the existing executable with the new version and give it
    executable permissions:

    ```bash
    chmod +x telegraf_controller
    ```

3.  Restart {{% product-name %}}:

    ```sh
    ./telegraf_controller
    ```

<!--------------------------------- END LINUX --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------------- BEGIN MACOS -------------------------------->

### macOS

#### Prepare the downloaded executable

1.  Give `telegraf_controller` executable permissions:

    ```bash
    chmod +x telegraf_controller
    ```

2.  Remove the macOS quarantine attribute (if downloaded via browser):

    ```bash
    xattr -d com.apple.quarantine telegraf_controller
    ```

#### Upgrade a LaunchDaemon installation

```bash
sudo launchctl unload /Library/LaunchDaemons/com.influxdata.telegraf-controller.plist
sudo mv telegraf_controller /usr/local/bin/
sudo launchctl load /Library/LaunchDaemons/com.influxdata.telegraf-controller.plist
```

#### Upgrade an in-place installation {#macos-in-place}

1.  Stop the running `telegraf_controller` process.
2.  Replace the existing executable with the new, prepared executable.
3.  Restart {{% product-name %}}:

    ```bash
    ./telegraf_controller
    ```

<!--------------------------------- END MACOS --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN WINDOWS ------------------------------->

### Windows

#### Upgrade a Windows service installation

In **Command Prompt or PowerShell**:

```powershell
nssm stop TelegrafController
Move-Item -Force telegraf_controller.exe "C:\Program Files\TelegrafController\telegraf_controller.exe"
nssm start TelegrafController
```

#### Upgrade an in-place installation {#windows-in-place}

1.  Close the running {{% product-name %}} application.
2.  Replace the existing `telegraf_controller.exe` with the new version.
3.  Restart {{% product-name %}}:

    ```powershell
    ./telegraf_controller.exe
    ```

<!-------------------------------- END WINDOWS -------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Verify the upgrade

1.  Confirm the installed executable reports the new version:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux/macOS](#)
[Windows (PowerShell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash
telegraf_controller --version
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```powershell
./telegraf_controller.exe --version
```

{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    The running version is also displayed in the {{% product-name %}} web
    interface, at the bottom of the navigation menu.

2.  Confirm the service is running, the web interface loads, and agents
    continue to report.

If {{% product-name %}} fails to start after an upgrade, check the service
logs for migration errors and see
[Troubleshoot installation](/telegraf/controller/install/troubleshoot/).

## Upgrade a high-availability cluster

Upgrade a [high-availability](/telegraf/controller/high-availability/)
cluster by upgrading one node at a time. The cluster keeps serving
throughout: when you stop a node, any leadership it holds transfers to a
standby within a few seconds, and the remaining nodes continue to accept
agent heartbeats and serve the web interface and API.

> [!Important]
> #### Some releases require a full-cluster upgrade
>
> If a release is not compatible with earlier versions running against the
> upgraded database, the release notes call it out. For those releases,
> stop all nodes, replace the executable on each, and then start the nodes
> one at a time instead of upgrading node by node.

1.  On one node, stop {{% product-name %}}, replace the executable, and
    restart it, following the [steps above](#upgrade-telegraf-controller).
2.  Wait for the node to report healthy through your load balancer's
    [health checks](/telegraf/controller/high-availability/load-balancing/),
    and confirm the new version with `telegraf_controller --version`.
3.  Repeat for each remaining node.

During a rolling upgrade:

- The first upgraded node applies any pending database migrations at
  startup. Migrations run under a cluster-wide lock, so nodes never run
  migrations concurrently; a node that starts while another is migrating
  waits for it to finish.
- Until every node is upgraded, the cluster runs mixed versions. Complete
  the roll promptly rather than leaving nodes on different versions.
