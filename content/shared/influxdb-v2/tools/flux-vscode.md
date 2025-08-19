
> [!Important]
> #### vsflux and Flux-LSP no longer maintained
> `vsflux` is no longer available in the Visual Studio Marketplace.
> The `vsflux` Visual Studio Code extension and the `flux-lsp` Flux Language Server Protocol plugin are no longer maintained.
> Their repositories have been archived and are no longer receiving updates.

The [Flux Visual Studio Code (VS Code) extension](https://marketplace.visualstudio.com/items?itemName=influxdata.flux)
provides Flux syntax highlighting, autocompletion, and a direct InfluxDB server
integration that lets you run Flux scripts natively and show results in VS Code.

##### On this page
- [Install the Flux VS Code extension](#install-the-flux-vs-code-extension)
- [Connect to InfluxDB](#connect-to-influxdb)
  - [Manage InfluxDB connections](#manage-influxdb-connections)
- [Query InfluxDB from VS Code](#query-influxdb-from-vs-code)
- [Explore your schema](#explore-your-schema)
- [Debug Flux queries](#debug-flux-queries)
- [Upgrade the Flux extension](#upgrade-the-flux-extension)
- [Flux extension commands](#flux-extension-commands)

## Install the Flux VS Code extension
The Flux VS Code extension is available in the **Visual Studio Marketplace**.
For information about installing extensions from the Visual Studio marketplace,
see the [Extension Marketplace documentation](https://code.visualstudio.com/docs/editor/extension-gallery).

Once installed, open the **Explorer** area of your VS Code user interface.
A new **InfluxDB** pane is available below your file explorer.

{{< img-hd src="/img/influxdb/2-1-tools-vsflux-influxdb-pane.png" alt="InfluxDB pane in VS Code" />}}

## Connect to InfluxDB
To create an InfluxDB connection in VS Code:

1. Hover over the **InfluxDB** pane and then click the **{{< icon "plus" >}}** icon that appears.

    {{< img-hd src="/img/influxdb/2-1-tools-vsflux-add-connection.png" alt="Add an InfluxDB connection in VS Code" />}}

2. Provide the required connection credentials:
    - **Type:** type of InfluxDB data source. Select **InfluxDB v2**.
    - **Name:** unique identifier for your InfluxDB connection.
    - **Hostname and Port:** InfluxDB host and port
      (see [InfluxDB OSS URLs](/influxdb/version/reference/urls/) or [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/)).
    - **Token:** InfluxDB [API token](/influxdb/version/admin/tokens/).
    - **Organization:** InfluxDB organization name.
3. Click **Test** to test the connection.
4. Once tested successfully, click **Save**.

### Manage InfluxDB connections
In the **InfluxDB** pane:

- **To edit a connection**, right click on the connection to edit and select **Edit Connection**.
- **To remove a connection**, right click on the connection to remove and select **Remove Connection**.
- **To switch to a connection**, right click on the connection to switch to and select **Switch To This Connection**.

## Query InfluxDB from VS Code
1. Write your Flux query in a new VS Code file.
2. Save your Flux script with the `.flux` extension or set the
   [VS Code Language Mode](https://code.visualstudio.com/docs/languages/overview#_changing-the-language-for-the-selected-file) to **Flux**.
3. Press {{< keybind mac="fn + F5" other="F5" >}} to execute the query.
4. VS Code displays a list of InfluxDB connection configurations.
   Select which InfluxDB connection to use to execute the query.
5. Query results appear in a new tab. If query results do not appear, see [Debug Flux queries](#debug-flux-queries).

## Explore your schema
After you've configured an InfluxDB connection, VS Code provides an overview of buckets,
measurements, and tags in your InfluxDB organization.
Use the **InfluxDB** pane in VS code to explore your schema.

{{< img-hd src="/img/influxdb/2-0-tools-vsflux-explore-schema.png" alt="Explore your InfluxDB schema in VS Code" />}}

## Debug Flux queries
To view errors returned from Flux script executions, click the **Errors and Warnings**
icons in the bottom left of your VS Code window, and then select the **Output** tab in the debugging pane.

{{< img-hd src="/img/influxdb/2-0-tools-vsflux-errors-warnings.png" alt="VS Code errors and warnings"/>}}

## Upgrade the Flux extension
VS Code auto-updates extensions by default, but you are able to disable auto-update.
If you disable auto-update, [manually update your VS Code Flux extension](https://code.visualstudio.com/docs/editor/extension-gallery#_update-an-extension-manually).
After updating the extension, reload your VS Code window ({{< keybind mac="⇧⌘P" other="Ctrl+Shift+P" >}},
and then `Reload Window`) to initialize the updated extensions.

## Flux extension commands

| Command                | Description    |
| :--------------------- | :------------- |
| `influxdb.refresh`     | Refresh        |
| `influxdb.addInstance` | Add Connection |
