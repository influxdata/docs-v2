---
title: Create a Telegraf configuration
seotitle: Create Telegraf configurations with Telegraf Controller
description: >
  Use Telegraf Controller to create Telegraf TOML configuration files.
  Upload existing configurations, write raw TOML in the Code Editor, or use
  the Telegraf Builder visual interface to manage and configure plugins.
menu:
  telegraf_controller:
    name: Create a configuration
    parent: Manage configurations
weight: 101
related:
  - /telegraf/controller/configs/substitute-values/
---

Create a configuration to define how Telegraf collects, processes, and writes
metrics. Telegraf Controller stores the configuration as TOML that you can use
across agents. Upload existing configurations, write raw TOML in the Code
Editor, or use the Telegraf Builder visual interface to manage and configure
plugins.

## Create a configuration

1.  In the {{% product-name %}} web interface, select **Configurations** in the 
    navigation bar. 
2.  Click **{{% lucide "plus" %}} Add Config**.
3.  Enter a configuration name and optional description.
    Names are unique among configurations, matched exactly including case,
    and can be up to 255 characters.
    If the name is already taken, {{% product-name %}} reports
    `Configuration "<name>" already exists` and the dialog stays open.
    Through the API, the create request returns `409 Conflict` with
    `"error": "config_name_taken"`.
    A configuration and a configuration group can share a name.
    Descriptions can be up to 1,000 characters and support Markdown.
    See [Format a description with Markdown](#format-a-description-with-markdown).
4.  _(Optional)_ To assign
    [aliases](/telegraf/controller/configs/aliases/) to the configuration,
    click **{{% lucide "plus" %}} Add Alias** and enter an alias that
    follows the
    [naming rules](/telegraf/controller/configs/aliases/#alias-naming-rules).
5.  Use the {{% product-name %}} [Code Editor](#use-the-code-editor) or
    [Telegraf Builder](#use-the-telegraf-builder) to provide or build the
    Telegraf configuration TOML.
6.  Click **Create Configuration**.

When you create a configuration, {{% product-name %}} records it as the first
version in the configuration's
[version history](/telegraf/controller/configs/versions/).

### Use the Code Editor

The {{% product-name %}} **Code Editor** is an in-browser TOML editor that lets
you upload or manually write Telegraf configuration TOML.

_For detailed information about using the Code Editor, see
[Use the Code Editor](/telegraf/controller/configs/ui/code-editor/)._

{{< img-hd src="/img/telegraf/controller-code-editor.png" alt="Telegraf Controller Code Editor" />}}

### Use the Telegraf Builder {note="Beta"}

The **Telegraf Builder** is a visual interface for adding and configuring
Telegraf plugins in a Telegraf configuration. The Telegraf Builder is
currently a beta feature.

_For detailed information about using the Telegraf Builder, see
[Use the Telegraf Builder](/telegraf/controller/configs/ui/telegraf-builder/)._

{{< img-hd src="/img/telegraf/controller-telegraf-builder.png" alt="Telegraf Builder in Telegraf Controller" />}}

> [!Warning]
> #### The Telegraf Builder does not support all Telegraf plugins
> 
> We are in the process of adding support for more Telegraf plugins in the
> Telegraf Builder. You can use plugins that are not currently supported by the
> builder, but you must add and edit them with the Code Editor.

### Format a description with Markdown

Configuration descriptions support Markdown.
The description editor has two tabs: **Write**, where you type the
description, and **Preview**, which shows how {{% product-name %}} renders it.
A counter under the field shows the length of the description against the
1,000-character limit.

{{% product-name %}} renders standard Markdown without extensions:

- Headings, paragraphs, and blockquotes
- Bulleted and numbered lists
- Bold, italic, and inline code
- Fenced code blocks
- Links, which open in a new browser tab

A single line break in the editor renders as a line break.
Tables, task lists, and strikethrough are not supported.
Raw HTML appears as literal text, images are replaced with their alternative
text, and links with unsafe URL schemes such as `javascript:` are removed.

The configuration detail page renders the full description.
Where a description appears on a single line, only bold, italic, and inline
code formatting is kept, and headings, lists, and links are shown as plain
text. Single-line descriptions appear in the configuration list, in page
headers, in the **Agent Configurations** card on an agent detail page, and in
the dialogs for adding configurations to a group.

## Heartbeat output plugin {note="Telegraf 1.37+"}

When adding a configuration, {{% product-name %}} prepopulates the
configuration with a [Telegraf heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/).
This plugin reports agent information back to the {{% product-name %}} heartbeat
API and lets you monitor the health of your deployed Telegraf agents.

```toml { .tc-substitute-values }
[[outputs.heartbeat]]
url = "http://localhost:8000/agents/heartbeat"
instance_id = "&{agent_id}"
interval = "1m"
include = ["hostname", "statistics", "configs"]
token = "${TELEGRAF_CONTROLLER_TOKEN}"
```

To monitor agents with {{% product-name %}}, include a heartbeat plugin in
your Telegraf configurations.

> [!Important]
> #### Authorize heartbeats using an API token
>
> If {{% product-name %}} requires authorization on the **Heartbeat** API,
> include the `token` option in your heartbeat plugin configuration.
> Provide a {{% product-name %}} token with **write** permissions on the
> **Heartbeat** API.
>
> We recommend defining the `TELEGRAF_CONTROLLER_TOKEN` environment variable
> when starting Telegraf and using it to define the token in your heartbeat
> plugin. On **Telegraf 1.38.x or earlier**, use `INFLUX_TOKEN` instead. For
> details, see [Use API tokens](/telegraf/controller/tokens/use/#for-heartbeat-requests).

## Next steps

- [Substitute values](/telegraf/controller/configs/substitute-values/)
  to keep configurations portable across environments.
- [Apply the configuration](/telegraf/controller/configs/use/) to your
  Telegraf agents.
