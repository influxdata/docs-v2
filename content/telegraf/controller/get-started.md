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

1. [Create an API token](#create-an-api-token)
2. [Create a Telegraf configuration](#create-a-telegraf-configuration)
3. [Start a Telegraf agent](#start-a-telegraf-agent)
4. [View the reporting agent](#view-the-reporting-agent)
5. [Update the configuration](#update-the-configuration)
6. [Verify the configuration update](#verify-the-configuration-update)

## Create an API token

API tokens authenticate Telegraf agents when they retrieve configurations and
send heartbeats to {{% product-name %}}.

1.  Navigate to the **API Tokens** page.
2.  Click **+ Create API Token**.
3.  Enter a description--for example, `Getting started agent token`.
4.  Select a token **Expiration**.
5.  Select the permissions to assign to the token. For convenience, you can
    select one of the available **Permission Presets**.
    
    > [!Tip]
    > The **Telegraf Agent** preset includes all permissions a Telegraf agent
    > needs to interact with {{% product-name %}}.

    Telegraf agents need the following permissions to interact with
    {{% product-name %}}:

    - **Configurations**: Read
    - **Heartbeat**: Write

6.  Click **Create Token**.

> [!Important]
> #### Copy and store your token
>
> Copy your API token immediately after creation.
> The full token value is only displayed once and cannot be retrieved later.

_For more information about token permissions, see [Manage API tokens](/telegraf/controller/tokens/)._

## Create a Telegraf configuration

Configurations define what data Telegraf collects, how it processes the data,
and where it sends it.
For this guide, you'll create a simple configuration that prints a message to
stdout and reports agent health back to {{% product-name %}}.

1.  In the {{% product-name %}} user interface (UI), select **Configurations**
    in the navigation bar.
2.  Click **{{% icon "plus" %}} Add Config**.
3.  Enter a name and description for the configuration--for example,
    "Getting Started."
4.  In the **Code Editor**, enter the following TOML:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux/macOS](#)
[Windows (PowerShell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!----------------------------- BEGIN LINUX/MACOS ----------------------------->

```toml { .tc-dynamic-values }
[[inputs.exec]]
  commands = [
    ["echo", "Started with a config from Telegraf Controller"]
  ]
  data_format = "value"
  data_type = "string"

[[outputs.file]]
  files = ["stdout"]
  data_format = "template"
  template = "{{ .Time.Format \"15:04:05\" }}: {{ .Field \"value\" }}\n"

[[outputs.heartbeat]]
  url = "http://localhost:8000/agents/heartbeat"
  instance_id = "&{agent_id}"
  interval = "1m"
  include = ["hostname", "statistics", "configs", "status"]
  # Include to authorize with Telegraf Controller
  # Note: If using Telegraf 1.38.x or earlier, use INFLUX_TOKEN
  token = "${TELEGRAF_CONTROLLER_TOKEN}"

  [outputs.heartbeat.status]
    default = "ok"
```

<!------------------------------ END LINUX/MACOS ------------------------------>
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!------------------------------- BEGIN WINDOWS ------------------------------->

```toml { .tc-dynamic-values }
[[inputs.exec]]
  commands = [
    ["cmd", "/C", "echo Started with a config from Telegraf Controller"]
  ]
  data_format = "value"
  data_type = "string"

[[outputs.file]]
  files = ["stdout"]
  data_format = "template"
  template = "{{ .Time.Format \"15:04:05\" }}: {{ .Field \"value\" }}\n"

[[outputs.heartbeat]]
  url = "http://localhost:8000/agents/heartbeat"
  instance_id = "&{agent_id}"
  interval = "1m"
  include = ["hostname", "statistics", "configs", "status"]
  # Include to authorize with Telegraf Controller
  # Note: If using Telegraf 1.38.x or earlier, use INFLUX_TOKEN
  token = "${TELEGRAF_CONTROLLER_TOKEN}"

  [outputs.heartbeat.status]
    default = "ok"
```

<!-------------------------------- END WINDOWS -------------------------------->
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}    

    This configuration does the following:
    
    - Uses the `exec` input plugin to execute an `echo` command to output a message.
    - Uses the `file` output plugin to output the message to `stdout`, formatted
      using a template that includes a timestamp and the message.
    - Uses the heartbeat plugin to periodically send agent status information
      back to {{% product-name %}}, which lets you monitor agent health, track
      which configurations are loaded, and detect when agents stop reporting.
    - Uses the `TELEGRAF_CONTROLLER_TOKEN` (Telegraf 1.39+) or the `INFLUX_TOKEN`
      (Telegraf 1.38.x or earlier) environment variable to authorize with
      {{% product-name %}}.
    - Uses the `agent_id` [parameter](/telegraf/controller/configs/dynamic-values/#parameters)
      to set the `instance_id` which uniquely identifies the Telegraf agent.

    > [!Important]
    > #### Heartbeat URL and port
    >
    > The example above uses `http://localhost` and the default heartbeat port,
    > `8000`. Your {{% product-name %}} instance provides a default heartbeat
    > configuration with the heartbeat URL and port for your instance.

5.  Click **Create Configuration**.

## Start a Telegraf agent

With a configuration and token ready, start a Telegraf agent that pulls its
configuration from {{% product-name %}} and reports back via the heartbeat plugin.

### Use the command builder

{{% product-name %}} can build the `telegraf` command for you:

1.  In {{% product-name %}}, select **Configurations** in the navigation bar.
2.  Click the name of the configuration you created.
3.  Click **Use this Configuration**.
4.  In the command builder modal:
    
    1.  In the **Environment Variables** section, define the **INFLUX_TOKEN**
        environment variable using the raw token string of the API token you
        created. This authorizes the Telegraf agent to interact with
        {{% product-name %}}.
    2.  In the **Parameters** section, define the **agent_id** parameter with
        a unique agent identifier.
    3.  In the **Auto Update** section, enable auto-update and set the interval
        to `30s`. This instructs Telegraf to check for configuration updates
        every 30 seconds.

    {{< img-hd src="/img/telegraf/controller-gs-command-builder.png" alt="Telegraf Controller Command Builder" />}}
5.  Click **Copy Commands** to copy the generated command to your clipboard.
6.  Paste and run the command in your terminal.

### Run manually

Alternatively, start the agent manually by running the following commands in
your terminal.
Replace the placeholder values with your actual {{% product-name %}} URL and
port, configuration ID, API token, and agent ID:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux/macOS](#)
[Windows (PowerShell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!------------------- BEGIN LINUX/MACOS ------------------->

<!--pytest.mark.skip-->
```bash { placeholders="YOUR_TC_API_TOKEN|YOUR_CONFIG_ID|AGENT_ID" }
# Note: If using Telegraf 1.38.x or earlier, use INFLUX_TOKEN environment variable
export TELEGRAF_CONTROLLER_TOKEN=YOUR_TC_API_TOKEN

telegraf \
  --config "http://localhost:8888/api/configs/YOUR_CONFIG_ID/toml?agent_id=AGENT_ID" \
  --config-url-watch-interval 30s
```

<!-------------------- END LINUX/MACOS -------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-------------------- BEGIN WINDOWS ---------------------->

<!--pytest.mark.skip-->
```powershell { placeholders="YOUR_TC_API_TOKEN|YOUR_CONFIG_ID|AGENT_ID" }
# Note: If using Telegraf 1.38.x or earlier, use INFLUX_TOKEN environment variable
$env:TELEGRAF_CONTROLLER_TOKEN="YOUR_TC_API_TOKEN"

telegraf.exe `
  --config "http://localhost:8888/api/configs/YOUR_CONFIG_ID/toml?agent_id=AGENT_ID" `
  --config-url-watch-interval 30s
```

<!---------------------- END WINDOWS ---------------------->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`YOUR_TC_API_TOKEN`{{% /code-placeholder-key %}}:
  API token you created in the [previous step](#create-an-api-token)
- {{% code-placeholder-key %}}`YOUR_CONFIG_ID`{{% /code-placeholder-key %}}:
  Configuration ID from your configuration's detail page in {{% product-name %}}
- {{% code-placeholder-key %}}`AGENT_ID`{{% /code-placeholder-key %}}:
  A unique ID for your Telegraf agent

The `TELEGRAF_CONTROLLER_TOKEN` (Telegraf 1.39+) or the `INFLUX_TOKEN`
(Telegraf 1.38.x or earlier) environment variables authorize the agent to
retrieve the configuration and send heartbeats to {{% product-name %}}.

The `--config-url-watch-interval` flag tells Telegraf to check for configuration
updates at the specified interval.
In this example, the agent checks every 30 seconds and automatically reloads the
configuration if it has changed.

After starting, Telegraf retrieves the configuration from {{% product-name %}}
and begins collecting metrics.
You should see the timestamp and message printed to stdout.

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
message generated by the `exec` input plugin.

1.  In {{% product-name %}}, select **Configurations** in the navigation bar.
2.  Click the name of the configuration you created.
3.  Update the `echo` command to print a different message:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux/macOS](#)
[Windows (PowerShell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!------------------- BEGIN LINUX/MACOS ------------------->


```toml { callout="AN UPDATED" callout-color="orange" }
[[inputs.exec]]
  commands = [
    ["echo", "Started with AN UPDATED config from Telegraf Controller"]
  ]
  # ...
```

<!-------------------- END LINUX/MACOS -------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-------------------- BEGIN WINDOWS ---------------------->

```toml { callout="AN UPDATED" callout-color="orange" }
[[inputs.exec]]
  commands = [
    ["cmd", "/C", "echo Started with AN UPDATED config from Telegraf Controller"]
  ]
  # ...
```

<!---------------------- END WINDOWS ---------------------->
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

4.  Click **Save**.

## Verify the configuration update

Because you started Telegraf with `--config-url-watch-interval 30s`, the agent
checks for configuration updates every 30 seconds.
After you update the configuration in {{% product-name %}}, the agent detects
the change on its next check interval and automatically reloads.

Watch the terminal where Telegraf is running.
Within 30 seconds, the message returned in the `stdout` output updates to the 
new message, confirming that the agent picked up the updated configuration.

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
