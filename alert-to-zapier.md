---
title: Use InfluxDB Tasks to Send Alerts to Zapier
description: >
  Learn how to use webhooks with InfluxDB to send alerts to Zapier using Zapier webhooks.
menu:
  resources:
    parent: How-to guides
weight: 102
---

If you have been a long time user of InfluxDB, the role of tasks within the platform is a
spotlight feature of the product. Tasks allow users to automatically execute a bit of Flux code: 
downsampling, transforming, or even creating data are all things that can be done with such a powerful tool 
for automation. When dealing with potentially large amounts of raw data, automation is key to an efficient 
workflow. A simple way to take the automation one step further is by using webhooks 
combined with Zapier, a third party web app automation service, to propagate alerts to a host of different 
applications and services with an effort to mitigate the level of micromanagement users must have when 
performing certain tasks. In this demonstration, we will be alerting to Discord, one of the most common messaging platforms today.

# Create a Zapier Webhook
Zapier Webhooks are a premium feature, meaning you need to pay for the service. For a payment free 
alternative, it is possible to use the InfluxDB application on the Zapier platform to send alerts for when 
a bucket is listed or data is queried, if that fits your needs. 
1. Log into the Zapier Dashboard and find the “Create Zap” button
2. Name your Zap
3. In the “Trigger” panel, select the Webhook as an event trigger
4. There are three possible events: retrieving a poll, catching a raw hook, or just catching a hook. We will choose the last option in this example.
5. Navigate to the “Set Up Trigger” where you can trigger on specific keys if you desire. In this example, we will leave it blank and continue.
6. In the “Test Trigger” tab, you will be given your webhook, which you will need to save and give to InfluxDB Cloud. You can also test the webhook here as well, but it is not necessary.

{{< img-hd src="static/img/resources/zapier-trigger.png" alt="Create a Zapier Webhook" />}}
Source: Zapier, August 2022

# Creating an InfluxDB Check
In this example, we will be using a default threshold check as the task, but it is possible to use your own 
task written in Flux code. To create a simple check, navigate to the "Alerts" tab on the left and click the "Create" button. Follow the prompts that appear to specify the correct specification for the check. Once the check is completed, navigate to the "Notification Endpoints" tab and create a new endpoint for your alert; if you are a paid InfluxDB user, you will be able to select HTTP as an endpoint instead of the Slack endpoint, or you can configure your endpoint using raw Flux in a similar manner shown the image below.

{{< img-hd src="static/img/resources/notification-endpoint.png" alt="Creating a Check" />}}
Source: InfluxDB, August 2022

{{< img-hd src="static/img/resources/flux-endpoint.png" alt="Creating a Check" />}}
Source: InfluxDB, August 2022

# Configuring an Action in Zapier
In the next panel of the Zapier user interface, you can now decide what you want to do when Zapier receives 
new information from the webhook you just created. You can add multiple actions if you desire, simply by 
clicking on the plus buttons. In this example, we will only be alerting to Discord.
1. Search for the Discord application in the app event panel
2. Select the event that you would want to happen when new information reaches the webhook. In this tutorial, 
I would like to send a channel message
3. Fill out the required fields for sending a message 
4. From here you will be able to test the messages and publish your Zap

{{< img-hd src="static/img/resources/zapier-success.png" alt="Configuring an Action in Zapier" />}}
Source: Zapier, August 2022

{{< img-hd src="static/img/resources/zapier-discord.png" alt="Configuring an Action in Zapier" />}}
Source: Discord, August 2022