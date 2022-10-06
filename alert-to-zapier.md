---
title: Use InfluxDB tasks to send alerts to Zapier
description: >
  Learn how to use InfluxDB to send alerts to Zapier using InfluxDB tasks and Zapier webhooks.
menu:
  resources:
    parent: How-to guides
weight: 102
draft: true
---

InfluxDB tasks let you execute Flux scripts on a schedule and automate operations such as
downsampling, transforming, or even creating data.
[Zapier](https://zapier.com/) is a workflow automation service that integrates with many
 different applications and services.
Learn how to use InfluxDB tasks to trigger a Zapier webhook and activate automated
processes tied to the webhook.

This guide walks through using InfluxDB and Zapier to send an alert to [Discord](https://discord.com/), a widely used messaging platform.

## Create a Zapier webhook
[Zapier webhooks](https://zapier.com/page/webhooks/) provide an API endpoint that you can send messages to and trigger other automated processes. Webhooks are a premium feature and require a [paid plan](https://zapier.com/pricing).

To create a Zapier webhook:

1. Log into the [Zapier Dashboard](https://zapier.com/app/login) and click **Create Zap**.
2. Name your Zap.
3. In the **Trigger** panel, select **Webhook** as an event trigger.
4. Select **Catch Hook** from the list of  possible events.
5. Navigate to the **Set Up Trigger** tab.
   Here you can configure the Zap to only trigger on specific keys.
   For this example, leave it blank and continue.
6. The **Test Trigger** tab provides your webhook URL. Save this URL.
   You can also test the webhook, but it is not necessary.

{{< img-hd src="static/img/resources/zapier-trigger.png" alt="Create a Zapier Webhook" />}}
{{% caption %}}
Zapier, August 2022
{{% /caption %}}

## Create an InfluxDB check

[Create an InfluxDB check](https://docs.influxdata.com/influxdb/cloud/monitor-alert/checks/create) to query and alert on a metric you want to monitor.
Use a default **threshold** check as the task. 
_It is possible to use your own task written in Flux code, but for this guide, use the InfluxDB UI to create the check._

Once the check is completed, [create a notification endpoint](https://docs.influxdata.com/influxdb/cloud/monitor-alert/notification-endpoints/create/). Select **HTTP** as an endpoint.

{{< img-hd src="static/img/resources/notification-endpoint.png" alt="Create a check" />}}
{{% caption %}}
InfluxDB Cloud, August 2022
{{% /caption %}}

{{% caption %}}
InfluxDB Cloud, August 2022
{{% /caption %}}

## Configure a Zapier action

In the Zapier user interface, configure what you want to do when Zapier receives 
new information from the webhook you just created. You can add multiple actions if you desire.
For this example, send an alert to Discord.

1. In the **App Event** panel, search for the **Discord** application.
2. Select the event to trigger when new information reaches the webhook.
   For this example, select **Send Channel Message to Discord**.
3. Provide your Discord credentials. 
4. Test the messages and publish your Zap

{{< img-hd src="static/img/resources/zapier-success.png" alt="Configuring an Action in Zapier" />}}
Source: Zapier, August 2022

{{< img-hd src="static/img/resources/zapier-discord.png" alt="Configuring an Action in Zapier" />}}
Source: Discord, August 2022
