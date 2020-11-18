---
title: Use the Flux VS Code extension
seotitle: Use the Flux Visual Studio Code extension
description: >
  placeholder
menu:
  influxdb_2_0:
    name: Use Flux VS Code extension
    parent: Tools & integrations
---

The Flux Visual Studio Code (VS Code) extension...

- Syntax highlighting
- Autocompletion
- InfluxDB server integration
- Run flux scripts natively and show results
- Environment-specific autocompletion (bucket names, etc)
- Error highlighting
- Find references
- Go to definition
- Function signatures
- Code folding
- Symbol renaming
- Document symbols


Other notes

- Enable Flux in 1.x

## Install the Flux VS Code extension
Install the Flux VS Code extension from the
[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=influxdata.flux).

## Connect to InfluxDB
Create an InfluxDB Connection.

1. Open the **VS Code Command Pallet** ({{< keybind mac="⇧⌘P" other="Ctrl+Shift+P" >}}).
2. Run `influxdb.addConnection`.
3. Provide the required connection credentials:
    - **Type:** type of InfluxDB data source (v1 or v2). If connecting to **InfluxDB Cloud**, select **InfluxDB v2**.
    - **Name:** unique identifier for your InfluxDB connection.
    - **Hostname and Port:** InfluxDB host and port (See [InfluxDB OSS URLs](/influxdb/v2.0/reference/urls/) or [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/))
    - **Token:** InfluxDB [authentication token](/influxdb/v2.0/security/tokens/) _(Only required for InfluxDB v2 connections)_
    - **Organization:** InfluxDB organization _(Only required for InfluxDB v2 connections)_
4. Click **Test** to test the connection.
5. Once tested successfully, click **Save**.

## Query InfluxDB from VS Code
1. Write your Flux query in a new VS Code file.
2. Save your Flux script with the `.flux` extension or set the VS Code Language Mode to "Flux."
3. Execute the query with the `influxdb.runQuery` command or {{< keybind mac="⌃⌥E" other="Ctrl+Alt+E" >}}.
4. Query results appear in a new tab. If query results do not appear, see [Debug Flux queries](#debug-flux-queries)

## Debug Flux queries
To view errors returned from Flux script executions, click the **Errors and Warnings**
icons in the bottom left of your VS Code window, and then select the **Output** tab in the debugging pane.

{{< img-hd src="/img/influxdb/2-0-tools-vsflux-errors-warnings.png" alt="VS Code errors and warnings"/>}}

## Explore your schema
With InfluxDB connections configured, VS Code provides an

## Upgrade the Flux extension
VS Code auto-updates by default extensions, but you are able to disable auto-update.
If auto-update is disabled, [manually update your VS Code Flux extension](https://code.visualstudio.com/docs/editor/extension-gallery#_update-an-extension-manually).
After updating the extension, reload VS Code to initialize the updated extensions.

## Commands

| Command                     | Description       | Keyboard shortcut | Menu context      |
|:-------                     |:-----------       |:-----------------:| ------------:     |
| `influxdb.refresh`          | Refresh           |                   |                   |
| `influxdb.addConnection`    | Add Connection    |                   | view/title        |
| `influxdb.runQuery`         | Run Query         | {{< keybind mac="⌃⌥E" other="Ctrl+Alt+E" >}} | editor/context    |
| `influxdb.removeConnection` | Remove Connection |                   | view/item/context |
| `influxdb.switchConnection` | Switch Connection |                   |                   |
| `influxdb.editConnection`   | Edit Connection   |                   | view/item/context |