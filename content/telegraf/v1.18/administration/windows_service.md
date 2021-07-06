---
title: Running Telegraf as a Windows service
description: How to configure Telegraf as a Windows service using PowerShell.
menu:
  telegraf_1_18:
    name: Running as Windows service
    weight: 20
    parent: Administration
---

Telegraf natively supports running as a Windows service.

{{% note %}}
Installing a Windows service requires administrative permissions.
See "[Launch PowerShell as administrator](https://docs.microsoft.com/en-us/powershell/scripting/windows-powershell/starting-windows-powershell?view=powershell-7#with-administrative-privileges-run-as-administrator)".
{{% /note %}}

<!--
## Before you begin

The Telegraf "Windows Binaries" `.zip` download includes an executable and a configuration file.
To simplify upgrades, consider whether to:

- **Set up Windows symbolic link (Symlinks) to point to the Telegraf executable**.
  This option lets you easily roll back your upgrades, and maintain your custom configuration.
- **Use one or multiple Telegraf configurations**.
  You may want multiple configs if...
-->

## Download and run as a Windows service

1. Follow instructions on the [Downloads page](https://portal.influxdata.com/downloads/)
   to download `telegraf-{{< latest-patch >}}_windows_amd64.zip`.

2. Move files from the specified Telegraf version up a level to `C:\Program Files\InfluxData\telegraf`
   or create a Windows symbolic link (Symlink) to point to this directory.

   {{% note %}}
The instructions below assume Telegraf files are stored in `C:\Program Files\InfluxData\telegraf`
or you've created a Symlink to point to this directory.
   {{% /note %}}

2. In PowerShell, run the following as an administrator:
   ```powershell
   > cd "C:\Program Files\InfluxData\telegraf"
   > .\telegraf.exe --service install --config "C:\Program Files\InfluxData\telegraf\telegraf.conf"
   ```
   When installing Telegraf as a Windows service, provide the absolute path of the Telegraf configuration file.
   Otherwise the Windows service may fail to start.
3. To test that the installation works, run:

   ```powershell
   > C:\"Program Files"\InfluxData\telegraf\telegraf.exe --config C:\"Program Files"\InfluxData\telegraf\telegraf.conf --test
   ```

4. To start collecting data, run:

   ```powershell
   telegraf.exe --service start
   ```

<!--
#### (Optional) Specify multiple configuration files

If you have multiple Telegraf configuration files, you can specify a `--config-directory` for the service to use:

1. Create a directory for configuration snippets at `C:\Program Files\Telegraf\telegraf.d`.
2. Include the `--config-directory` option when registering the service:
   ```powershell
   > C:\"Program Files"\Telegraf\telegraf.exe --service install --config C:\"Program Files"\Telegraf\telegraf.conf --config-directory C:\"Program Files"\Telegraf\telegraf.d
   ```
-->

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
