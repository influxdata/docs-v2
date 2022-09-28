---
title: Run Telegraf as a Windows service
description: How to configure Telegraf as a Windows service using PowerShell.
menu:
  telegraf_1_20:
    name: Run as Windows service
    weight: 20
    parent: Administration
---

Telegraf natively supports running as a Windows service.

<!--
## Before you begin

The Telegraf "Windows Binaries" `.zip` download includes an executable and a configuration file.
To simplify upgrades, consider whether to:

- **Set up Windows symbolic link (Symlinks) to point to the Telegraf executable**.
  This option lets you easily roll back your upgrades, and maintain your custom configuration.
- **Use one or multiple Telegraf configurations**.
  You may want multiple configs if...
-->

## Download and run Telegraf as a Windows service

{{% note %}}
Installing a Windows service requires administrative permissions.
To run PowerShell as an administrator, 
see "[Launch PowerShell as administrator](https://docs.microsoft.com/en-us/powershell/scripting/windows-powershell/starting-windows-powershell?view=powershell-7#with-administrative-privileges-run-as-administrator)".
{{% /note %}}

In PowerShell _as an administrator_, do the following:

1.  Use the following commands to download the Telegraf Windows binary
    and extract its contents to `C:\Program Files\InfluxData\telegraf\`:

    ```powershell
    > wget https://dl.influxdata.com/telegraf/releases/telegraf-{{% latest-patch %}}_windows_amd64.zip -UseBasicParsing -OutFile telegraf-{{< latest-patch >}}_windows_amd64.zip
    > Expand-Archive .\telegraf-{{% latest-patch %}}_windows_amd64.zip -DestinationPath 'C:\Program Files\InfluxData\telegraf\'
    ```

2.  Move the `telegraf.exe` and `telegraf.conf` files from
    `C:\Program Files\InfluxData\telegraf\telegraf-{{% latest-patch %}}`
    up a level to `C:\Program Files\InfluxData\telegraf`:
   
    ```powershell
    > cd "C:\Program Files\InfluxData\telegraf"
    > mv .\telegraf-{{% latest-patch %}}\telegraf.* .
    ```
    
    Or create a [Windows symbolic link (Symlink)](https://blogs.windows.com/windowsdeveloper/2016/12/02/symlinks-windows-10/)
    to point to this directory.

    {{% note %}}
The instructions below assume that either the `telegraf.exe` and `telegraf.conf` files are stored in
`C:\Program Files\InfluxData\telegraf`, or you've created a Symlink to point to this directory.
    {{% /note %}}

3.  Install Telegraf as a service:

    ```powershell
    > .\telegraf.exe --service install --config "C:\Program Files\InfluxData\telegraf\telegraf.conf"
    ```

    Make sure to provide the absolute path of the `telegraf.conf` configuration file,
    otherwise the Windows service may fail to start.

3.  To test that the installation works, run:

    ```powershell
    > C:\"Program Files"\InfluxData\telegraf\telegraf.exe --config C:\"Program Files"\InfluxData\telegraf\telegraf.conf --test
    ```

4.  To start collecting data, run:

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

## Windows service commands

The following commands are available:

| Command                            | Effect                        |
|------------------------------------|-------------------------------|
| `telegraf.exe --service install`   | Install telegraf as a service |
| `telegraf.exe --service uninstall` | Remove the telegraf service   |
| `telegraf.exe --service start`     | Start the telegraf service    |
| `telegraf.exe --service stop`      | Stop the telegraf service     |
