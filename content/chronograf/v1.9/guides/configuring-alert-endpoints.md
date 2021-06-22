---
title: Configure Chronograf alert endpoints
aliases:
  - /chronograf/v1.9/guides/configure-kapacitor-event-handlers/
description: Send alert messages with Chronograf alert endpoints.
menu:
  chronograf_1_9:
    name: Configure alert endpoints
    weight: 70
    parent: Guides
---

Chronograf alert endpoints can be configured using the Chronograf user interface to create Kapacitor-based event handlers that send alert messages.
You can use Chronograf to send alert messages to specific URLs as well as to applications.

This guide offers step-by-step instructions for configuring Chronograf alert endpoints.

## Kapacitor event handlers supported in Chronograf

Chronograf integrates with [Kapacitor](/{{< latest "kapacitor" >}}/), InfluxData's data processing platform, to send alert messages to event handlers.
Chronograf supports the following event handlers:

- [Alerta](#alerta)
- [BigPanda](#bigpanda)
- [Kafka](#kafka)
- [OpsGenie](#opsgenie)
- [OpsGenie2](#opsgenie2)
- [PagerDuty](#pagerduty)
- [PagerDuty2](#pagerduty2)
- [Pushover](#pushover)
- [Sensu](#sensu)
- [ServiceNow](#servicenow)
- [Slack](#slack)
- [SMTP](#smtp)
- [Talk](#talk)
- [Teams](#talk)
- [Telegram](#telegram)
- [VictorOps](#victorops)
- [Zenoss](#zenoss)

To configure a Kapacitor event handler in Chronograf, [install Kapacitor](/{{< latest "kapacitor" >}}/introduction/installation/) and [connect it to Chronograf](/{{< latest "kapacitor" >}}/working/kapa-and-chrono/#add-a-kapacitor-instance).
The **Configure Kapacitor** page includes the event handler configuration options.

## Alert endpoint configurations

Alert endpoint configurations appear on the Chronograf Configure Kapacitor page.
You must have a connected Kapacitor instance to access the configurations.
For more information, see [Kapacitor installation instructions](/{{< latest "kapacitor" >}}/introduction/installation/) and how to [connect a Kapacitor instance](/{{< latest "kapacitor" >}}/working/kapa-and-chrono/#add-a-kapacitor-instance) to Chronograf.

Note that the configuration options in the **Configure alert endpoints** section are not all-inclusive.
Some event handlers allow users to customize event handler configurations per [alert rule](/chronograf/v1.9/guides/create-a-kapacitor-alert/).
For example, Chronograf's Slack integration allows users to specify a default channel in the **Configure alert endpoints** section and a different channel for individual alert rules.

### Alerta

**To configure an Alerta alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page, click the **Alerta** tab.
2. Enter the following:

    - **Environment**: Alerta environment. Can be a template and has access to the same data as the AlertNode.Details property. Default is set from the configuration.
    - **Origin**: Alerta origin. If empty, uses the origin from the configuration.
    - **Token**: Default Alerta authentication token..
    - **Token Prefix**: Default token prefix. If you receive invalid token errors, you may need to change this to “Key”.
    - **User**: Alerta user.
    - **Configuration Enabled**: Check to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.

### BigPanda

**To configure an BigPanda alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **BigPanda** tab.
2. Enter the following:

    - **URL**: BigPanda [alerts API URL](https://docs.bigpanda.io/reference#alerts-how-it-works).
      Default is `https://api.bigpanda.io/data/v2/alerts`.
    - **Token**: BigPanda [API Authorization token (API key)](https://docs.bigpanda.io/docs/api-key-management).
    - **Application Key**: BigPanda [App Key](https://docs.bigpanda.io/reference#integrating-monitoring-systems).
    - **Insecure Skip Verify**: Required if using a self-signed TLS certificate. Select to skip TLS certificate chain and host
      verification when connecting over HTTPS.
    - **Configuration Enabled**: Select to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.

### Kafka

**To configure a Kafka alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **Kafka** tab.
2. Enter the following:

    - **ID**: Unique identifier for a Kafka cluster. Default is `localhost`.
    - **Brokers**: List of Kafka broker addresses, using the `host:port` format.
    - **Timeout**: Maximum amount of time to wait before flushing an incomplete batch. Default is `10s`.
    - **Batch Size**: Number of messages batched before sending to Kafka. Default is `100`.
    - **Batch Timeout**: Timeout period for the batch. Default is `1s`.
    - **Use SSL**: Select to enable SSL communication.
    - **SSL CA**: Path to the SSL CA (certificate authority) file.
    - **SSL Cert**: Path to the SSL host certificate.
    - **SSL Key**: Path to the SSL certificate private key file.
    - **Insecure Skip Verify**: Required if using a self-signed TLS certificate. Select to skip TLS certificate chain and host
      verification when connecting over HTTPS.
    - **Configuration Enabled**: Check to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.

To enable Kafka services using TICKscript, see [Kafka event handler (Kapacitor)](/{{< latest "kapacitor" >}}/event_handlers/kafka/).

### OpsGenie

{{% warn %}}
**Note:** Support for OpsGenie Events API 1.0 is deprecated (as [noted by OpGenie](https://docs.opsgenie.com/docs/migration-guide-for-alert-rest-api)).
As of June 30, 2018, the OpsGenine Events API 1.0 is disabled.
Use the [OpsGenie2](#opsgenie2) alert endpoint.
{{% /warn %}}

### OpsGenie2

Send an incident alert to OpsGenie teams and recipients using the Chronograf alert endpoint.

**To configure a OpsGenie alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **OpsGenie** tab.
2. Enter the following information:

    - **API Key**: API key (or GenieKey).
      To find the API key, sign into your [OpsGenie account](https://app.opsgenie.com/auth/login)
      and select the **Settings** menu option in the **Admin** menu.
    - **Teams**: List of [OpsGenie teams](https://docs.opsgenie.com/docs/teams) to be alerted.
    - **Recipients** List of [OpsGenie team members](https://docs.opsgenie.com/docs/teams#section-team-members)) to receive alerts.
    - **Select recovery action**: Actions to take when an alert recovers:
        - Add a note to the alert
        - Close the alert
    - **Configuration Enabled**: Select to enable configuration.

4. Click **Save Changes** to save the configuration settings.
5. Click **Send Test Alert** to verify the configuration.

See [Alert API](https://docs.opsgenie.com/docs/alert-api) in the OpsGenie documentation for details on the OpsGenie Alert API

See [OpsGenie V2 event handler](/{{< latest "kapacitor" >}}/event_handlers/opsgenie/v2/) in the Kapacitor documentation for details about the OpsGenie V2 event handler.

See the [AlertNode (Kapacitor TICKscript node) - OpsGenie v2](/{{< latest "kapacitor" >}}/nodes/alert_node/#opsgenie-v2) in the Kapacitor documentation for details about enabling OpsGenie services using TICKscripts.

### PagerDuty

{{% warn %}}
The original PagerDuty alert endpoint is deprecated.
Use the [PagerDuty2](#pagerduty2) alert endpoint.
{{% /warn %}}

### PagerDuty2

**To configure a PagerDuty alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **PagerDuty** tab.
2. Enter the following:

    - **Routing Key**: GUID of your PagerDuty Events API V2 integration, listed as "Integration Key" on the Events API V2 integration's detail page. See [Create a new service](https://support.pagerduty.com/docs/services-and-integrations#section-create-a-new-service) in the PagerDuty documentation details on getting an "Integration Key" (`routing_key`).
    - **PagerDuty URL**: URL used to POST a JSON body representing the event. This value should not be changed. Valid value is `https://events.pagerduty.com/v2/enqueue`.
    - **Configuration Enabled**: Select to enable this configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.

See the [PagerDuty Events API V2 Overview](https://v2.developer.pagerduty.com/docs/events-api-v2)
for details on the PagerDuty Events API and recognized event types (`trigger`, `acknowledge`, and `resolve`).

To enable a new "Generic API" service using TICKscript, see [AlertNode (Kapacitor TICKscript node) - PagerDuty v2](/{{< latest "kapacitor" >}}/nodes/alert_node/#pagerduty-v2).

### Pushover

**To configure a Pushover alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **Pushover** tab.
2. Enter the following:

    - **User Key**: Pushover USER_TOKEN.
    - **Token**: Pushover API token.
    - **Pushover URL**: Pushover API URL.
      Default is `https://api.pushover.net/1/messages.json`.
    - **Configuration Enabled**: Check to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.

### Sensu

**To configure a Sensu alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **Sensu** tab.
2. Enter the following:

    - **Source**: Event source. Default is `Kapacitor`.
    - **Address**: URL of [Sensu HTTP API](https://docs.sensu.io/sensu-go/latest/migrate/#architecture).
    - **Configuration Enabled**: Select to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.

### ServiceNow

**To configure a ServiceNow alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **ServiceNow** tab.
2. Enter the following:

    - **URL**: ServiceNow API URL. Default is `https://instance.service-now.com/api/global/em/jsonv2`.
    - **Source**: Event source.
    - **Username**: ServiceNow username.
    - **Password**: ServiceNow password.
    - **Configuration Enabled**: Select to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.

### Slack

**To configure a Slack alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **Slack** tab.
2. Enter the following:

    - **Nickname this Configuration**: Unique name for a Slack endpoint if you
      have more than one Slack alert endpoint.
    - **Slack WebHook URL**: _(Optional)_ Slack webhook URL _(see [Slack webhooks](https://api.slack.com/messaging/webhooks))_
    - **Slack Channel**: _(Optional)_ Slack channel or user to send messages to.
      Prefix with `#` to send to a channel.
      Prefix with `@` to send directly to a user.
      If not specified, Kapacitor sends alert messages to the channel or user
      specified in the [alert rule](/chronograf/v1.9/guides/create-a-kapacitor-alert/)
      or configured in the **Slack Webhook**.
    - **Configuration Enabled**: Check to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.


**To add another Slack configuration:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **Slack** tab.
2. Click **{{< icon "plus" >}} Add Another Config**.
3. Complete steps 2-4 [above](#slack).

### SMTP

**To configure a SMTP alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **SMTP** tab.
2. Enter the following:

    - **SMTP Host**: SMTP host. Default is `localhost`.
    - **SMTP Port**: SMTP port. Default is `25`.
    - **From Email**: Email address to send messages from.
    - **To Email**: Email address to send messages to.
    - **User**: SMTP username.
    - **Password**: SMTP password.
    - **Configuration Enabled**: Select to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.

### Talk

**To configure a Talk alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **Talk** tab.
2. Enter the following:

    - **URL**: Talk API URL.
    - **Author Name**: Message author name.
    - **Configuration Enabled**: Select to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.

### Teams

**To configure a Microsoft Teams alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **Teams** tab.
2. Enter the following:

    - **Channel URL**: Microsoft Teams channel URL.
    - **Configuration Enabled**: Select to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.

### Telegram

**To configure a Telegram alert endpoint:**

1. [Set up a Telegram bot and credentials](/{{< latest "kapacitor" >}}/guides/event-handler-setup/#telegram-setup).
2. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **Telegram** tab.
3. Enter the following:

    - **Token**:
    - **Chat ID**: 
    - **Select the alert message format**: Telegram message format
        - Markdown _(default)_
        - HTML
    - **Disable link previews**: Disable [link previews](https://telegram.org/blog/link-preview) in Telegram messages.
    - **Disable notifications**: Disable notifications on iOS devices and sounds on Android devices.
      Android users will continue to receive notifications.
    - **Configuration Enabled**: Select to enable configuration.

### VictorOps

**To configure a VictorOps alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **VictorOps** tab.
2. Enter the following:

    - **API Key**: VictorOps API key.
    - **Routing Key**: VictorOps [routing key](https://help.victorops.com/knowledge-base/routing-keys/).
    - **VictorOps URL**: VictorOps alert API URL.
      Default is `https://alert.victorops.com/integrations/generic/20131114/alert`.
    - **Configuration Enabled**: Select to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.

### Zenoss

**To configure a Zenoss alert endpoint:**

1. In the **Configure Alert Endpoints** of the **Configure Kapacitor Connection** page,
   click the **Zenoss** tab.
2. Enter the following:

    - **URL**: Zenoss [router endpoint URL](https://help.zenoss.com/zsd/RM/configuring-resource-manager/enabling-access-to-browser-interfaces/creating-and-changing-public-endpoints).
      Default is `https://tenant.zenoss.io:8080/zport/dmd/evconsole_router`.
    - **Username**: Zenoss username. Leave blank for no authentication.
    - **Password**: Zenoss password. Leave blank for no authentication.
    - **Action (Router Name)**: Zenoss [router name](https://help.zenoss.com/dev/collection-zone-and-resource-manager-apis/anatomy-of-an-api-request#AnatomyofanAPIrequest-RouterURL).
      Default is `EventsRouter`.
    - **Router Method**: [EventsRouter method](https://help.zenoss.com/dev/collection-zone-and-resource-manager-apis/codebase/routers/router-reference/eventsrouter).
      Default is `add_event`.
    - **Event Type**: Event type. Default is `rpc`.
    - **Event TID**: Temporary request transaction ID. Default is `1`.
    - **Collector Name**: Zenoss collector name. Default is `Kapacitor`.
    - **Kapacitor to Zenoss Severity Mapping**: Map Kapacitor severities to [Zenoss severities](https://help.zenoss.com/docs/using-collection-zones/event-management/event-severity-levels).
        - **OK**: Clear _(default)_
        - **Info**: Info _(default)_
        - **Warning**: Warning _(default)_
        - **Critical**: Critical _(default)_
    - **Configuration Enabled**: Select to enable configuration.

3. Click **Save Changes** to save the configuration settings.
4. Click **Send Test Alert** to verify the configuration.
