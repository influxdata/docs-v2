---
title: Get started with Telegraf Controller
description: >
  Get started with Telegraf Controller by creating a configuration, generating
  an API token, starting a Telegraf agent, and verifying agent reporting.
menu:
  telegraf_controller:
    name: Get started
weight: 3
---

After you've [installed {{% product-name %}}](/telegraf/controller/install/) and
set up your owner account, you're ready to start managing Telegraf configurations
and agents.
This guide walks you through the core workflow: creating a configuration,
starting a Telegraf agent using the configuration, and verifying that the agent
reports back to {{% product-name %}}.

1. [Create a Telegraf configuration](#create-a-telegraf-configuration)
2. [Create an API token](#create-an-api-token)
3. [Start a Telegraf agent](#start-a-telegraf-agent)
4. [View the reporting agent](#view-the-reporting-agent)
5. [Update the configuration](#update-the-configuration)
6. [Verify the configuration update](#verify-the-configuration-update)

## Create a Telegraf configuration

Configurations define what data Telegraf collects, how it processes the data,
and where it sends it.
For this guide, you'll create a simple configuration that prints a message to
stdout and reports agent health back to {{% product-name %}}.

1.  In the {{% product-name %}} user interface (UI), select **Configurations**
    in the navigation bar.
2.  Click **{{% icon "plus" %}} Add Config**.
3.  Enter a name and description for the configuration—for example,
    "Getting Started."
4.  In the **Code Editor**, enter the following TOML:

    ```toml { .tc-dynamic-values }
    [[inputs.internal]]

    [[outputs.file]]
      files = ["stdout"]
      data_format = "influx"
    
    [[outputs.heartbeat]]
      url = "http://localhost:8000/agents/heartbeat"
      instance_id = "&{agent_id}"
      interval = "1m"
      include = ["hostname", "statistics", "configs", "status"]
      token = "${INFLUX_TOKEN}"

      [outputs.heartbeat.status]
        default = "ok"
    ```

    Telegraf requires at least one input plugin and one output plugin.
    This configuration uses the `internal` input plugin to collect Telegraf's
    own metrics and writes them to stdout using the `file` output plugin.

5.  Click **Create Configuration**.

After creating the configuration, {{% product-name %}} automatically adds a
[heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/) to the
configuration.
The heartbeat plugin periodically sends agent status information back to
{{% product-name %}}, which lets you monitor agent health, track which
configurations are loaded, and detect when agents stop reporting.

## Create an API token

API tokens authenticate Telegraf agents when they retrieve configurations and
send heartbeats to {{% product-name %}}.

1.  Navigate to the **API Tokens** page.
2.  Click **Create Token**.
3.  Enter a description—for example, `Getting started agent token`.
4.  Click **Create**.

> [!Important]
> #### Copy and store your token
>
> Copy your API token immediately after creation.
> The full token value is only displayed once and cannot be retrieved later.

The default token permissions are sufficient for this guide.
For more information about token permissions, see
[Manage API tokens](/telegraf/controller/tokens/).

## Start a Telegraf agent

With a configuration and token ready, start a Telegraf agent that pulls its
configuration from {{% product-name %}} and reports back via the heartbeat plugin.

### Use the command builder

{{% product-name %}} can build the `telegraf` command for you:

1.  In {{% product-name %}}, select **Configurations** in the navigation bar.
2.  Click the name of the configuration you created.
3.  Click **Use this Configuration**.
4.  In the command builder modal, enable **Auto-update** and set the interval to
    `1m` (one minute).
5.  Click **Copy Commands** to copy the generated command to your clipboard.
6.  Paste and run the command in your terminal.

### Run manually

Alternatively, start the agent manually by running the following commands in
your terminal.
Replace the placeholder values with your actual {{% product-name %}} URL,
configuration ID, and API token:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux/macOS](#)
[Windows (PowerShell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!------------------- BEGIN LINUX/MACOS ------------------->

<!--pytest.mark.skip-->
```bash { placeholders="YOUR_TC_API_TOKEN|YOUR_CONFIG_ID" }
export INFLUX_TOKEN=YOUR_TC_API_TOKEN

telegraf \
  --config "http://localhost:8888/api/configs/YOUR_CONFIG_ID/toml" \
  --config-url-watch-interval 1m
```

<!-------------------- END LINUX/MACOS -------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-------------------- BEGIN WINDOWS ---------------------->

<!--pytest.mark.skip-->
```powershell { placeholders="YOUR_TC_API_TOKEN|YOUR_CONFIG_ID" }
$env:INFLUX_TOKEN="YOUR_TC_API_TOKEN"

telegraf.exe `
  --config "http://localhost:8888/api/configs/YOUR_CONFIG_ID/toml" `
  --config-url-watch-interval 1m
```

<!---------------------- END WINDOWS ---------------------->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`YOUR_TC_API_TOKEN`{{% /code-placeholder-key %}}:
  API token you created in the [previous step](#create-an-api-token)
- {{% code-placeholder-key %}}`YOUR_CONFIG_ID`{{% /code-placeholder-key %}}:
  Configuration ID from your configuration's detail page in {{% product-name %}}

The `INFLUX_TOKEN` environment variable authorizes the agent to retrieve the
configuration and send heartbeats to {{% product-name %}}.

The `--config-url-watch-interval` flag tells Telegraf to check for configuration
updates at the specified interval.
In this example, the agent checks every minute and automatically reloads the
configuration if it has changed.

After starting, Telegraf retrieves the configuration from {{% product-name %}}
and begins collecting metrics.
You should see `internal` metrics printed to stdout.

## View the reporting agent

Once the agent sends its first heartbeat (within about one minute), it appears
in {{% product-name %}}.

1.  In {{% product-name %}}, select **Agents** in the navigation bar.
2.  Confirm your agent appears in the list with an **Ok** status.
3.  Click the **More button ({{% icon "tc-more" %}})** and select
    **View Details** to see agent metadata, the loaded configuration, and
    reporting history.

## Update the configuration

To see how configuration changes propagate to running agents, update the
configuration to use a different output format.

1.  In {{% product-name %}}, select **Configurations** in the navigation bar.
2.  Click the name of the configuration you created.
3.  In the **Code Editor**, change the `data_format` from `"influx"` to `"json"`:

    ```toml
    [[outputs.file]]
      files = ["stdout"]
      data_format = "json"
    ```

4.  Click **Save**.

## Verify the configuration update

Because you started Telegraf with `--config-url-watch-interval 1m`, the agent
checks for configuration updates every minute.
After {{% product-name %}} saves the updated configuration, the agent detects
the change and automatically reloads.

Watch the terminal where Telegraf is running.
Within one minute, the stdout output changes from InfluxDB line protocol format
to JSON format, confirming that the agent picked up the updated configuration.

## Next steps

- [Create and manage configurations](/telegraf/controller/configs/) to define
  more advanced Telegraf pipelines.
- [Use dynamic values](/telegraf/controller/configs/dynamic-values/) to keep
  configurations portable across environments.
- [Set up reporting rules](/telegraf/controller/agents/reporting-rules/) to
  define when agents are considered not reporting.
- [Configure agent statuses](/telegraf/controller/agents/status/) to monitor
  agent health using CEL expressions.
- [Manage API tokens](/telegraf/controller/tokens/) to control access to
  {{% product-name %}} APIs.