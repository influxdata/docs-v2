---
title: Running Telegraf as a Windows service
description: How to configure Telegraf as a Windows service.
menu:
  telegraf_1_12:
    name: Running as Windows service
    weight: 20
    parent: Administration
---

# Running Telegraf as a Windows service

Telegraf natively supports running as a Windows service. Outlined below are
the general steps to set it up.

1. Obtain the Telegraf distribution for Windows.
2. Create the directory `C:\Program Files\Telegraf` (if you install in a different location, specify the `-config` parameter with the desired location)
3. Place the `telegraf.exe` and the `telegraf.conf` files into `C:\Program Files\Telegraf`.
4. To install the service into the Windows Service Manager, run the following in PowerShell as an administrator. If necessary, you can wrap any spaces in the file directories in double quotes `"<file directory>"`:

   ```
   > C:\"Program Files"\Telegraf\telegraf.exe --service install
   ```

5. Edit the configuration file to meet your requirements.

6. To verify that it works, run:

   ```
   > C:\"Program Files"\Telegraf\telegraf.exe --config C:\"Program Files"\Telegraf\telegraf.conf --test
   ```

7. To start collecting data, run:

   ```
   > net start telegraf
   ```

## Other supported operations

Telegraf can manage its own service through the `--service` flag:

| Command                            | Effect                        |
|------------------------------------|-------------------------------|
| `telegraf.exe --service install`   | Install telegraf as a service |
| `telegraf.exe --service uninstall` | Remove the telegraf service   |
| `telegraf.exe --service start`     | Start the telegraf service    |
| `telegraf.exe --service stop`      | Stop the telegraf service     |
