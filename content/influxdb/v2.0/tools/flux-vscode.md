---
title: Use the Flux VS Code extension
seotitle: Use the Flux Visual Studio Code extension
description: >
  The [Flux Visual Studio Code (VS Code) extension](https://marketplace.visualstudio.com/items?itemName=influxdata.flux)
  provides Flux syntax highlighting, autocompletion, and a direct InfluxDB OSS server
  integration that lets you run Flux scripts natively and show results in VS Code.
weight: 103
menu:
  influxdb_2_0:
    name: Use the Flux VS Code extension
    parent: Tools & integrations
---

The [Flux Visual Studio Code (VS Code) extension](https://marketplace.visualstudio.com/items?itemName=influxdata.flux)
provides Flux syntax highlighting, autocompletion, and a direct InfluxDB server
integration that lets you run Flux scripts natively and show results in VS Code.

- [Install the Flux VS Code extension](#install-the-flux-vs-code-extension)
- [Connect to InfluxDB](#connect-to-influxdb)
- [Query InfluxDB from VS Code](#query-influxdb-from-vs-code)
- [Explore your schema](#explore-your-schema)
- [Debug Flux queries](#debug-flux-queries)
- [Upgrade the Flux extension](#upgrade-the-flux-extension)
- [Flux extension commands](#flux-extension-commands)

## Install the Flux VS Code extension
The Flux VS Code extension is available in the **Visual Studio Marketplace**.
For information about installing extensions from the Visual Studio marketplace,
see the [Extension Marketplace documentation](https://code.visualstudio.com/docs/editor/extension-gallery).

## Connect to InfluxDB
To create an InfluxDB Connection in VS Code:

1. Open the **VS Code Command Pallet** ({{< keybind mac="⇧⌘P" other="Ctrl+Shift+P" >}}).
2. Run `influxdb.addConnection`.
3. Provide the required connection credentials:
    - **Type:** type of InfluxDB data source. Select **InfluxDB v2**.
    - **Name:** unique identifier for your InfluxDB connection.
    - **Hostname and Port:** InfluxDB host and port
      (see [InfluxDB OSS URLs](/influxdb/v2.0/reference/urls/) or [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/)).
    - **Token:** InfluxDB [authentication token](/influxdb/v2.0/security/tokens/).
    - **Organization:** InfluxDB organization name.
4. Click **Test** to test the connection.
5. Once tested successfully, click **Save**.

## Query InfluxDB from VS Code
1. Write your Flux query in a new VS Code file.
2. Save your Flux script with the `.flux` extension or set the
   [VS Code Language Mode](https://code.visualstudio.com/docs/languages/overview#_changing-the-language-for-the-selected-file) to **Flux**.
3. Execute the query with the `influxdb.runQuery` command or {{< keybind mac="⌃⌥E" other="Ctrl+Alt+E" >}}.
4. Query results appear in a new tab. If query results do not appear, see [Debug Flux queries](#debug-flux-queries).

## Explore your schema
With an InfluxDB connection configured, VS Code provides an overview of buckets,
measurements and tags in your InfluxDB organization.
Use the **InfluxDB** pane in VS code to explore your schema.

{{< img-hd src="/img/influxdb/2-0-tools-vsflux-explore-schema.png" alt="Explore your InfluxDB schema in VS Code" />}}

## Debug Flux queries
To view errors returned from Flux script executions, click the **Errors and Warnings**
icons in the bottom left of your VS Code window, and then select the **Output** tab in the debugging pane.

{{< img-hd src="/img/influxdb/2-0-tools-vsflux-errors-warnings.png" alt="VS Code errors and warnings"/>}}

## Upgrade the Flux extension
VS Code auto-updates by default extensions, but you are able to disable auto-update.
If auto-update is disabled, [manually update your VS Code Flux extension](https://code.visualstudio.com/docs/editor/extension-gallery#_update-an-extension-manually).
After updating the extension, reload VS Code to initialize the updated extensions.

## Flux extension commands

| Command                     | Description       | Keyboard shortcut                            | Menu context      |
|:-------                     |:-----------       |:-----------------:                           | ------------:     |
| `influxdb.refresh`          | Refresh           |                                              |                   |
| `influxdb.addConnection`    | Add Connection    |                                              | view/title        |
| `influxdb.runQuery`         | Run Query         | {{< keybind mac="⌃⌥E" other="Ctrl+Alt+E" >}} | editor/context    |
| `influxdb.removeConnection` | Remove Connection |                                              | view/item/context |
| `influxdb.switchConnection` | Switch Connection |                                              |                   |
| `influxdb.editConnection`   | Edit Connection   |                                              | view/item/context |