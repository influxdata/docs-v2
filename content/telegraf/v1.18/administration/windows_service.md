---
title: Running Telegraf as a Windows service
description: How to configure Telegraf as a Windows service using PowerShell.
menu:
  telegraf_1_18:
    name: Running as Windows service
    weight: 20
    parent: Administration
---

Telegraf natively supports running as a Windows service. Complete the following steps:

1. Review considerations [before you begin](#before-you-begin)
2. [Download and run as service](#download-and-run-as-service)

{{% note %}}
Installing a Windows service requires administrative permissions. [Launch PowerShell as administrator](
https://docs.microsoft.com/en-us/powershell/scripting/windows-powershell/starting-windows-powershell?view=powershell-7#with-administrative-privileges-run-as-administrator).
{{% /note %}}

## Before you begin

The Telegraf installation includes an executable and configuration file. To simplify upgrades, consider the following:

- Whether you want multiple Telegraf configurations. You may want multiple configs if...
- Setting up Windows symbolic link to update the executable only (maintaining your custom configuration)

## Download and run as service

1. Follow instructions on the [Downloads page](https://portal.influxdata.com/downloads/) to download Telegraf to `C:\Program Files\InfluxData\telegraf\telegraf-<version>`, and then create a Windows symbolic link to the latest version `C:\Program Files\InfluxData\telegraf.`
2. In PowerShell, run the following as an administrator:
   ```powershell
   > cd "C:\Program Files\InfluxData\telegraf"
   > .\telegraf.exe --service install --config "C:\Program Files\InfluxData\telegraf\telegraf.conf"
   ```
   When installing Telegraf as a Windows service, provide the absolute path of the Telegraf configuration file. Otherwise the Windows service may fail to start.
3. To test that the installation works, run:

   ```powershell
   > C:\"Program Files"\InfluxData\telegraf\telegraf.exe --config C:\"Program Files"\InfluxData\telegraf\telegraf.conf --test
   ```

4. To start collecting data, run:

   ```powershell
   telegraf.exe --service start
   ```

#### (Optional) Specify multiple configuration files

If you have multiple Telegraf configuration files, you can specify a `--config-directory` for the service to use:

1. Create a directory for configuration snippets: `C:\Program Files\Telegraf\telegraf.d`
2. Include the `--config-directory` option when registering the service:
   ```
   > C:\"Program Files"\Telegraf\telegraf.exe --service install --config C:\"Program Files"\Telegraf\telegraf.conf --config-directory C:\"Program Files"\Telegraf\telegraf.d
   ```
## Logging and troubleshooting

When Telegraf runs as a Windows service, Telegraf logs messages to Windows event logs.
If the Telegraf service fails to start, view error logs by selecting **Event Viewer**→**Windows Logs**→**Application**.

The following commands are available:

| Command                            | Effect                        |
|------------------------------------|-------------------------------|
| `telegraf.exe --service install`   | Install telegraf as a service |
| `telegraf.exe --service uninstall` | Remove the telegraf service   |
| `telegraf.exe --service start`     | Start the telegraf service    |
| `telegraf.exe --service stop`      | Stop the telegraf service     |
