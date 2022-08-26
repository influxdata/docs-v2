---
title: How to Alert Task to Zapier Webhook
description: >
  Learn how to use webhooks with InfluxDB to send alerts to Zapier
menu:
  resources:
    parent: How-to guides
weight: 102
---
### How To: Alert Task to Zapier Webhook

### By: Tyler Nguyen

If you have been a long time user of InfluxDB, the role of tasks within the platform is, without a doubt, a

spotlight feature of the product. Tasks allow users to automatically execute a bit of Flux code: 

downsampling, transforming, or even creating data are all things that can be done with such a powerful tool 

for automation. When dealing with potentially large amounts of raw data, automation is key to an efficient 

workflow. Although we know tasks are extraordinarily useful and aid the process of automatically carrying 

out repetitive jobs, there is still some degree of monitoring that needs to be done on the user end. 

Fortunately, there is an incredibly simple way to take the automation one step further by using webhooks 

combined with Zapier, a third party web app automation service, to propagate alerts to a host of different 

applications and services with an effort to mitigate the level of micromanagement users must have when 

performing certain tasks.


## 1. Create a Zapier Webhook

Zapier Webhooks are a premium feature, meaning you need to pay for the service. For a payment free 

alternative, it is possible to use the InfluxDB application on the Zapier platform to send alerts for when 

a bucket is listed or data is queried, if that fits your needs. 

- Log into the Zapier Dashboard and find the “Create Zap” button

-Name your Zap

- In the “Trigger” panel, select the Webhook as an event trigger

- There are three possible events: retrieving a poll, catching a raw hook, or just catching a hook. We will 

choose the last option in this example.

- Navigate to the “Set Up Trigger” where you can trigger on specific keys if you desire. In this example, we 

will leave it blank and continue.

- In the “Test Trigger” tab, you will be given your webhook, which you will need to save and give to InfluxDB 

Cloud. You can also test the webhook here as well, but it is not necessary.

{{< img-hd src="static/img/zapier-trigger.png" alt="1. Create a Zapier Webhook" />}}

## 2. Creating a Check

In this example, we will be using a default threshold check as the task, but it is possible to use your own 

task written in Flux code. To create a check, you can reference this article and follow the instructions 

for creating a deadman check in InfluxDB Cloud. Once the check is completed, follow the instructions in 

that same article for creating a notification endpoint and rule in InfluxDB Cloud; if you are a paid 

InfluxDB user, you will be able to select HTTP as an endpoint instead of the Slack endpoint. This is where 

you will paste the webhook from Zapier. 

{{< img-hd src="static/img/notification-endpoint.png" alt="2. Creating a Check" />}}

## 3. Configuring an Action in Zapier

In the next panel of the Zapier user interface, you can now decide what you want to do when Zapier receives 

new information from the webhook you just created. You can add multiple actions if you desire, simply by 

clicking on the plus buttons. In this example, we will only be alerting to Discord.

- Search for the Discord application in the app event panel

- Select the event that you would want to happen when new information reaches the webhook. In this tutorial, 

I would like to send a channel message

- Fill out the required fields for sending a message 

- From here you will be able to test the messages and publish your Zap

{{< img-hd src="static/img/zapier-success.png" alt="3. Configuring an Action in Zapier" />}}

{{< img-hd src="static/img/zapier-discord.png" alt="3. Configuring an Action in Zapier" />}}

## Conclusion

InfluxDB is an extremely versatile platform to store time series data given the ability to integrate with 

third party services. When paired with the right applications, InfluxDB becomes a very powerful tool for 

automation of pertinent tasks relevant to managing massive amounts of data. If you are an InfluxDB 

user and need help, please reach out using our community site or Slack channel. If 

you’re developing a cool IoT application on top of InfluxDB, we’d love to hear about it, so make sure to 

share it on social using #InfluxDB! Additionally, feel free to reach out to me directly in our community 

slack channel to share your thoughts, concerns, or questions. I’d love to get your feedback and help you 

with any problems you run into!